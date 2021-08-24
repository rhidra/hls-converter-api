import fs from 'fs';
import path from 'path';
import { VideoStatus, Video, StreamQuality, EncodingSpeed, StreamQualityElement } from '../types';
import {getDB} from '../db';
import {getExtension, removeExtension} from '../utils';
import {spawn} from 'child_process';

let isProcessing = false;

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
  setInterval(
    () => {
    fs.readdir('data/mp4', async (err, files) => {
      if (err) {
        console.error('Error reading /data/mp4', err);
      }
      if (!isProcessing) {
        for (const filename of files) {
          await checkMP4File(filename);
        }
      }
    });
  }, 10000);

}


// Check and process an MP4 file if it needs to
// @param filename MP4 file name e.g: '1234-b6a8.mp4'
async function checkMP4File(filename: string) {
  const ext = getExtension(filename);
  const uploadId = removeExtension(filename);
  if (ext !== 'mp4') {
    return;
  }

  // Wait until all other jobs are done
  await new Promise<void>(resolve => {
    function check_() {
      if (isProcessing) {
        setTimeout(check_, 1000);
      } else {
        resolve();
      }
    }
    check_();
  });
  
  const db = await getDB();
  try {
    // Lock the encoding process
    isProcessing = true;

    // Check if the video status is valid for encoding
    const video = await db.get<Video>('SELECT * FROM Videos WHERE uploadId = ?', uploadId);
    if (!video || (video.status !== VideoStatus.PENDING && video.status !== VideoStatus.ENCODING)) {
      isProcessing = false;
      return;
    }

    // Change video status to ENCODING
    console.log(`Change video status of ${uploadId} to ENCODING`)
    await db.run('UPDATE Videos SET status = ? WHERE uploadId = ?', [VideoStatus.ENCODING, uploadId]);

    // Encoding inputs
    const mp4Path = path.join(process.cwd(), `data/mp4/${uploadId}.mp4`);
    const hlsPath = path.join(process.cwd(), `data/hls/${uploadId}`);
    const {encodingSpeed, segmentSize, framerate} = video;

    // Get the streams quality settings
    const streamsEl: StreamQualityElement[] = await db.all('SELECT * FROM StreamsQuality WHERE uploadId = ?', uploadId);
    const streams = [...streamsEl].sort((a, b) => a.stream - b.stream).map(el => el.quality);

    // Encoding to HLS
    await encodeMP4ToHLS(mp4Path, hlsPath, encodingSpeed, segmentSize, framerate, streams);
    
    // Unlock encoding process and change the video status to DONE
    await db.run('UPDATE Videos SET status = ? WHERE uploadId = ?', [VideoStatus.DONE, uploadId]);
    isProcessing = false;

    console.log(`Encoding of ${uploadId} done !`);
  } catch (err) {
    console.error(`Cannot encode the video ${uploadId}`);
    console.error(err);
    await db.run('UPDATE Videos SET status = ? WHERE uploadId = ?', [VideoStatus.ERROR, uploadId]);
    isProcessing = false;
  }
}


/**
 * Main transcoding function
 * @param mp4Path input MP4 file to transcode e.g: 'data/mp4/1234-a5b6.mp4'
 * @param hlsPath output directory path e.g: 'data/hls/1234-a5b6'
 */
async function encodeMP4ToHLS(mp4Path: string, hlsPath: string, encodingSpeed: EncodingSpeed, segmentSize: number, framerate: number, streams: StreamQuality[]) {
  console.log('Transcoding', mp4Path);

  // Video encoding in HLS for adaptive bitrate and resolution streaming
  // Reference : https://www.martin-riedl.de/2020/04/17/using-ffmpeg-as-a-hls-streaming-server-overview/
  fs.mkdirSync(hlsPath, {recursive: true});
  const ffmpegExec = path.join(path.dirname(require.resolve('ffmpeg-static')), 'ffmpeg');

  const child = spawn(ffmpegExec, [
    '-i', `${mp4Path}`,
    // Creates multiple video feeds, down scaling the resolution
    '-filter_complex',
    buildScalingString(streams),
    // Speed of conversion, fix framerate at 25, fix the segment duration
    '-preset', mapEncodingSpeed(encodingSpeed), '-g', formatInteger(framerate, 5, 120), '-sc_threshold', '0',

    // Creates multiple streams with different bitrates
    ...buildBitrateParameters(streams),

    // For the audio, the n feeds are identical
    ...streams.map(() => ['-map', 'a:0']).flat(),
    // Audio encoding (AAC), audio bitrate, stereo
    '-c:a', 'aac', '-b:a', '128k', '-ac', '2',

    // Output format HLS, 6 seconds videos
    '-f', 'hls', '-hls_time', formatInteger(segmentSize, 2, 10), '-hls_playlist_type', 'event', '-hls_flags', 'independent_segments',

    // File structure settings
    '-master_pl_name', 'master.m3u8',
    '-hls_segment_filename', `stream_%v/data_%06d.ts`, '-strftime_mkdir', '1',
    '-var_stream_map', buildStreamMap(streams),

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

function mapEncodingSpeed(speed: EncodingSpeed): string {
  switch(speed) {
    case EncodingSpeed.FAST:
      return 'superfast';
    case EncodingSpeed.MEDIUM:
      return 'medium';
    case EncodingSpeed.SLOW:
      return 'veryslow';
  }
}

function formatInteger(rate: number, min: number, max: number): string {
  const r = Math.min(max, Math.max(min, Math.floor(rate)))
  return `${r}`;
}

// Map the stream quality to its [width, height]
function mapQuality2Size(q: StreamQuality): string[] {
  switch(q) {
    case StreamQuality.MOBILE_240P:
      return ['416', '234'];
    case StreamQuality.MOBILE_360P:
      return ['640', '360'];
    case StreamQuality.SD_480P:
      return ['768', '432'];
    case StreamQuality.SD_540P:
      return ['960', '540'];
    case StreamQuality.HD_720P:
      return ['1280', '720'];
    case StreamQuality.HD_1080P:
      return ['1920', '1080'];
  }
}

// Map the stream quality to its [bitrate, maxBitrate, bufferSize]
// The max birate is bitrate + bitrate * 10%
// The bufsize is bitrate * 150% (it should be further adjusted but we don't have time)
function mapQuality2Bitrate(q: StreamQuality): string[] {
  switch(q) {
    case StreamQuality.MOBILE_240P:
      return ['145k', '160k', '400k'];
    case StreamQuality.MOBILE_360P:
      return ['365k', '400k', '600k'];
    case StreamQuality.SD_480P:
      return ['730k', '800k', '1100k'];
    case StreamQuality.SD_540P:
      return ['2000k', '2200k', '3000k'];
    case StreamQuality.HD_720P:
      return ['3000k', '3300k', '4500k'];
    case StreamQuality.HD_1080P:
      return ['6000k', '6600k', '9000k'];
  }
}

// Builds the FFMPEG string for scaling of all the video streams
// e.g: For 2 streams with low and high quality [0, 4]
// "[v:0]split=2[vtemp001][vtemp002];[vtemp001]scale=w=416:h=234[vout001];[vtemp002]scale=w=1280:h=720[vout002]"
function buildScalingString(streams: StreamQuality[]): string {
  // Splits the original stream in n streams
  let s = `[v:0]split=${streams.length}`;
  streams.forEach((q, i) => s += `[vtemp${i}]`);
  s += ';';

  // For each stream, scale it to be the appropriate width and height
  streams.forEach((q, i) => {
    const [w, h] = mapQuality2Size(q);
    s += `[vtemp${i}]`; // In stream identifier
    s += `scale=w=${w}:h=${h}`; // Stream scaling
    s += `[vout${i}]`; // Out stream identifier
    if (i !== streams.length-1) {
      s += ';'; // Semicolon between instructions
    }
  });

  return s;
}

// Build the array of arguments to generate streams with multiple bitrates
// e.g: For 2 streams
// ['-map', '[vout001]', '-c:v:0', 'libx264', '-b:v:0',  '145k', '-maxrate:v:0',  '160k', '-bufsize:v:0',  '800k',
//  '-map', '[vout002]', '-c:v:1', 'libx264', '-b:v:1', '3000k', '-maxrate:v:1', '3300k', '-bufsize:v:1', '4000k']
function buildBitrateParameters(streams: StreamQuality[]): string[] {
  const args = [] as string[];
  streams.forEach((q, i) => {
    const [bitrate, maxBitrate, bufferSize] = mapQuality2Bitrate(q);

    // In stream identifier
    args.push('-map');
    args.push(`[vout${i}]`);

    // Set the same codec for every stream
    args.push(`-c:v:${i}`);
    args.push('libx264');

    // Set the bitrate for every stream
    args.push(`-b:v:${i}`);
    args.push(bitrate);

    // Set the max bitrate for every stream
    args.push(`-maxrate:v:${i}`);
    args.push(maxBitrate);

    // Set the buffer for bitrate cap for every stream
    args.push(`-bufsize:v:${i}`);
    args.push(bufferSize);
  });
  return args;
}

// Builds the parameter for the "-var_stream_map" argument
// e.g: 'v:0,a:0 v:1,a:1' for 2 streams
function buildStreamMap(streams: StreamQuality[]): string {
  return streams.map((q, i) => `v:${i},a:${i}`).join(' ');
}

runServer();