import { FC } from "react";
import Loader from "./Loader";
import { VideoStatus } from "../types";

function mapStatusToLabel(status: VideoStatus): string {
  switch (status) {
    case VideoStatus.NOT_UPLOADED:
      return 'Uploading video...';
    case VideoStatus.PENDING:
      return 'Video waiting for encoding...';
    case VideoStatus.ENCODING:
      return 'Encoding...';
    case VideoStatus.DONE:
    default:
      return 'Encoding finished !';
  }
}

type Props = {
  status: VideoStatus;
};

const UploadState: FC<Props> = ({status}) => {
  return (
    <main className="upload-state">
      <div>
        <Loader label={mapStatusToLabel(status)} sublabel={status !== VideoStatus.DONE ? 'This may take a few minutes' : undefined}/>
      </div>
    </main>
  );
}

export default UploadState;