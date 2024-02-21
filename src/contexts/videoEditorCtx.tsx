"use client";
import React from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

interface Props {
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  videoDuration: number | undefined;
  videoStartTime: number;
  videoEndTime: number;
  videoName: string | null;
  videoUrl: string | null;
  processingVideo: boolean;
  exportedVideoUrl: string | null;
  setVideoStartTime: React.Dispatch<React.SetStateAction<number>>;
  setVideoEndTime: React.Dispatch<React.SetStateAction<number>>;
  setVideoName: React.Dispatch<React.SetStateAction<string | null>>;
  setVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setProcessingVideo: React.Dispatch<React.SetStateAction<boolean>>;
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
  setExportedVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setVideoDuration: React.Dispatch<React.SetStateAction<number | undefined>>;
export const videoEditorCtx = React.createContext<Props | null>(null);

export default function VideoEditorProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const ffmpegRef = React.useRef(new FFmpeg());
  const [videoStartTime, setVideoStartTime] = React.useState(0);
  const [videoEndTime, setVideoEndTime] = React.useState(0);
  const [videoName, setVideoName] = React.useState<string | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [exportedVideoUrl, setExportedVideoUrl] = React.useState<string | null>(
    null
  );
  const [videoDuration, setVideoDuration] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    if (videoDuration) setVideoEndTime(videoDuration);
  }, [videoDuration]);

  React.useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    if (process.env.NODE_ENV === "development") {
      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });
    }

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  return (
    <videoEditorCtx.Provider
      value={{
        ffmpegRef,
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
