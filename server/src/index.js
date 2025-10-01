import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import { notFound, errorHandler } from './services/error-handlers.js';
import integrations from './api/integrations/index.js';
import workflows from './api/workflows.js';


const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200);
    res.json({
        message: 'Greetings!'
    });
});

app.use('/integrations', integrations);
app.use('/workflows', workflows);

// Not found middleware
app.use(notFound);

// Error handler
app.use(errorHandler);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})