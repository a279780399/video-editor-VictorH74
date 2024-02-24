"use client";
import React from "react";
import useEditorToolsCtx from "@/hooks/useEditorToolsCtx";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  resizableRef: React.RefObject<HTMLDivElement>;
  maskWestRef: React.RefObject<HTMLDivElement>;
  maskNorthRef: React.RefObject<HTMLDivElement>;
  maskEastRef: React.RefObject<HTMLDivElement>;
  maskSouthRef: React.RefObject<HTMLDivElement>;

  updateCropArea: () => void;
  updateMasks: () => void;
}

export const resizableBoxCtx = React.createContext<Props | null>(null);

export default function ResizableBoxProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const resizableRef = React.useRef<HTMLDivElement>(null);
  const maskWestRef = React.useRef<HTMLDivElement>(null);
  const maskNorthRef = React.useRef<HTMLDivElement>(null);
  const maskEastRef = React.useRef<HTMLDivElement>(null);
  const maskSouthRef = React.useRef<HTMLDivElement>(null);

  const { setCropArea } = useEditorToolsCtx();

  const updateCropArea = () => {
    const { left, top, right, bottom } = resizableRef.current!.style;
    setCropArea({ left, top, right, bottom });
  };

  const updateMasks = () => {
    if (!containerRef.current || !resizableRef.current) return;
    const { left, top, right, bottom } = resizableRef.current!.style;

    const [floatLeft, floatTop, floatRight, floatBottom] = [
      left,
      top,
      right,
      bottom,
    ].map((d) => parseFloat(d));

    maskNorthRef.current!.style.bottom = 100 - floatTop + "%";
    maskEastRef.current!.style.left = 100 - floatRight + "%";
    maskWestRef.current!.style.right = 100 - floatLeft + "%";
    maskSouthRef.current!.style.top = 100 - floatBottom + "%";
    maskWestRef.current!.style.top = top;
    maskEastRef.current!.style.top = top;
    maskWestRef.current!.style.bottom = bottom;
    maskEastRef.current!.style.bottom = bottom;
  };

  return (
    <resizableBoxCtx.Provider
      value={{
        containerRef,
        resizableRef,
        maskEastRef,
        maskNorthRef,
        maskSouthRef,
        maskWestRef,
        updateMasks,
        updateCropArea,
      }}
    >
      {children}
    </resizableBoxCtx.Provider>
  );
}
