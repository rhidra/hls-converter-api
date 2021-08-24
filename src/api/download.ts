import {Router} from 'express';
import { getZippedFolderSync, removeExtension } from '../utils';
import { getDB } from '../db';
import { Video, VideoStatus } from '../types';

const router = Router();

router.get('/download/:uploadId', async (req, res) => {
  // Check if the upload ID is valid
  const db = await getDB();
  const uploadId = req.params.uploadId;
  const video = await db.get<Video>('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
  if (!video || (video.status !== VideoStatus.DONE && video.status !== VideoStatus.DOWNLOADED)) {
    return res.status(400).json({
      error: 'Wrong upload ID !',
      message: 'Your file either does not exist or has not been encoded yet.',
    });
  }

  // Generate the zip file and sends it
  const result = await getZippedFolderSync(`data/hls/${req.params.uploadId}`);
  const filename = removeExtension(video.originalName ?? '');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-disposition', `attachment;filename=${filename}.zip`);
  res.setHeader('Content-Length', result.length);
  res.send(result);
});

export default router;