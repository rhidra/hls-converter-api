HLS Converter API
=================

## [Try it now on *hls-converter.com* !](https://hls-converter.com)

## [Check out the API !](https://rapidapi.com/rhidra/api/hls-converter/)

HLS Converter is a small API to easily convert any MP4 video to a HLS stream.
The stream is made of a master `.m3u8` file, linking to different playlists
`stream_**.m3u8` of different quality streams. The video segments are in `stream_**/`
directories, as `data_****.ts` files.

HLS is a protocol for a video streaming, compatible with any HTML5 players, on desktop and mobile browsers.
When streaming video, live or on-demand, it is not recommended to serve MP4 video files. Instead, streaming
protocols, like HLS, allows your users to efficiently watch your content on every platform, while reducing delays.
To achieve that, HLS will divide your video or stream in multiple smaller videos files of a 2-6 seconds, which will
be progressively downloaded by the HTML5 player.

This project is made of a **React front-end**, in the `app/` directory and a **Node/Express back-end** in `api/`.
The back-end is made of two modules, an API and an encoder, while should be launched separately.
The entire system is handled in production with **Docker** and a **NGINX server**, with a configuration file in `nginx/`.
Finally, to monetize and handle authentication on the API, we use RapidAPI service.