import { FC } from "react";
import Loader from "../../components/Loader";

const UploadState: FC = () => {
  return (
    <main className="upload-state">
      <div>
        <Loader/>
      </div>
    </main>
  );
}

export default UploadState;