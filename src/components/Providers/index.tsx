import EditorToolsProvider from "@/contexts/editorToolsCtx";
import OutputVideoProvider from "@/contexts/outputVideoCtx";
import ResizableBoxProvider from "@/contexts/resizableBoxCtx";
import VideoMetadataProvider from "@/contexts/videoMetadataCtx";
import React from "react";

interface Props {
  children: React.ReactElement;
}

export default function Providers({ children }: Props) {
  return (
    <EditorToolsProvider>
      <ResizableBoxProvider>
        <VideoMetadataProvider>
          <OutputVideoProvider>{children}</OutputVideoProvider>
        </VideoMetadataProvider>
      </ResizableBoxProvider>
    </EditorToolsProvider>
  );
}
