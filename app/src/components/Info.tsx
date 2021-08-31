import { FC } from "react";

const Info: FC = () => {
  return (
    <article className="vertical-offset info-content">
      <div className="subtext">
        You can only convert a video file once a day.<br/>
        Needs more ?&nbsp;
        <a href="https://rapidapi.com/rhidra/api/hls-converter" target="_blank" rel="noreferrer">
          Check out our API ! 
        </a>
      </div>

      <div className="row">
        <div className="text">
          <img src="/img/phone.svg"/>

          <strong>
            HLS-Converter.com is a tool allowing you to transcode your MP4 file into a HLS stream. 
          </strong> You can freely configure the encoding
          and decide the quality of the different streams you need. You can then serve the HLS files on a remote media server or a CDN
          to allow your users to watch your content.
          To integrate the HLS convertion to your app,&nbsp;
          <a href="https://rapidapi.com/rhidra/api/hls-converter" target="_blank" rel="noreferrer">
            please check out our API, on RapidAPI !
          </a>

        </div>

        <div className="text">
          <strong>
            HLS is a protocol for a video streaming, compatible with any HTML5 players, on desktop and mobile browsers.
          </strong> When streaming video, live or on-demand, it is not recommended to serve MP4 video files. Instead, streaming
          protocols, like HLS, allows your users to efficiently watch your content on every platform, while reducing delays.
          To achieve that, HLS will divide your video or stream in multiple smaller videos files of a 2-6 seconds, which will
          be progressively downloaded by the HTML5 player.
        </div>

        <div className="text">
          For low-bandwith users, HLS features <strong>adaptative resolution and bitrate</strong>. You can transcode your stream in multiple streams
          of different resolution, bitrate, and codec. This allows users with a bad connection to still enjoy your content with
          no lag at a lower quality.
        </div>

        <div className="text">
          Check out our <strong>API</strong> and our pricing on Rapid API now !
        </div>
        
        <a href="https://rapidapi.com/rhidra/api/hls-converter" target="_blank" className="call-to-action" rel="noreferrer">
          <img src="/img/rapidapi-badge-dark.png" width="200" alt="Connect on RapidAPI"/>
        </a>
      </div>
    </article>
  );
};

export default Info;