"use client";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import DownloadFinalVideo from "@/ui/DownloadFinalVideo";
import EditorWorkSpace from "@/ui/EditorWorkSpace";
import React, { ChangeEvent } from "react";

export default function Home() {
  const {videoUrl, setVideoUrl, setVideoName, exportedVideoUrl, processingVideo} = useVideoEditor();
  const {
    videoUrl,
    setVideoUrl,
    setVideoName,
    exportedVideoUrl,
    processingVideo,
  } = useVideoEditorCtx();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFile = fileInput.files?.[0];

    if (selectedFile) {
      const videoUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(videoUrl);
      setVideoName(selectedFile.name);
    }
  };

  if (exportedVideoUrl) return (<DownloadFinalVideo />)

  if (processingVideo) return (<div className="w-screen h-screen grid place-items-center"><h1>Loading...</h1></div>)

  return (
    <main>
      {videoUrl ? (
        <EditorWorkSpace />
      ) : (
        <div className="border-2 h-screen grid place-items-center">
            <input
            onChange={handleChange}
            type="file"
            name="video"
            id="video-uploader"
            accept=".mp4,.webm"
          />
        </div>
      )}
    </main>
  );
}
