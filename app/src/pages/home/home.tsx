import React, { useState } from 'react';
import Header from '../../layouts/header';
import { EncodingSettings } from '../../types';
import FileUploader from './FileUploader';
import UploadState from './UploadState';
import ApiProxy from '../../lib/ApiProxy';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(file: File, settings: EncodingSettings) {
    setIsUploading(true);
    const api = new ApiProxy();

    // Request an upload ID with the encoding settings
    const uploadId = await api.requestUploadId(settings);
    
    
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
