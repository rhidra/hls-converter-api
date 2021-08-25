import React from 'react';
import {FaCloudUploadAlt} from "react-icons/fa"

export default function Home() {
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
        <section className="dropdown">
          <div className="inner">
            <FaCloudUploadAlt/>
            <span>Drop a video !</span>
          </div>
        </section>
      </main>
    </div>
  );
}
