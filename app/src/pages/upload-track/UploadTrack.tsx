import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UploadState from "../../components/UploadState";
import Header from "../../layouts/header";
import ApiProxy from "../../lib/ApiProxy";
import { VideoStatus } from "../../types";
import { removeExtension } from "../../utils/utils";
import ProcessingDone from "../home/ProcessingDone";

const UploadTrack: FC = () => {
  const [status, setStatus] = useState<VideoStatus>(VideoStatus.PENDING);
  const {uploadId, filename} = useParams<{uploadId: string, filename: string}>();

  useEffect(() => { ( async () => {
    const api = new ApiProxy();

    // Wait for the encoding to be done...
    let done = false;
    while (!done) {
      const {status, message} = await api.checkStatus(uploadId);

      if (status === 'ENCODING') {
        setStatus(VideoStatus.ENCODING);
      } else if (status === 'PENDING') {
        setStatus(VideoStatus.PENDING);
      }

      if (status === 'DONE') {
        done = true;
        setStatus(VideoStatus.DONE);
      } else {
        await new Promise<void>(r => setTimeout(() => r(), 1000))
      }
    }

    // Download the file
    const blob = await api.downloadFile(uploadId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${removeExtension(filename)}.zip`;
    document.body.appendChild(a);
    a.click();    
    a.remove();
  })()}, []);

  return (
    <div className="main-layout">
      <Header/>

      {status !== VideoStatus.DONE &&
        <UploadState status={status}/>
      }

      {status === VideoStatus.DONE &&
        <ProcessingDone/>
      }
    </div>
  );
};

export default UploadTrack;