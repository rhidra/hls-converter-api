import fs from 'fs';
import { VideoStatus, Video } from '../types';
import {getDB} from '../db';
import {getExtension} from '../utils';

async function runServer() {
  fs.watch('data/mp4', async (eventType, filename) => {
    if (eventType !== 'rename') {
      return;
    }
    const ext = getExtension(filename);
    const uploadId = filename.substring(0, filename.length - ext.length - 1);
    if (ext !== 'mp4') {
      return;
    }

    const db = await getDB();
    const res: Video = await db.get('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
    if (res.status !== VideoStatus.PENDING || !res.mp4Filename || res.hlsFilename) {
      return;
    }
    
    console.log(`Processing ${filename}`);
  });
}

runServer();