import {Router} from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { getDB } from '../db';
import {getExtension} from '../utils';
import fs from 'fs';
import { Video, VideoStatus } from '../types';

const router = Router();
const upload = multer({});

// Creates default directories
fs.mkdirSync('data/mp4', {recursive: true});
fs.mkdirSync('data/hls', {recursive: true});

// Health check route
router.get('/', (req, res) => res.sendStatus(200));

/**
 * POST /api/request
 * 
 * Register a future video upload.
 * Reply with an upload ID which should be later used for further requests.
 * The upload ID defines the encoding process for one video file.
 * Output: {uploadId}
 */
router.post('/request', async (req, res) => {
  const db = await getDB();
  const id = uuidv4();
  await db.run('INSERT INTO Videos (uploadId) VALUES (?)', id);
  res.json({uploadId: id});
});

/**
 * POST /api/upload/:uploadId
 * 
 * Upload a single MP4 video file.
 * The request should be a multipart/form-data request, similar to a form send.
 * The video file should be the single element of the form, with the
 * "media" key.
 * Once done, triggers automatically the encoding process.
 * You must first request an uploadId before upload the video.
 */
router.post('/upload/:uploadId', upload.single('media'), async (req, res) => {
  // Check for the request format
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return res.status(400).json({
      error: 'Upload error',
      message: 'Missing Content-Type header as multipart/form-data',
    });
  }
  // Check if the file is available
  if (!req.file) {
    return res.status(400).json({
      error: 'Upload error',
      message: 'The media key in the multipart form request does not contain the video file.',
    });
  }

  // Check if the upload ID is valid
  const uploadId = req.params.uploadId;
  const db = await getDB();
  const ref: Video = await db.get('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
  if (!ref) {
    return res.status(400).json({
      error: 'Upload error',
      message: 'Wrong upload ID ! You need to request a valid upload ID with /api/request.',
    });
  }
  if (ref.status !== VideoStatus.NOT_UPLOADED && ref.status !== VideoStatus.UPLOADING) {
    return res.status(400).json({
      error: 'Upload error',
      message: 'A video has already been uploaded with this upload ID, you need a new one !',
    });
  }

  // Check the file extension
  const ext = getExtension(req.file.originalname);
  if (!ext || ext !== 'mp4') {
    return res.status(400).json({
      error: 'Upload error',
      message: 'File type unsupported ! Only MP4 files are supported.',
    });
  }

  // Write the file to the disk
  const fileMP4Path = `data/mp4/${uploadId}.${ext}`;
  fs.writeFileSync(fileMP4Path, req.file.buffer);

  // Set the video status to "encoding"
  await db.run(`UPDATE Videos 
    SET 
      status = ${VideoStatus.ENCODING}, 
      mp4Path = ?,
      originalName = ? 
    WHERE uploadId = ?`,
    [fileMP4Path, req.file.originalname, uploadId]);

  res.sendStatus(200);
});

export default router;