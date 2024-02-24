import EditorToolsProvider from "@/contexts/editorToolsCtx";
import OutputVideoProvider from "@/contexts/outputVideoCtx";
import VideoMetadataProvider from "@/contexts/videoMetadataCtx";
import React from "react";

interface Props {
  children: React.ReactElement;
}

export default function Providers({ children }: Props) {
  return (
    <EditorToolsProvider>
        <VideoMetadataProvider>
          <OutputVideoProvider>{children}</OutputVideoProvider>
        </VideoMetadataProvider>
    </EditorToolsProvider>
  );
}
