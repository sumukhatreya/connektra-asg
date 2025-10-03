import Router from 'express';
import { makeRequest } from '../../../services/http-services.js'

const router = Router();

// Get list of voices from eleven labs
router.get('/voices', async (req, res, next) => {
    try {
        const url = 'https://api.elevenlabs.io/v1/voices';
        const apiKey = process.env.ELEVEN_LABS_API_KEY
        const headers = { 'xi-api-key': apiKey }
        const data = await makeRequest(url, 'GET', headers);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
})


export default router;
