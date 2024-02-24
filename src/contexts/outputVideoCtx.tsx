"use client";
import React from "react";

interface Props {
  processingVideo: boolean;
  exportedVideoUrl: string | null;
  setProcessingVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setExportedVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const outputVideoCtx = React.createContext<Props | null>(null);

export default function OutputVideoProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [exportedVideoUrl, setExportedVideoUrl] = React.useState<string | null>(
    null
  );


  return (
    <outputVideoCtx.Provider
      value={{
        processingVideo,
        exportedVideoUrl,
        setProcessingVideo,
        setExportedVideoUrl,
      }}
    >
      {children}
    </outputVideoCtx.Provider>
  );
}
