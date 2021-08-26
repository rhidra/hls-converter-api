import React, { useState } from 'react';
import Header from '../../layouts/header';
import { EncodingSettings } from '../../types';
import FileUploader from './FileUploader';
import UploadState from './UploadState';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);

  function handleSubmit(file: File, settings: EncodingSettings) {
    setIsUploading(true);
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
