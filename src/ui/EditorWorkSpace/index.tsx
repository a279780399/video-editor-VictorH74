/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import VideoPlaybackControl from "../VideoPlaybackControl";
import { formatTime } from "@/utils/functions";
import EditorTools from "@/ui/EditorTools";
import useEditorWorkSpace from "./useEditorWorkSpace";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import BottomControls from "../BottomControls";
import { ClearBtn, IconButton } from "@/components/buttons";
import ResizableBox from "@/components/ResizableBox";

export default function EditorWorkSpace() {
  const {
    videoRef,
    paused,
    videoCurrentTime,
    setPaused,
    saveVideo,
    flipH,
    flipV,
    cutAction,
    toolAction,
    videoDuration,
    videoStartTime,
    videoEndTime,
    setVideoDuration,
    videoName,
    setVideoResolution,
  } = useEditorWorkSpace();

  return (
    <div id="video-editor" className="grid place-items-center px-12">
      <div className="relative w-full p-4 flex justify-center mt-7">
        <EditorTools />
        <ClearBtn />
      </div>

      <h2>{videoName}</h2>

      <div className="relative">
        <video
          width="640"
          height="360"
          style={{
            scale: `${flipH ? -1 : 1} ${flipV ? -1 : 1}`,
          }}
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
            setVideoResolution({
              w: e.currentTarget.videoWidth,
              h: e.currentTarget.videoHeight,
            });
          }}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {toolAction === "crop" && <ResizableBox />}
      </div>

      {videoDuration && <h3>duração do vídeo: {formatTime(videoDuration)}</h3>}
      <h3>tempo atual: {formatTime(videoCurrentTime)}</h3>

      <VideoPlaybackControl
        value={videoRef?.current?.currentTime || 0}
        videoDuration={videoDuration || 0}
        trimCutValue={cutAction}
        onChange={(e) => {
          if (!videoRef || !videoRef.current) return;
          videoRef.current.currentTime = Number(e.currentTarget.value) / 1000;
        }}
      />

      <div className="w-full mt-14 flex gap-4">
        <div className="flex gap-4 flex-1">
          <IconButton
            className="px-7 py-2"
            icon={paused ? PlayArrowIcon : PauseIcon}
            rounded
            onClick={() => {
              setPaused(!paused);
            }}
          />
          <BottomControls />
        </div>

        <div className="flex gap-2">
          <IconButton icon={SettingsIcon} rounded onClick={() => {}} />
          <button
            onClick={saveVideo}
            className="bg-pink-400 hover:bg-pink-300 duration-200 text-white p-2 rounded-lg font-medium"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
