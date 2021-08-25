import React, { useRef, useState } from 'react';
import {FaCloudUploadAlt, FaTrashAlt} from "react-icons/fa"
import { formatSize } from '../utils/utils';

export default function Home() {
  const input = useRef(null);
  const [file, setFile] = useState<File>();

  return (
    <div className="main-layout">
      <header>
        <nav className="header">
          <h1 className="title">HLS Converter</h1>
          <a className="call-to-action">Access the API</a>
        </nav>

        <div className="slogan">
          Convert any video to a <strong>HLS stream</strong>
        </div>
      </header>

      <main>
        <input 
          type="file" 
          hidden 
          ref={input} 
          onChange={(e: any) => setFile(e.target.files[0])}
          multiple={false}
        />
        <section className={`dropdown ${file ? 'file-selected' : ''}`} onClick={() => file ? null : (input?.current as any).click()}>
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
              <button>
                <FaTrashAlt/>
              </button>
            </div>
          }
        </section>
      </main>
    </div>
  );
}
