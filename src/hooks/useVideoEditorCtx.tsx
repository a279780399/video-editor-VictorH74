import React from "react";
import { videoEditorCtx } from "@/contexts/videoEditorCtx";

export default function useVideoEditorCtx() {
  const context = React.useContext(videoEditorCtx);
  if (!context) {
    throw new Error("useVideoEditorCtxCtx must be used within a VideoEditorProvider");
  }
  return context;
}
