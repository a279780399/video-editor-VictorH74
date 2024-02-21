import ContentCutIcon from "@mui/icons-material/ContentCut";
import CropIcon from "@mui/icons-material/Crop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import FlipIcon from "@mui/icons-material/Flip";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SpeedIcon from "@mui/icons-material/Speed";
import React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export type ToolActionType =
  | "cut_trim"
  | "crop"
  | "rotate"
  | "flip"
  | "volume"
  | "resize"
  | "add_text"
  | "add_image"
  | "speed"
  | undefined;

type ToolType = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  label: string;
  action: ToolActionType;
};

export default function useEditorTools() {
  const tools = React.useMemo<ToolType[]>(
    () => [
      {
        icon: ContentCutIcon,
        label: "Cut or Trim",
        action: "cut_trim",
      },
      {
        icon: CropIcon,
        label: "Crop",
        action: "crop",
      },
      {
        icon: RotateLeftIcon,
        label: "Rotate",
        action: "rotate",
      },
      {
        icon: FlipIcon,
        label: "Flip",
        action: "flip",
      },
      {
        icon: VolumeUpIcon,
        label: "Volume",
        action: "volume",
      },
      {
        icon: SpeedIcon,
        label: "Speed",
        action: "speed",
      },
      {
        icon: AspectRatioIcon,
        label: "Resize",
        action: "resize",
      },
      {
        icon: TextIncreaseIcon,
        label: "Add Text",
        action: "add_text",
      },
      {
        icon: AddPhotoAlternateIcon,
        label: "Add Image",
        action: "add_image",
      },
    ],
    []
  );

  return { tools };
}
