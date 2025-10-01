import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const connectorSchema = new Schema({
    provider: {
        type: String,
        required: true,
        enum: ['airtable', 'eleven-labs'],
        index: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    user: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Encryption needs to be added in pre-hook for access and refresh tokens

const Connector = model('Connector', connectorSchema);

export default Connector;


