import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const connectorSchema = new Schema({
    triggerNode: {
        type: String,
        enum: ['airtable', 'elevenlabs']
    },
    triggerEvent: {
        type: String,
        enum: ['create', 'update']
    },
    actionNode: {
        type: String,
        enum: ['airtable', 'elevenlabs']
    },
    actionEvent: {
        type: String,
        enum: ['speech', 'clone']
    }
}, { timestamps: true });

const Workflow = model('workflow', connectorSchema);

export default Workflow;


