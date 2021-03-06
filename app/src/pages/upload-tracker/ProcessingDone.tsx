import { FC } from "react";

type Props = {
  onDownload: () => void;
};

const ProcessingDone: FC<Props> = ({onDownload}) => {
  return (
    <main className="vertical-offset processing-done">
      <div>
        <span className="loader-label">Your HLS stream is ready&nbsp;!</span>

        <div className="download-button">
          <button onClick={() => onDownload()}>
            Download zip file
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProcessingDone;