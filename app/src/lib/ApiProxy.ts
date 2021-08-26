import { EncodingSettings } from "../types";

export default class ApiProxy {
  baseUrl = 'http://localhost:8080';

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
}