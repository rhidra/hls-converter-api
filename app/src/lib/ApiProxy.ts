import { EncodingSettings } from "../types";

export default class ApiProxy {
  baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://hls-converter.com';

  async requestUploadId(settings: EncodingSettings) {
    try {
      const res = await fetch(`${this.baseUrl}/api/request`,  {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encodingSpeed: settings.encodingSpeed,
          segmentSize: settings.segmentSize,
          framerate: settings.framerate,
          streams: settings.streams,
        }),
      });
      const content = await res.json();
      return content.uploadId;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  async uploadVideoFile(uploadId: string, file: File) {
    const body = new FormData();
    body.append('media', file);

    const res = await fetch(`${this.baseUrl}/api/upload/${uploadId}`,  {method: 'POST', body});
    return res;
  }

  async checkStatus(uploadId: string) {
    const res = await fetch(`${this.baseUrl}/api/status/${uploadId}`,  {method: 'GET'});
    return await res.json();
  }

  async downloadFile(uploadId: string) {
    const res = await fetch(`${this.baseUrl}/api/download/${uploadId}`,  {method: 'GET'});
    return await res.blob();
  }
}