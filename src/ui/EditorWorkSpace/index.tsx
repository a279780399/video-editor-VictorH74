/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useEditorWorkSpace from "./UseVideoEditor";
import VideoPlaybackControl from "../VideoPlaybackControl";
import { formatTime } from "@/utils/functions";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
export default function EditorWorkSpace() {
  const { videoRef, paused, videoCurrentTime, setPaused, saveVideo } =
    useEditorWorkSpace();
  const {
    videoDuration,
    setVideoDuration,
    videoStartTime,
    videoEndTime,
    videoName,
  } = useVideoEditorCtx();

  return (
    <div id="video-editor" className="grid place-items-center">
      <h2>{videoName}</h2>

      <button
        className="relative"
        onClick={() => {
          setPaused(!paused);
        }}
      >
        <video
          width="640"
          height="360"
          className="-scale-x-100"
          ref={videoRef}
          onTimeUpdate={(e) => {
            if (!videoRef || !videoRef.current) return;
            const trim = cutAction === "trim";
            const value = Number(e.currentTarget.currentTime.toFixed(2));
            const start = Number(videoStartTime.toFixed(2));
            const end = videoEndTime;

            if (!trim && value > start && value < end)
              return (videoRef.current.currentTime = end);

            if ((trim && value < start) || (trim && value > end))
              return (videoRef.current.currentTime = start);
          }}
          onLoadedMetadata={(e) => {
            setVideoDuration(e.currentTarget.duration);
          }}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </button>

      {videoDuration && <h3>duração do vídeo: {formatTime(videoDuration)}</h3>}
      <h3>tempo atual: {formatTime(videoCurrentTime)}</h3>
      <div className="flex gap-2 my-4">
        <button
          onClick={() => {
            setCutAction((prev) => (prev === "trim" ? "cut" : "trim"));
          }}
          className="bg-sky-500 hover:bg-sky-400 duration-200 text-white p-2 rounded-lg font-medium"
        >
          Cortar / Aparar
        </button>
        {/* 

      */}
        <button
          onClick={saveVideo}
          className="bg-pink-400 hover:bg-pink-300 duration-200 text-white p-2 rounded-lg font-medium"
        >
          Salvar
        </button>
      </div>

      <VideoPlaybackControl
        value={videoRef?.current?.currentTime || 0}
        videoDuration={videoDuration || 0}
        trimCutValue={cutAction}
        onChange={(e) => {
          if (!videoRef || !videoRef.current) return;
          videoRef.current.currentTime = Number(e.currentTarget.value) / 1000;
        }}
      />
    </div>
  );
});
