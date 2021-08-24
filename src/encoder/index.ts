import fs from 'fs';
import path from 'path';
import { VideoStatus, Video } from '../types';
import {getDB} from '../db';
import {getExtension} from '../utils';
import {spawn} from 'child_process';

// Main function, filesystem watcher
async function runServer() {
  // File system watcher
  fs.watch('data/mp4', async (eventType, filename) => {
    if (eventType !== 'rename') {
      return;
    }
    checkMP4File(filename);
  });

  // Regular job to check for forgotten files to encode
  setInterval(() => {
    fs.readdir('data/mp4', (err, files) => {
      if (err) {
        console.error('Error reading /data/mp4', err);
      }
      files.forEach(filename => checkMP4File(filename));
    });
  }, 10000);

}

let isProcessing = false;

// Check and process an MP4 file if it needs to
// @param filename MP4 file name e.g: '1234-b6a8.mp4'
async function checkMP4File(filename: string) {
  const ext = getExtension(filename);
  const uploadId = filename.substring(0, filename.length - ext.length - 1);
  if (ext !== 'mp4') {
    return;
  }


  const db = await getDB();
  const res: Video = await db.get('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
  if (res.status !== VideoStatus.PENDING || !res.mp4Path || res.hlsPath) {
    return;
  }

  const mp4Path = path.join(process.cwd(), res.mp4Path);
  const hlsPath = path.join(process.cwd(), `data/hls/${uploadId}`);

  if (isProcessing) {
    return;
  }
  isProcessing = true;
  await encodeMP4ToHLS(mp4Path, hlsPath);
  isProcessing = false;

}


/**
 * Main transcoding function
 * @param mp4Path input MP4 file to transcode e.g: 'data/mp4/1234-a5b6.mp4'
 * @param hlsPath output directory path e.g: 'data/hls/1234-a5b6'
 */
async function encodeMP4ToHLS(mp4Path: string, hlsPath: string) {
  console.log('Transcoding', mp4Path);

  // Video encoding in HLS for adaptive bitrate and resolution streaming
  // Reference : https://www.martin-riedl.de/2020/04/17/using-ffmpeg-as-a-hls-streaming-server-overview/
  fs.mkdirSync(hlsPath, {recursive: true});
  const ffmpegExec = path.join(path.dirname(require.resolve('ffmpeg-static')), 'ffmpeg');
  const speed = 'veryfast'; // Maybe put veryslow for prod

  const child = spawn(ffmpegExec, [
    '-i', `${mp4Path}`,
    // Creates two video feed, down scaling the resolution
    '-filter_complex',
    '[v:0]split=2[vtemp001][vtemp002];[vtemp001]scale=w=234:h=416[vout001];[vtemp002]scale=w=720:h=1280[vout002]',
    // Speed of conversion, fix framerate at 25, fix the segment duration
    '-preset', speed, '-g', '25', '-sc_threshold', '0',

    // Creates 2 versions: codec H.264, 2000k/6000k bitrate, with a bitrate cap at 10% and some buffer size
    '-map', '[vout001]', '-c:v:0', 'libx264', '-b:v:0',  '145k', '-maxrate:v:0',  '160k', '-bufsize:v:0',  '800k',
    '-map', '[vout002]', '-c:v:1', 'libx264', '-b:v:1', '3000k', '-maxrate:v:1', '3300k', '-bufsize:v:1', '4000k',

    // For the audio, the two feed are identical: Audio encoding (AAC), audio bitrate, stereo
    '-map', 'a:0', '-map', 'a:0',
    '-c:a', 'aac', '-b:a', '128k', '-ac', '2',

    // Output format HLS, 6 seconds videos
    '-f', 'hls', '-hls_time', '6', '-hls_playlist_type', 'event', '-hls_flags', 'independent_segments',

    // File structure settings
    '-master_pl_name', 'master.m3u8',
    '-hls_segment_filename', `stream_%v/data_%06d.ts`, '-strftime_mkdir', '1',
    '-var_stream_map', 'v:0,a:0 v:1,a:1',

    // Output
    `stream_%v.m3u8`,
  ], {cwd: hlsPath});

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return new Promise<void>((resolve, reject) => {
    child.once('error', (err: any) => reject(err));
    child.once('exit', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Error code ${code}`);
      }
    });
  });
}

runServer();