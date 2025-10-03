import Router from 'express';
import Workflow from '../models/workflow.js';

const router = Router();

router.post('/create', async (req, res, next) => {
    try {
        await Workflow.deleteMany({});
        const workflow = await Workflow.create(req.body);
        res.status(201).json(workflow);

    } catch (error) {
        next(error);
    }
});

export default router;