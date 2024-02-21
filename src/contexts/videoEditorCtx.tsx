"use client";
import React from "react";
import { ToolActionType } from "@/ui/EditorTools/useEditorTools";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

interface Props {
  ffmpegRef: React.MutableRefObject<FFmpeg>;
  cutAction: "cut" | "trim";
  cropArea: CropAreaType;
  rotate: 0 | 1 | 2 | 3;
  flipH: boolean;
  flipV: boolean;
  volume: number;
  speed: number;
  resizeDimension: [number, number]; // [w, h]
  resizePosition: [number, number]; // [x, y]
  addText: TextBoxType[];
  addImage: ImageBoxType[];
  videoDuration: number | undefined;
  videoStartTime: number;
  videoEndTime: number;
  videoResolution: { w: number; h: number } | undefined;
  videoName: string | null;
  videoUrl: string | null;
  processingVideo: boolean;
  toolAction: ToolActionType;
  exportedVideoUrl: string | null;
  setCutAction: React.Dispatch<React.SetStateAction<"cut" | "trim">>;
  setCropArea: React.Dispatch<React.SetStateAction<CropAreaType>>;
  setRotate: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>;
  setFlipH: React.Dispatch<React.SetStateAction<boolean>>;
  setFlipV: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setResizeDimension: React.Dispatch<React.SetStateAction<[number, number]>>;
  setResizePosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  setAddText: React.Dispatch<React.SetStateAction<TextBoxType[]>>;
  setAddImage: React.Dispatch<React.SetStateAction<ImageBoxType[]>>;
  setVideoStartTime: React.Dispatch<React.SetStateAction<number>>;
  setVideoEndTime: React.Dispatch<React.SetStateAction<number>>;
  setVideoResolution: React.Dispatch<
    React.SetStateAction<{ w: number; h: number } | undefined>
  >;
  setVideoName: React.Dispatch<React.SetStateAction<string | null>>;
  setVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setProcessingVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setToolAction: React.Dispatch<React.SetStateAction<ToolActionType>>;
  setExportedVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setVideoDuration: React.Dispatch<React.SetStateAction<number | undefined>>;
}

type TextBoxType = {
  w: number;
  h: number;
  x: number;
  y: number;
  content: string;
};
type ImageBoxType = { w: number; h: number; x: number; y: number; src: string };
type CropAreaType = { w: number; h: number; x: number; y: number };

export const videoEditorCtx = React.createContext<Props | null>(null);

export default function VideoEditorProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const ffmpegRef = React.useRef(new FFmpeg());

  // actions
  const [cutAction, setCutAction] = React.useState<"cut" | "trim">("trim");
  const [cropArea, setCropArea] = React.useState<CropAreaType>({
    w: 0,
    h: 0,
    x: 0,
    y: 0,
  });
  const [rotate, setRotate] = React.useState<0 | 1 | 2 | 3>(0);
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [volume, setVolume] = React.useState(100);
  const [speed, setSpeed] = React.useState(100);
  const [resizeDimension, setResizeDimension] = React.useState<
    [number, number]
  >([640, 360]); // [w, h]
  const [resizePosition, setResizePosition] = React.useState<[number, number]>([
    0, 0,
  ]); // [x, y]
  const [addText, setAddText] = React.useState<TextBoxType[]>([]);
  const [addImage, setAddImage] = React.useState<ImageBoxType[]>([]);

  const [videoStartTime, setVideoStartTime] = React.useState(0);
  const [videoEndTime, setVideoEndTime] = React.useState(0);
  const [videoResolution, setVideoResolution] = React.useState<{
    w: number;
    h: number;
  }>();
  const [videoName, setVideoName] = React.useState<string | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [toolAction, setToolAction] = React.useState<ToolActionType>();
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
        cutAction,
        addImage,
        addText,
        cropArea,
        flipH,
        flipV,
        resizeDimension,
        resizePosition,
        rotate,
        videoResolution,
        setVideoResolution,
        setAddImage,
        setAddText,
        setCropArea,
        setFlipH,
        setFlipV,
        setResizeDimension,
        setResizePosition,
        setRotate,
        setSpeed,
        setVolume,
        speed,
        volume,
        videoDuration,
        videoStartTime,
        videoEndTime,
        videoName,
        videoUrl,
        processingVideo,
        toolAction,
        exportedVideoUrl,
        setCutAction,
        setVideoStartTime,
        setVideoEndTime,
        setVideoName,
        setVideoUrl,
        setProcessingVideo,
        setToolAction,
        setExportedVideoUrl,
        setVideoDuration,
      }}
    >
      {children}
    </videoEditorCtx.Provider>
  );
}
