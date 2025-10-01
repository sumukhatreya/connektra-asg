import mongoose from 'mongoose';
import { encryptToken } from '../helpers/utils.js';
const { Schema, model } = mongoose;

const connectorSchema = new Schema({
    provider: {
        type: String,
        required: true,
        enum: ['airtable', 'eleven-labs']
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    expiresIn: {
        type: Number,
    },
    state: {
        type: String,
    },
    codeVerifier: {
        type: String,
    },
    scope: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'pending', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

connectorSchema.pre('save', function(next) {
  if (this.isModified('accessToken')) {
    this.accessToken = encryptToken(this.accessToken);
  }
  next();
});

const Connector = model('connector', connectorSchema);

export default Connector;


