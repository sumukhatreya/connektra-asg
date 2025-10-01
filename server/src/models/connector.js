import mongoose from 'mongoose';
import { encryptToken } from '../helpers/utils'
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
    expiresAt: {
        type: Date,
    },
    state: {
        type: String,
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

const Connector = model('Connector', connectorSchema);

export default Connector;


