import Router from 'express';
import airtable from './airtable/index.js';

const router = Router();

router.get('/', (req, res) => {
    res.status(200);
    res.json({
        message: 'Integrations!'
    });
});

router.use('/airtable', airtable);

export default router;
