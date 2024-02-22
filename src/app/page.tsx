"use client";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import DownloadFinalVideo from "@/ui/DownloadFinalVideo";
import EditorWorkSpace from "@/ui/EditorWorkSpace";
import React from "react";
import SelectVideoFile from "@/ui/SelectVideoFile";

export default function Home() {
  const { videoUrl, exportedVideoUrl, processingVideo } = useVideoEditorCtx();

  if (exportedVideoUrl) return <DownloadFinalVideo />;

  if (processingVideo)
    return (
      <div className="w-screen h-screen grid place-items-center">
        <h1>Loading...</h1>
      </div>
    );

  return <main>{videoUrl ? <EditorWorkSpace /> : <SelectVideoFile />}</main>;
}
