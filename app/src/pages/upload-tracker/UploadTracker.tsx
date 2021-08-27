import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Error from "../../components/Error";
import UploadState from "../../components/UploadState";
import Header from "../../layouts/header";
import ApiProxy from "../../lib/ApiProxy";
import { VideoStatus } from "../../types";
import { removeExtension } from "../../utils/utils";
import ProcessingDone from "./ProcessingDone";

const api = new ApiProxy();

const UploadTracker: FC = () => {
  const [status, setStatus] = useState<VideoStatus>(VideoStatus.PENDING);
  const {uploadId, filename} = useParams<{uploadId: string, filename: string}>();

  useEffect(() => {
    // Wait for the encoding to be done...
    let timer: any;
    timer = setInterval(async () => {
      const {status} = await api.checkStatus(uploadId);

      if (status === 'ENCODING') {
        setStatus(VideoStatus.ENCODING);
      } else if (status === 'PENDING') {
        setStatus(VideoStatus.PENDING);
      }

      if (status === 'DONE') {
        clearInterval(timer);
        setStatus(VideoStatus.DONE);
        downloadFile();
      } else if (status === 'ERROR') {
        clearInterval(timer);
        setStatus(VideoStatus.ERROR);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function downloadFile() {
    const blob = await api.downloadFile(uploadId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${removeExtension(filename)}.zip`;
    document.body.appendChild(a);
    a.click();    
    a.remove();
  }

  return (
    <div className="main-layout">
      <Header/>

      {status !== VideoStatus.DONE && status !== VideoStatus.ERROR &&
        <UploadState status={status}/>
      }

      {status === VideoStatus.DONE &&
        <ProcessingDone onDownload={() => downloadFile()}/>
      }

      {status === VideoStatus.ERROR &&
        <Error/>
      }
    </div>
  );
};

export default UploadTracker;