import React, { useEffect, useRef, useState } from 'react';
import {FaCloudUploadAlt, FaTrashAlt} from "react-icons/fa"
import Header from '../layouts/header';
import { formatSize } from '../utils/utils';

export default function Home() {
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
        setFile(event.dataTransfer?.files[0]);
        event.preventDefault();
      };
    }
  })

  return (
    <div className="main-layout">
      <Header/>

      <main>
        <input 
          type="file" 
          hidden 
          ref={input} 
          onChange={(e: any) => setFile(e.target.files[0])}
          multiple={false}
        />
        <section 
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
                <FaTrashAlt/>
              </button>
            </div>
          }
        </section>
      </main>
    </div>
  );
}
