/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import React from "react";
import useVideoEditor from "./UseVideoEditor";

interface Props {
  videoUrl: string;
  videoName: string;
}

export default React.memo(function VideoEditorWorkArea({ videoUrl, videoName }: Props) {
  const {
    videoRef,
    paused,
    videoDuration,
    videoCurrentTime,
    frames,
    setPaused,
    setVideoDuration,
    formatTime,
  } = useVideoEditor(videoUrl);


  return (
    <div className="grid place-items-center">
      {videoName && <h2>{videoName}</h2>}
      <button
        className="relative"
        onClick={() => {
              setPaused(!paused);
              
            }}
      >
        <video
          width="640"
          height="360"
          ref={videoRef}
          onLoadedMetadata={(e) => {
            e.currentTarget.duration;
            setVideoDuration(e.currentTarget.duration);
          }}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </button>

      {videoDuration && <h3>duração do vídeo: {formatTime(videoDuration)}</h3>}
      <h3>tempo atual: {formatTime(videoCurrentTime)}</h3>
      <div className="relative rounded-lg w-[90vw] overflow-hidden flex flex-row justify-center">
        <input
          type="range"
          min={0}
          max={videoDuration}
          value={videoRef?.current?.currentTime || 0}
          onChange={(e) => {
            if (!videoRef || !videoRef.current) return;
            videoRef.current.currentTime = Number(e.currentTarget.value);
          }}
          className="slider absolute w-full h-full bg-transparent appearance-none"
          id="myRange"
        />
        {frames.map((f, i) => (
          <Image
            style={{
              width: "auto",
              height: "auto",
            }}
            key={i}
            width={98}
            height={60}
            src={f}
            alt="frame"
          />
        ))}
      </div>
    </div>
  );
})
