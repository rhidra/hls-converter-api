export enum VideoStatus {
  NOT_UPLOADED = 0,
  PENDING = 1,
  ENCODING = 2,
  DONE = 3,
  DOWNLOADED = 4,
  ERROR = 5,
}

export type Video = {
  uploadId: string;
  originalName?: string;
  mp4Path?: string;
  hlsPath?: string;
  status: VideoStatus;
}