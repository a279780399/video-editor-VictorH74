/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useEditorWorkSpace from "./UseVideoEditor";
import VideoPlaybackControl from "../VideoPlaybackControl";
import { formatTime } from "@/utils/functions";
import useVideoEditor from "@/hooks/useVideoEditor";

export default React.memo(function EditorWorkSpace() {
  const {
    videoRef,
    paused,
    videoCurrentTime,
    cutAction,
    setPaused,
    setCutAction,
    saveVideo
  } = useEditorWorkSpace();
  const { videoDuration, setVideoDuration, videoStartTime, videoEndTime, videoName } =
    useVideoEditor();

  React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = videoStartTime;
  }, [videoStartTime]);

  React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = videoEndTime;
  }, [videoEndTime]);

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
          onLoadedMetadata={(e) => {
            console.log(e.currentTarget.duration);
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
