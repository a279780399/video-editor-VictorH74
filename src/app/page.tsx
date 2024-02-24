"use client";
import DownloadFinalVideo from "@/ui/DownloadFinalVideo";
import EditorWorkSpace from "@/ui/EditorWorkSpace";
import React from "react";
import SelectVideoFile from "@/ui/SelectVideoFile";
import useOutputVideoCtx from "@/hooks/useOutputVideoCtx";
import useVideoMetadataCtx from "@/hooks/useVideoMetadataCtx";

export default function Home() {
  const { videoUrl } = useVideoMetadataCtx();
  const { exportedVideoUrl, processingVideo } = useOutputVideoCtx();

  if (exportedVideoUrl) return <DownloadFinalVideo />;

  if (processingVideo)
    return (
      <div className="w-screen h-screen grid place-items-center">
        <h1>Loading...</h1>
      </div>
    );

  return <main>{videoUrl ? <EditorWorkSpace /> : <SelectVideoFile />}</main>;
}
