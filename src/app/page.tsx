"use client";
import VideoEditorWorkArea from "@/ui/VideoEditor";
import React, { ChangeEvent } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoName, setVideoName] = React.useState<string | undefined>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFile = fileInput.files?.[0];

    if (selectedFile) {
      const videoUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(videoUrl);
      setVideoName(selectedFile.name);
    }
  };

  return (
    <main>
      {videoUrl ? (
        <VideoEditorWorkArea videoUrl={videoUrl} videoName={videoName!} />
      ) : (
        <div className="border-2 h-screen grid place-items-center">
          <input
            onChange={handleChange}
            type="file"
            name="video"
            id="video-uploader"
            accept=".mp4"
          />
        </div>
      )}
    </main>
  );
}
