"use client";
import React from "react";


const assetURL2 = "C:\Users\vycto\Videos\Captures\Apex Legends 2024-01-17 18-03-56.mp4";

// Need to be specific for Blink regarding codecs
// ./mp4info frag_bunny.mp4 | grep Codec


export default function Page() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    if (
      videoRef.current &&
      "MediaSource" in window &&
      MediaSource.isTypeSupported(mimeCodec)
    ) {
      var mediaSource = new MediaSource();
      //console.log(mediaSource.readyState); // closed
      videoRef.current.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener("sourceopen", sourceOpen);
    } else {
      console.error("Unsupported MIME type or codec: ", mimeCodec);
    }
  });

  function sourceOpen(this: MediaSource, ev: Event): any {

    //console.log(this.readyState); // open
    var mediaSource = this;
    var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    fetchAB(assetURL2, function (buf: BufferSource) {
      sourceBuffer.addEventListener("updateend", function (_) {
        mediaSource.endOfStream();
        if (!videoRef || !videoRef.current) return;
        // videoRef.current.play();
        //console.log(mediaSource.readyState); // ended
      });
      sourceBuffer.appendBuffer(buf);
    });
  }

  function fetchAB(url: string, cb: (buf: BufferSource) => void) {
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.responseType = "arraybuffer";

    // Define os cabeçalhos para a solicitação de byte range
    const startByte = 0 * 1024 * 1024;
    const endByte = (0 + 5) * 1024 * 1024 - 1;
    xhr.setRequestHeader('Range', `bytes=${startByte}-${endByte}`);

    xhr.onload = function () {
      cb(xhr.response);
    };
    xhr.send();
  }

  return <video ref={videoRef} controls />;
}
