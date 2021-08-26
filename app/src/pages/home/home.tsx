import React, { useState } from 'react';
import Header from '../../layouts/header';
import { EncodingSettings } from '../../types';
import FileUploader from './FileUploader';
import UploadState from './UploadState';
import {removeExtension} from '../../utils/utils';
import ApiProxy from '../../lib/ApiProxy';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(file: File, settings: EncodingSettings) {
    setIsUploading(true);
    const api = new ApiProxy();

    // Request an upload ID with the encoding settings
    const uploadId = await api.requestUploadId(settings);
    
    // Upload the video file
    const ok = await api.uploadVideoFile(uploadId, file);

    // Wait for the encoding to be done...
    let done = false;
    while (!done) {
      const {status, message} = await api.checkStatus(uploadId);

      if (status === 'DONE') {
        done = true;
      } else {
        await new Promise<void>(r => setTimeout(() => r(), 1000))
      }
    }

    // Download the file
    const blob = await api.downloadFile(uploadId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${removeExtension(file.name)}.zip`;
    document.body.appendChild(a);
    a.click();    
    a.remove();
  }

  return (
    <div className="main-layout">
      <Header/>

      {!isUploading &&
        <FileUploader onSubmit={(f, s) => handleSubmit(f, s)}/>
      }

      {isUploading && 
        <UploadState/>
      }
    </div>
  );
}
