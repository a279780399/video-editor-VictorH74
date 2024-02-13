import React from "react";
import { videoEditorCtx } from "@/contexts/videoEditorCtx";

export default function useVideoEditor() {
  return React.useContext(videoEditorCtx);
}
