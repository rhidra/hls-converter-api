import React, { useState } from 'react';
import Header from '../../layouts/header';
import { EncodingSettings, VideoStatus } from '../../types';
import FileUploader from './FileUploader';
import UploadState from '../../components/UploadState';
import ApiProxy from '../../lib/ApiProxy';
import ProcessingDone from './ProcessingDone';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const [status, setStatus] = useState<VideoStatus>();
  const history = useHistory();

  async function handleSubmit(file: File, settings: EncodingSettings) {
    setStatus(VideoStatus.NOT_UPLOADED);
    const api = new ApiProxy();

    // Request an upload ID with the encoding settings
    const uploadId = await api.requestUploadId(settings);
    
    // Upload the video file
    const ok = await api.uploadVideoFile(uploadId, file);

    if (ok) {
      history.push(`/status/${file.name}/${uploadId}`);
    }
  }

  return (
    <div className="main-layout">
      <Header/>

      {status === undefined &&
        <FileUploader onSubmit={(f, s) => handleSubmit(f, s)}/>
      }

      {status !== undefined && status !== VideoStatus.DONE && 
        <UploadState status={status}/>
      }
    </div>
  );
}
