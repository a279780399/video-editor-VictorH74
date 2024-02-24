/* eslint-disable react-hooks/exhaustive-deps */
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
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
  const array = React.useMemo(
    () => [
      {
        label: "Original",
        func: () => {
          alert("Não funcional");
        },
      },
      {
        label: "1:1",
        func: () => {
          alert("Não funcional");
        },
      },
      {
        label: "9:16",
        func: () => {
          alert("Não funcional");
        },
      },
      {
        label: "4:3",
        func: () => {
          alert("Não funcional");
        },
      },
      {
        label: "3:4",
        func: () => {
          alert("Não funcional");
        },
      },
      {
        label: "Custom",
        func: () => {
          alert("Não funcional");
        },
      },
    ],
    []
  );

  return (
    <div className="flex gap-[2px]">
      {array.map(({ label, func }, i) => (
        <Button
          key={label}
          first={i === 0}
          last={i === array.length - 1}
          onClick={func}
        >
          {label}
        </Button>
      ))}
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
          onClick={() => {
            alert("Não funcional");
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
