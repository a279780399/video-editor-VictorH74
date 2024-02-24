/* eslint-disable react-hooks/exhaustive-deps */
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import FlipIcon from "@mui/icons-material/Flip";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import React from "react";
import { Button, IconButton } from "@/components/buttons";
import useEditorToolsCtx from "@/hooks/useEditorToolsCtx";
import useVideoMetadataCtx from "@/hooks/useVideoMetadataCtx";
import useResizableBoxCtx from "@/hooks/useResizableBoxCtx";

export const Trim = () => {
  const { setCutAction } = useEditorToolsCtx();

  return (
    <div className="flex">
      <Button
        rounded
        onClick={() => {
          setCutAction((prev) => (prev === "trim" ? "cut" : "trim"));
        }}
      >
        Cortar / Aparar
      </Button>
    </div>
  );
};

export const Crop = () => {
  const { containerRef, resizableRef, updateMasks, updateCropArea } =
    useResizableBoxCtx();

  const cropByProportion = (proportion: [number, number]) => {
    const r = resizableRef.current!;
    const { width, height } = r.getBoundingClientRect();
    const cWidth = containerRef.current!.getBoundingClientRect().width;

    const newWidth = (height / proportion[1]) * proportion[0];

    // distribute space x to left / right
    const xSpacing = (width - newWidth) / 2;
    const xValue = (xSpacing / cWidth) * 100;

    // get current values of resizable left / right parsed to float
    const directions = ["left", "right"] as const;
    const prevX = directions.map((d) => parseFloat(r.style[d]));

    const decrement = (i: number) =>
      prevX[i] + xValue - (prevX[(i - 1) * -1] + xValue) * -1;

    // case left or right is out of bounds, adjust the opposite side
    if (prevX[0] + xValue < 0) {
      r.style.left = "0%";
      r.style.right = decrement(0) + "%";
    } else if (prevX[1] + xValue < 0) {
      r.style.right = "0%";
      r.style.left = decrement(1) + "%";
    } else {
      r.style.left = prevX[0] + xValue + "%";
      r.style.right = prevX[1] + xValue + "%";
    }

    updateCropArea();
    updateMasks();
  };

  const proportions = React.useMemo<[number, number][]>(
    () => [
      [1, 1],
      [9, 16],
      [4, 3],
      [3, 4],
    ],
    []
  );

  return (
    <div className="flex gap-[2px]">
      <Button
        first
        onClick={() => {
          (["left", "top", "right", "bottom"] as const).forEach(
            (d) => (resizableRef.current!.style[d] = "0%")
          );
          updateCropArea();
          updateMasks();
        }}
      >
        Original
      </Button>
      {proportions.map((p) => (
        <Button key={p.join(":")} onClick={() => cropByProportion(p)}>
          {p.join(":")}
        </Button>
      ))}
      <Button
        last
        onClick={() => {
          if (process.env.NODE_ENV === "production") alert("Não funcional");
          else alert("TODO: Permitir ajustar a dimensão manualmente");
        }}
      >
        Custom
      </Button>
    </div>
  );
};

const resolutionsObj = {
  "1.8": [2160, 1440, 1080, 720, 480, 360, 240],
  "1.6": [2400, 1600, 1200, 1050, 900, 800, 600, 400],
};
export const Resize = () => {
  const [resolutions, setResolutions] = React.useState<number[]>([]);
  const { videoResolution } = useVideoMetadataCtx();
  const { finalResolution, setFinalResolution } = useEditorToolsCtx();

  React.useEffect(() => {
    if (!videoResolution) return;
    const { w, h } = videoResolution;
    const key = (w / h).toFixed(1);

    if (!Object.keys(resolutionsObj).includes(key)) return;
    const r = resolutionsObj[key as keyof typeof resolutionsObj];

    setResolutions(r.filter((rh) => rh <= h));
  }, [videoResolution]);

  return (
    <div className="flex gap-[2px]">
      {resolutions.map((resolutionH, i) => (
        <Button
          key={resolutionH}
          first={i === 0}
          last={i === resolutions.length - 1}
          selected={
            (i === 0 && !finalResolution) || finalResolution === resolutionH
          }
          onClick={() => {
            setFinalResolution(i === 0 ? null : resolutionH);
          }}
        >
          {i === 0 ? "Original" : resolutionH.toString() + "p"}
        </Button>
      ))}
    </div>
  );
};

export const Flip = () => {
  const { setFlipH, setFlipV, flipH, flipV } = useEditorToolsCtx();

  return (
    <div className="flex gap-[2px]">
      <IconButton
        icon={FlipIcon}
        first
        onClick={() => setFlipH(!flipH)}
        label="Horizontal"
      />
      <IconButton
        iconClassName="rotate-90"
        icon={FlipIcon}
        last
        onClick={() => setFlipV(!flipV)}
        label="Vertical"
      />
    </div>
  );
};

export const Rotate = () => {
  return (
    <div className="flex gap-[2px]">
      <IconButton
        icon={RotateLeftIcon}
        first
        onClick={() => {
          alert("Não funcional");
        }}
        label="Esquerda"
      />
      <IconButton
        icon={RotateRightIcon}
        last
        onClick={() => {
          alert("Não funcional");
        }}
        label="Direita"
      />
    </div>
  );
};

export const Volume = () => {
  const { volume, setVolume } = useEditorToolsCtx();
  const handleChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <Stack
      className="w-full bg-[#00000080] text-white px-4 rounded-lg"
      spacing={2}
      direction="row"
      alignItems="center"
    >
      <VolumeDown />
      <Slider
        aria-label="Volume"
        min={0}
        value={volume}
        max={100}
        onChange={handleChange}
      />
      <VolumeUp />
      <p className="text-base font-bold">{volume}%</p>
    </Stack>
  );
};

export const Speed = () => {
  const { speed, setSpeed } = useEditorToolsCtx();
  const handleChange = (event: Event, newValue: number | number[]) => {
    setSpeed(newValue as number);
  };

  return (
    <Stack
      className="w-full bg-[#00000080] text-white px-4 rounded-lg"
      spacing={2}
      direction="row"
      alignItems="center"
    >
      <VolumeDown />
      <Slider
        aria-label="Volume"
        min={25}
        value={speed}
        max={400}
        onChange={handleChange}
      />
      <VolumeUp />
      <p className="text-base font-bold">{speed / 100}x</p>
    </Stack>
  );
};

export const AddText = () => {
  const { setTextList } = useEditorToolsCtx();

  return (
    <div className="flex">
      <IconButton
        icon={TextIncreaseIcon}
        rounded
        onClick={() => {
          alert("Não funcional");
          // setAddText((prev) => [
          //   ...prev,
          //   (<TextContainer />),
          // ]);
        }}
        label="Add Text"
      />
    </div>
  );
};

export const AddImage = () => {
  const { setImageList } = useEditorToolsCtx();

  return (
    <div className="flex">
      <IconButton
        icon={AddPhotoAlternateIcon}
        rounded
        onClick={() => {
          alert("Não funcional");
          // setImageList((prev) => [
          //   ...prev,
          //   (<ImageContainer />),
          // ]);
        }}
        label="Add Image"
      />
    </div>
  );
};
