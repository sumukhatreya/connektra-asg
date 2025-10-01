import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import { notFound, errorHandler } from './helpers/error-handlers.js';
import mongoose from 'mongoose';
import connectors from './api/connectors/index.js';
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

app.use('/connectors', connectors);
app.use('/workflows', workflows);

// Not found middleware
app.use(notFound);

// Error handler
app.use(errorHandler);


const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/connektra-asg-db';

// mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
//   .then(() => app.listen(port, () => console.log(`Listening on port ${port}.`)))
//   .catch(err => console.log('Error: ', err));

mongoose.connect(dbUrl)
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}.`)))
  .catch(err => console.log('Error: ', err));
