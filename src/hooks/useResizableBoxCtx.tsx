import { resizableBoxCtx } from "@/contexts/resizableBoxCtx";
import React from "react";

export default function useResizableBoxCtx() {
  const context = React.useContext(resizableBoxCtx);
  if (!context) {
    throw new Error("useResizableBoxCtx must be used within a ResizableBoxProvider");
  }
  return context;
}
