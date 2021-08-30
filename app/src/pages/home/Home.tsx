import React, { useState } from 'react';
import Header from '../../layouts/Header';
import { EncodingSettings, VideoStatus } from '../../types';
import FileUploader from './FileUploader';
import UploadState from '../../components/UploadState';
import ApiProxy from '../../lib/ApiProxy';
import { useHistory } from 'react-router-dom';
import Error from '../../components/Error';

export default function Home() {
  const [status, setStatus] = useState<VideoStatus>();
  const history = useHistory();

  const [error, setError] = useState();
  const [errorMsg, setErrorMsg] = useState();

  async function handleSubmit(file: File, settings: EncodingSettings) {
    setStatus(VideoStatus.NOT_UPLOADED);
    const api = new ApiProxy();

    // Request an upload ID with the encoding settings
    const uploadId = await api.requestUploadId(settings);

    if (!uploadId) {
      setStatus(VideoStatus.ERROR);
      return;
    }
    
    // Upload the video file
    const res = await api.uploadVideoFile(uploadId, file);

    if (res.ok) {
      history.push(`/status/${file.name}/${uploadId}`);
    } else {
      setStatus(VideoStatus.ERROR);
      const {error, message} = await res.json();
      setError(error);
      setErrorMsg(message);
    }
  }

  return (
    <div className="main-layout">
      <Header/>

      {status === undefined &&
        <FileUploader onSubmit={(f, s) => handleSubmit(f, s)}/>
      }

      {status !== undefined && status !== VideoStatus.DONE && status !== VideoStatus.ERROR && 
        <UploadState status={status}/>
      }

      {status === VideoStatus.ERROR &&
        <Error error={error} message={errorMsg}/>
      }
    </div>
  );
}
