import Router from 'express';
import crypto from 'crypto';
import Connector from '../../../models/connector.js';
import {
  generateSecureString,
  decryptToken,
  base64Encode,
} from '../../../helpers/utils.js';
import { makeRequest } from '../../../services/http-services.js';

const router = Router();

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
    console.log('State sent in Uri', state);
    const airtableConn = await Connector.findOne({ provider: 'airtable' });
    console.log('This is the found airtableConn', airtableConn);
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
    console.log('This is the received data', data);
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

    await airtableConn.save();
    res.redirect('http://localhost:3000/')
  } catch (error) {
    await Connector.deleteOne({ provider: 'airtable' });
    next(error);
  }
});

export default router;
