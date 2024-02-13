"use client";
import React from "react";

interface Props {
  videoDuration: number | undefined;
  videoStartTime: number;
  videoEndTime: number;
  videoName: string | null;
  videoUrl: string | null;
  processingVideo: boolean;
  exportedVideoUrl: string | null;
  setVideoStartTime: (v: number) => void;
  setVideoEndTime: (v: number) => void;
  setVideoName: (v: string) => void;
  setVideoUrl: (v: string) => void;
  setProcessingVideo: (v: boolean) => void;
  setExportedVideoUrl: (v: string) => void;
  setVideoDuration: (v: number | undefined) => void;
}

export const videoEditorCtx = React.createContext({
  videoStartTime: 0,
  videoDuration: 0,
  videoEndTime: 100,
  videoName: null,
  videoUrl: null,
  processingVideo: false,
  exportedVideoUrl: null,
  setVideoStartTime: () => {},
  setVideoEndTime: () => {},
  setVideoName: () => {},
  setVideoUrl: () => {},
  setProcessingVideo: () => {},
  setExportedVideoUrl: () => {},
  setVideoDuration: () => {},
} as Props);

export default function VideoEditorProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [videoStartTime, setStartTimeState] = React.useState(0);
  const [videoEndTime, setEndTimeState] = React.useState(0);
  const [videoName, setVideoNameState] = React.useState<string | null>(null);
  const [videoUrl, setUrlState] = React.useState<string | null>(null);
  const [processingVideo, setProcessingVideoState] = React.useState(false);
  const [exportedVideoUrl, setExportedVideoUrlState] = React.useState<
    string | null
  >(null);
  const [videoDuration, setVideoDurationState] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    if (videoDuration) setVideoEndTime(videoDuration);
  }, [videoDuration]);

  const setVideoStartTime = (newValue: number) => setStartTimeState(newValue);
  const setVideoEndTime = (newValue: number) => setEndTimeState(newValue);
  const setVideoName = (newValue: string) => setVideoNameState(newValue);
  const setVideoUrl = (newValue: string) => setUrlState(newValue);
  const setProcessingVideo = (newValue: boolean) =>
    setProcessingVideoState(newValue);
  const setExportedVideoUrl = (newValue: string) =>
    setExportedVideoUrlState(newValue);
  const setVideoDuration = (newValue: number | undefined) =>
    setVideoDurationState(newValue);

  return (
    <videoEditorCtx.Provider
      value={{
        videoDuration,
        videoStartTime,
        videoEndTime,
        videoName,
        videoUrl,
        processingVideo,
        exportedVideoUrl,
        setVideoStartTime,
        setVideoEndTime,
        setVideoName,
        setVideoUrl,
        setProcessingVideo,
        setExportedVideoUrl,
        setVideoDuration,
      }}
    >
      {children}
    </videoEditorCtx.Provider>
  );
}
