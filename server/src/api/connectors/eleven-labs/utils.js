import path from 'path';
import fs from 'fs/promises';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export const deleteAllAudio = async (directory) => {
  const files = await fs.readdir(directory);

  for (const file of files) {
    if (file.endsWith('.mp3')) {
      await fs.unlink(path.join(directory, file));
    }
  }
};

export const generateAudio = async (
  audioFileName,
  directory,
  text,
  voiceId = '21m00Tcm4TlvDq8ikWAM'
) => {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVEN_LABS_API_KEY,
  });
  const audio = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    model_id: 'eleven_monolingual_v2',
  });
  const filePath = path.join(directory, audioFileName);
  const chunks = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);
  fs.writeFile(filePath, audioBuffer);
  return filePath;
};
