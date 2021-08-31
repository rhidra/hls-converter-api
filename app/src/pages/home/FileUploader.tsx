import { FC, useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { EncodingSettings, EncodingSpeed, StreamQuality } from "../../types";
import { IoMdClose } from 'react-icons/io';
import { formatSize } from "../../utils/utils";
import SettingsForm from "./SettingsForm";
import Info from "../../components/Info";

type Props = {
  onSubmit: (f: File, s: EncodingSettings) => void;
};

const FileUploader: FC<Props> = ({ onSubmit }) => {
  const input = useRef(null);
  const dropdown = useRef(null);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (dropdown?.current) {
      // dragover and dragenter events need to have 'preventDefault' called
      // in order for the 'drop' event to register. 
      // See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
      (dropdown.current as any).ondragover = (dropdown.current as any).ondragenter = (event: Event) => {
        event.preventDefault();
      };

      (dropdown.current as any).ondrop = (event: DragEvent) => {
        if (!file) {
          setFile(event.dataTransfer?.files[0]);
          event.preventDefault();
        }
      };
    }
  });

  const [settings, setSettings] = useState<EncodingSettings>({
    encodingSpeed: EncodingSpeed.MEDIUM,
    segmentSize: 6,
    framerate: 25,
    streams: [StreamQuality.MOBILE_240P],
  });

  function handleSubmit() {
    if (file) {
      onSubmit(file, settings);
    }
  }

  return (
    <main className={`file-uploader ${file && false ? 'file-selected' : ''}`}>
      <input 
        type="file" 
        hidden 
        ref={input} 
        onChange={(e: any) => setFile(e.target.files[0])}
        multiple={false}
      />
      <article className={`vertical-offset ${file ? 'file-selected' : ''}`}>
        <div 
          ref={dropdown}
          className={`dropdown ${file ? 'file-selected' : ''}`} 
          onClick={() => file ? null : (input?.current as any).click()}>

          <div className={`inner ${file ? 'file-selected' : ''}`}>
            <FaCloudUploadAlt/>
            <span>Drop a video !</span>
          </div>

          {file &&
            <div className="file">
              <div className="file-col">
                <span className="name">
                  {file.name}
                </span>
                <span className="size">
                  {formatSize(file.size)}
                </span>
              </div>
              <button onClick={() => setFile(undefined)}>
                <IoMdClose/>
              </button>
            </div>
          }
        </div>

        <div className={`settings ${file ? 'file-selected' : ''}`}>
          <div className="settings-row">
            <SettingsForm value={settings} onChange={v => setSettings(v)}/>
          </div>

          <div className="upload-button">
            <button onClick={() => handleSubmit()}>
              Upload and convert
            </button>
          </div>
        </div>
      </article>

      <Info/>
    </main>
  );
};

export default FileUploader;