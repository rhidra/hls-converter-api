import {Router} from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { getDB } from '../db';
import {getExtension} from '../utils';
import fs from 'fs';
import bodyParser from 'body-parser';
import { EncodingSpeed, Video, VideoStatus } from '../types';
import { limitRequestPerDay } from '../middleware/auth';

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
 * Register a future video upload, with the encoding settings.
 * Reply with an upload ID which should be later used for further requests.
 * The upload ID defines the encoding process for one video file.
 * Input body: {
 *  encodingSpeed: {0, 1 or 2} (default: 1),
 *  segmentSize: integer (default: 6),
 *  framerate: integer (default: 25),
 *  streams: {0, 1, 2, 3, 4, or 5}[] (default: [0]),
 * }
 * Output: {uploadId}
 */
router.post('/request', bodyParser.json(), async (req, res) => {
  const db = await getDB();
  const uploadId = uuidv4();
  const encodingSpeed: EncodingSpeed = req.body.encodingSpeed ?? EncodingSpeed.MEDIUM;
  const segmentSize = req.body.segmentSize ?? 6;
  const framerate = req.body.framerate ?? 25;
  const streams: number[] = req.body.streams ?? [0];

  // Create the video object
  await db.run(`
    INSERT INTO Videos (uploadId, encodingSpeed, segmentSize, framerate)
    VALUES (?, ?, ?, ?)`, [uploadId, encodingSpeed, segmentSize, framerate]
  );

  // Create the streams quality
  await Promise.all(streams.map((q, i) => db.run(`
    INSERT INTO StreamsQuality (uploadId, stream, quality)
    VALUES (?, ?, ?)`, [uploadId, i, Math.max(0, q)]
  )));

  res.json({uploadId});
});

// Filter to use only Rapid API or frontend requests
// All other users are limited to one upload a day (even a failed one).
router.use('/upload', limitRequestPerDay());

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
  const ref = await db.get<Video>('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
  if (!ref) {
    return res.status(400).json({
      error: 'Upload error',
      message: 'Wrong upload ID ! You need to request a valid upload ID with /api/request.',
    });
  }
  if (ref.status !== VideoStatus.NOT_UPLOADED && ref.status !== VideoStatus.PENDING) {
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

  // Set the video status to "encoding"
  const fileMP4Path = `data/mp4/${uploadId}.${ext}`;
  await db.run(`UPDATE Videos
    SET
      status = ${VideoStatus.PENDING},
      originalName = ?
    WHERE uploadId = ?`,
    [req.file.originalname, uploadId]);

  // Write the file to the disk
  fs.writeFileSync(fileMP4Path, req.file.buffer);

  // Upload done
  res.sendStatus(200);
});

export default router;