"use client";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import React from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function SelectVideoFile() {
  const [onDrag, setOnDrag] = React.useState(false);
  const { setVideoUrl, setVideoName } = useVideoEditorCtx();

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const selectedFile = fileInput.files?.[0];

    if (selectedFile) {
      const videoUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(videoUrl);
      setVideoName(selectedFile.name);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];

    if (selectedFile) {
      const videoUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(videoUrl);
      setVideoName(selectedFile.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onDrag) return;
    setOnDrag(true);
  };

  const handleDragLeave = () => {
    if (!onDrag) return;
    setOnDrag(false);
  };

  return (
    <div
      className="relative h-screen grid place-items-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
    >
      <div
        style={{ opacity: onDrag ? 1 : 0 }}
        className="duration-150 absolute pointer-events-none z-10 bg-[#ffffffab] inset-0 border-dashed border-[6px] border-[#49b5d6a9] grid place-items-center"
      >
        <div>
          <div className="relative bg-transparent border-4 border-double border-transparent rounded-xl bg-origin-border box-border grad">
            <ArrowDownwardIcon
              className="animate-bounce mt-12 mb-8 mx-12"
              sx={{ fontSize: 70, color: "#292929" }}
            />
          </div>
        </div>
      </div>

      <div
        className="relative"
        style={{ pointerEvents: onDrag ? "none" : "all" }}
      >
        <label
          className="inline-block py-3 px-4 cursor-pointer rounded-md bg-gradient-to-r from-red-200 from-2% via-blue-500 via-40% to-cyan-400 to-100% text-base font-bold text-white"
          htmlFor="video-uploader"
        >
          Carregar vídeo
        </label>
        <input
          className="absolute -z-[1] top-1 left-1 text-transparent"
          onChange={handleSelectChange}
          type="file"
          name="video"
          id="video-uploader"
          accept=".mp4,.webm"
        />
      </div>
    </div>
  );
}
