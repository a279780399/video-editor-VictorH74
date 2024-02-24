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
import useEditorToolsCtx from "@/hooks/useEditorToolsCtx";

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
  const {
    toolAction,
    setToolAction,
  } = useEditorToolsCtx();
  const tools = React.useMemo<ToolType[]>(
    () => [
      {
        icon: ContentCutIcon,
        label: "Cortar ou Aparar",
        action: "cut_trim",
      },
      {
        icon: CropIcon,
        label: "Cortar vídeo",
        action: "crop",
      },
      {
        icon: RotateLeftIcon,
        label: "Girar",
        action: "rotate",
      },
      {
        icon: FlipIcon,
        label: "Inverter",
        action: "flip",
      },
      {
        icon: VolumeUpIcon,
        label: "Volume",
        action: "volume",
      },
      {
        icon: SpeedIcon,
        label: "Velocidade",
        action: "speed",
      },
      {
        icon: AspectRatioIcon,
        label: "Redimensionar",
        action: "resize",
      },
      {
        icon: TextIncreaseIcon,
        label: "Add Texto",
        action: "add_text",
      },
      {
        icon: AddPhotoAlternateIcon,
        label: "Add Imagem",
        action: "add_image",
      },
    ],
    []
  );

  return { tools, toolAction, setToolAction };
}
