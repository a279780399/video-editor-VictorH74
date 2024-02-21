/* eslint-disable react-hooks/exhaustive-deps */
import useVideoEditorCtxActions from "@/hooks/useVideoEditorActions";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import React from "react";

export default function useEditorWorkSpace() {
  // performance.now();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [showPlayBtn, setShowPlayBtn] = React.useState(false);
  const [paused, setPaused] = React.useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);

  const { trimVideo, cutVideo, addTextOnVideo, crop } =
    useVideoEditorCtxActions();

  const {
    videoUrl,
    setProcessingVideo,
    videoStartTime,
    videoEndTime,
    videoDuration,
    setExportedVideoUrl,
  } = useVideoEditorCtx();

  React.useEffect(() => {
    if (!videoRef || !videoRef.current || !videoUrl) return;

    videoRef.current.src = videoUrl;

    requestAnimationFrame(updateVideoTime);
  }, []);

  React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = videoStartTime;
  }, [videoStartTime]);

  React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = videoEndTime;
  }, [videoEndTime]);


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

  const saveVideo = async () => {
    try {
      setProcessingVideo(true);
      if (videoStartTime > 0 || videoEndTime < videoDuration!) {
        const newUrl = await (cutAction === "trim" ? trimVideo : cutVideo)();
        setExportedVideoUrl(newUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingVideo(false);
    }
  };

  return {
    paused,
    videoRef,
    showPlayBtn,
    videoCurrentTime,
    setShowPlayBtn,
    setPaused,
    saveVideo,
  };
}
