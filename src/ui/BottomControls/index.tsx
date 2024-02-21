import React from "react";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import {
  AddImage,
  AddText,
  Crop,
  Flip,
  Resize,
  Rotate,
  Speed,
  Trim,
  Volume,
} from "./actions";
import { ToolActionType } from "../EditorTools/useEditorTools";

const components: Record<
  Exclude<ToolActionType, undefined>,
  React.ReactElement
> = {
  add_image: <AddImage />,
  add_text: <AddText />,
  crop: <Crop />,
  flip: <Flip />,
  resize: <Resize />,
  rotate: <Rotate />,
  speed: <Speed />,
  cut_trim: <Trim />,
  volume: <Volume />,
};

export default function BottomControls() {
  const { toolAction } = useVideoEditorCtx();

  if (!toolAction) return null;
  return components[toolAction];
}
