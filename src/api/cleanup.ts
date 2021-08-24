import {Router} from 'express';
import fs from 'fs';
import { getDB } from '../db';
import { Video, VideoStatus } from '../types';

const router = Router();

router.get('/cleanup', async (req, res) => {
  const db = await getDB();
  const videos = await db.all<Video[]>(`
    SELECT * FROM Videos
    WHERE status = ${VideoStatus.DOWNLOADED}
    OR status = ${VideoStatus.NOT_UPLOADED}
    OR status = ${VideoStatus.ERROR}
  `);

  videos.forEach(video => {
    try {
      fs.unlinkSync(`data/mp4/${video.uploadId}.mp4`);
    } catch(e) {}
    try {
      fs.rmdirSync(`data/hls/${video.uploadId}`, {recursive: true});
    } catch(e) {}
  });

  await db.run(`
    DELETE FROM Videos
    WHERE status = ${VideoStatus.DOWNLOADED}
    OR status = ${VideoStatus.NOT_UPLOADED}
    OR status = ${VideoStatus.ERROR}
  `);

  res.sendStatus(200);
});

export default router;