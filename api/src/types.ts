export type Video = {
  uploadId: string;
  originalName?: string;
  status: VideoStatus;
  encodingSpeed: EncodingSpeed;
  segmentSize: number;
  framerate: number;
};

export type StreamQualityElement = {
  uploadId: string;
  stream: number;
  quality: StreamQuality;
}

export enum VideoStatus {
  NOT_UPLOADED = 0,
  PENDING = 1,
  ENCODING = 2,
  DONE = 3,
  DOWNLOADED = 4,
  ERROR = 5,
};

// Compromise between fast encoding / large files
export enum EncodingSpeed {
  FAST = 0,
  MEDIUM = 1,
  SLOW = 2,
};

export enum StreamQuality {
  MOBILE_240P = 0,
  MOBILE_360P = 1,
  SD_480P = 2,
  SD_540P = 3,
  HD_720P = 4,
  HD_1080P = 5,
}

export type Ip = {
  id: string;
  ip: string;
  date: string;
};