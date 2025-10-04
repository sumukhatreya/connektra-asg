import Workflow from '../../../models/workflow.js';
import { generateAudio } from '../eleven-labs/utils.js';
import path from 'path';
import { fileURLToPath } from 'url';

export const webhook = async (req, res, next) => {
  try {
    const { service, event, data } = req.body;
    const directory = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      '..',
      '..',
      '..',
      'audio'
    );
    if (service === 'airtable') {
      const workflow = await Workflow.findOne({
        triggerNode: 'airtable',
        triggerEvent: event,
      });
      if (workflow) {
        const { baseId, tableId, recordId, record } = data;
        const recordText = JSON.stringify(record).replace(/[^a-zA-Z0-9 ]/g, '');
        const audioFileName = `${baseId}-${tableId}-${recordId}.mp3`;
        await generateAudio(audioFileName, directory, recordText);
        res.status(201).json({ message: `Audio file created: ${audioFileName}`});
      } else {
        res.status(404);
        throw new Error('Workflow not found');
      }
    }
  } catch (error) {
    next(error);
  }
};

// export default webhook;
