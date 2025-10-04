import Router from 'express';
import crypto from 'crypto';
import Connector from '../../../models/connector.js';
import {
  generateSecureString,
  decryptToken,
  base64Encode,
} from '../../../helpers/utils.js';
import { makeRequest } from '../../../services/http-services.js';
import { webhook } from './webhook.js'

const router = Router();

router.post('/webhook', webhook);

// Redirect endpoint to initiate OAuth 2.0 integration
router.get('/redirect', async (req, res, next) => {
  try {
    const baseUrl = 'https://airtable.com/oauth2/v1/authorize';
    const redirectUrl = 'http://localhost:3000/connectors/airtable/oauth';
    const client_id = process.env.AIRTABLE_CLIENT_ID;
    const responsetype = 'code';
    const state = generateSecureString();
    const scope = 'data.records:read data.records:write schema.bases:read';
    const codeVerifier = generateSecureString();
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    const codeChallengeMethod = 'S256';
    console.log('State thats being stored', state);
    // Hacky method for state and code verification. Better solution would be to cache.
    await Connector.create({ provider: 'airtable', state, codeVerifier });

    const airtableRedirectUrl = `${baseUrl}?client_id=${client_id}&redirect_uri=${redirectUrl}&response_type=${responsetype}&state=${state}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    res.redirect(airtableRedirectUrl);
  } catch (error) {
    await Connector.deleteOne({ provider: 'airtable' });
    next(error);
  }
});

// Request and store access and refresh tokens in db
router.get('/oauth', async (req, res, next) => {
  try {
    const {
      code,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      error,
      error_description: errorDetails,
    } = req.query;

    if (error) {
      throw new Error(errorDetails);
    }
    if (!code) {
      throw new Error('Authorization code not received from airtable url');
    }
    if (!state) {
      throw new Error('State not received from airtable url');
    }
    const airtableConn = await Connector.findOne({ provider: 'airtable' });
    const { state: storedState, codeVerifier } = airtableConn;
    console.log('Stored state', storedState);
    if (state !== storedState) {
      throw new Error('State strings do not match');
    }
    const reqUrl = 'https://airtable.com/oauth2/v1/token';
    const credentials = base64Encode(
      `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
    );
    const headers = {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = new URLSearchParams({
      code,
      client_id: process.env.AIRTABLE_CLIENT_ID,
      redirect_uri: 'http://localhost:3000/connectors/airtable/oauth',
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    });

    const data = await makeRequest(reqUrl, 'POST', headers, params.toString());
    const {
      scope,
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken,
    } = data;

    airtableConn.accessToken = accessToken;
    airtableConn.refreshToken = refreshToken;
    airtableConn.scope = scope;
    airtableConn.expiresIn = expiresIn;
    airtableConn.status = 'success';

    console.log("Airtable access token", accessToken);

    await airtableConn.save();
    res.redirect('http://localhost:5173/')
  } catch (error) {
    await Connector.deleteOne({ provider: 'airtable' });
    next(error);
  }
});

// Check if application is integrated with airtable
router.get('/is-integrated', async (req, res, next) => {
  try {
    const airtableConn = await Connector.findOne({ provider: 'airtable' });
    if (airtableConn) {
      res.status(200).json({ message: 'Connection found!' });
    } else {
      res.status(404).json({ message: 'Service not connected!'});
    }
  } catch (error) {
    next(error);
  }

});


// Get all records from a table
router.get('/:baseId/:tableId', async (req, res, next) => {
  try {
    const { baseId, tableId } = req.params;
    const connector = await Connector.findOne({ provider: 'airtable' });
    const url = `${process.env.AIRTABLE_API_BASE}/${baseId}/${tableId}`;
    const accessToken = decryptToken(connector.accessToken);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const data = await makeRequest(url, 'GET', headers);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

// Get a single record
router.get('/:baseId/:tableId/:recordId', async (req, res, next) => {
  try {
    const { baseId, tableId, recordId } = req.params;
    const connector = await Connector.findOne({ provider: 'airtable' });
    const url = `${process.env.AIRTABLE_API_BASE}/${baseId}/${tableId}/${recordId}`;
    const accessToken = decryptToken(connector.accessToken);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const data = await makeRequest(url, 'GET', headers);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

// Create a record
router.post('/:baseId/:tableId', async (req, res, next) => {
  try {
    const { baseId, tableId } = req.params;
    const { fields } = req.body;
    const connector = await Connector.findOne({ provider: 'airtable' });
    const url = `${process.env.AIRTABLE_API_BASE}/${baseId}/${tableId}`;
    const accessToken = decryptToken(connector.accessToken);
    const headers = { 
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const body = { fields };
    const data = await makeRequest(url, 'POST', headers, body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});



export default router;
