import Router from 'express';
import crypto from 'crypto';
import Connector from '../../../models/connector.js';
import { generateSecureString, decryptToken } from '../../../helpers/utils.js';


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
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    const codeChallengeMethod = 'S256';
    // Hacky method for state verification. Ideally should be cached.
    await Connector.create({ provider: 'airtable', state: state });

    const airtableRedirectUrl = `${baseUrl}?client_id=${client_id}&redirect_uri=${redirectUrl}&response_type=${responsetype}&state=${state}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    res.redirect(airtableRedirectUrl);
  } catch (error) {
    await Connector.deleteOne({ provider: 'airtable' });
    next(error);
  }
});

router.get('/oauth', async (req, res, next) => {
    try {
        const { code, state } = req.query;
        if (!code) {
            throw new Error('Authorization code not received from airtable url');
        } else if (!state) {
            throw new Error('State not received from airtable url');
        }
        const airtableConn = await Connector.findOne({ provider: 'airtable' }, { lean: true });
        const { state: storedState } = airtableConn;
        if (state !== decryptToken(storedState)) {
            throw new Error('State strings do not match');
        }
        



    } catch(error) {
        next(error);
    }
});

export default router;
