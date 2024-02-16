/* eslint-disable react-hooks/exhaustive-deps */
import useVideoEditorActions from "@/hooks/UseVideoEditorActions";
import useVideoEditor from "@/hooks/useVideoEditor";
import React from "react";

export default function useEditorWorkSpace() {
  // performance.now();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [showPlayBtn, setShowPlayBtn] = React.useState(false);
  const [paused, setPaused] = React.useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);

  const [cutAction, setCutAction] = React.useState<"cut" | "trim">("trim");

  const { trimVideo, cutVideo, addTextOnVideo } = useVideoEditorActions();

  const {
    videoUrl,
    videoStartTime,
    videoEndTime,
    videoDuration,
    setProcessingVideo,
    setExportedVideoUrl,
  } = useVideoEditor();

  React.useEffect(() => {
    if (!videoRef || !videoRef.current || !videoUrl) return;

    videoRef.current.src = videoUrl;
    
    requestAnimationFrame(updateVideoTime);
  }, []);

  React.useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (paused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [paused]);

  function updateVideoTime() {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }

    requestAnimationFrame(updateVideoTime);
  }

  function saveVideo() {
    try {
      setProcessingVideo(true);
      if (videoStartTime > 0 || videoEndTime < videoDuration!) {
        (cutAction === "trim" ? trimVideo : cutVideo)().then((newUrl) => {
          setExportedVideoUrl(newUrl);
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingVideo(false);
    }
  }

  return {
    paused,
    videoRef,
    showPlayBtn,
    videoCurrentTime,
    cutAction,
    setShowPlayBtn,
    setPaused,
    setCutAction,
    saveVideo,
  };
}
