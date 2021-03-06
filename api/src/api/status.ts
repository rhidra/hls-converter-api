import {Router} from 'express';
import { getDB } from '../db';
import { Video, VideoStatus } from '../types';

const router = Router();

/**
 * GET /api/status/:uploadId
 *
 * Returns the current status of a file processing.
 */
router.get('/status/:uploadId', async (req, res) => {
  // Check the upload ID
  const uploadId = req.params.uploadId;
  if (!uploadId) {
    return res.status(400).json({
      error: 'Wrong check',
      message: 'You must specify an upload ID to check its status.',
    });
  }

  // Check if the upload ID exists
  const db = await getDB();
  const ref = await db.get<Video>('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
  if (!ref) {
    return res.status(400).json({
      error: 'Wrong check',
      message: 'The upload ID does not exists.',
    });
  }

  switch (ref.status) {
    case VideoStatus.NOT_UPLOADED:
      return res.json({
        status: 'NOT_UPLOADED',
        message: 'Your file has not been uploaded yet.',
      });
    case VideoStatus.PENDING:
      return res.json({
        status: 'PENDING',
        message: 'Your file is waiting to be encoded.',
      });
    case VideoStatus.ENCODING:
      return res.json({
        status: 'ENCODING',
        message: 'Your file is currently being encoded.',
      });
    case VideoStatus.DONE:
    case VideoStatus.DOWNLOADED:
      return res.json({
        status: 'DONE',
        message: 'Your file is encoded and is waiting for download.',
      });
    case VideoStatus.ERROR:
    default:
      return res.json({
        status: 'ERROR',
        message: 'An unknown error has been encountered.',
      });
  }
});

export default router;