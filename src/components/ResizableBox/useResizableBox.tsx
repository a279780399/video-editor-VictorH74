"use client";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";
import React from "react";

export type HandlerType =
  | "sw"
  | "se"
  | "nw"
  | "ne"
  | "w"
  | "e"
  | "n"
  | "s"
  | undefined;
type DirectionType = "top" | "bottom" | "left" | "right";

export default function useResizableBox() {
  const resizableRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [onResize, setOnResize] = React.useState<HandlerType>();
  const [onDrag, setOnDrag] = React.useState(false);
  const [lastP, setLastP] = React.useState({ left: 0, top: 0 });
  const [prevValues, setPrevValues] = React.useState<
    Record<DirectionType, number>
  >({ bottom: 0, left: 0, right: 0, top: 0 });

  const { setCropArea } = useVideoEditorCtx();

  const resize = (direction: DirectionType, mouse: number) => {
    if (!resizableRef.current || !containerRef.current) return;
    const resizableBox = resizableRef.current;
    const isYAxis = ["top", "bottom"].includes(direction);
    const rect = containerRef.current.getBoundingClientRect();
    const measure = rect[isYAxis ? "height" : "width"];

    let distance = mouse - (isYAxis ? rect.top : rect[direction]);
    if (direction === "right") distance *= -1;

    const bottom = direction === "bottom";
    const newValue = ((bottom ? measure - distance : distance) / measure) * 100;

    // min width or height
    const minDimension = 10;
    if (
      resizableBox[isYAxis ? "offsetHeight" : "offsetWidth"] < minDimension &&
      newValue > prevValues[direction]
    )
      return;

    setPrevValues((oldValues) => ({ ...oldValues, [direction]: newValue }));

    if (newValue < 0) return (resizableBox.style[direction] = "0%");
    resizableBox.style[direction] = newValue + "%";
  };

  const getCropArea = () => {
    if (!resizableRef.current || !containerRef.current) return;

    const resizableRect = resizableRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const w = resizableRect.width;
    const h = resizableRect.height;
    const x = resizableRect.left - containerRect.left;
    const y = resizableRect.top - containerRect.top;

    return { w, h, x, y };
  };

  const resizeDirection = (
    mouseP: [number, number]
  ): Record<Exclude<HandlerType, undefined>, () => void> => ({
    sw: () => {
      resize("left", mouseP[0]);
      resize("bottom", mouseP[1]);
    },
    se: () => {
      resize("right", mouseP[0]);
      resize("bottom", mouseP[1]);
    },
    nw: () => {
      resize("left", mouseP[0]);
      resize("top", mouseP[1]);
    },
    ne: () => {
      resize("right", mouseP[0]);
      resize("top", mouseP[1]);
    },
    w: () => resize("left", mouseP[0]),
    e: () => resize("right", mouseP[0]),
    n: () => resize("top", mouseP[1]),
    s: () => resize("bottom", mouseP[1]),
  });

  const resizeStart = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    direction: HandlerType
  ) => {
    e.stopPropagation();
    setOnResize(direction);
    document.body.style.cursor = direction + "-resize";
  };

  const resizeEnd = () => {
    if (!onResize) return;
    setOnResize(undefined);
    document.body.style.cursor = "default";
    console.log(getCropArea());
    setCropArea(getCropArea()!);
  };

  const dragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!resizableRef.current || !containerRef.current || onDrag) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    setLastP({
      left: e.clientX - containerRect.left,
      top: e.clientY - containerRect.top,
    });
    setOnDrag(true);
    document.body.style.cursor = "grabbing";
  };

  const dragEnd = () => {
    if (onResize || !onDrag) return;
    setCropArea(getCropArea()!);
    setOnDrag(false);
    document.body.style.cursor = "default";
  };

  const onResizableMove = (e: React.MouseEvent) => {
    if (onResize) resizeDirection([e.clientX, e.clientY])[onResize]();
  };

  const onDraggableMove = (e: React.MouseEvent) => {
    if (onDrag && !onResize) {
      if (!resizableRef.current || !containerRef.current) return;
      const [r, c] = [resizableRef.current, containerRef.current];
      const resizableRect = r.getBoundingClientRect();
      const containerRect = c.getBoundingClientRect();

      const xFactor = e.clientX - containerRect.left - lastP.left;
      const yFactor = e.clientY - containerRect.top - lastP.top;

      const top = resizableRect.top - containerRect.top;
      const bottom = containerRect.height - (top + resizableRect.height);
      const left = resizableRect.left - containerRect.left;
      const right = containerRect.width - (left + resizableRect.width);
      const newLeft = left + xFactor;
      const newRight = right - xFactor;
      const newTop = top + yFactor;
      const newBottom = bottom - yFactor;

      // border constraints
      if (newLeft < 0) r.style.left = "0%";
      else if (newRight < 0) r.style.right = "0%";
      else {
        r.style.left = `${(newLeft / containerRect.width) * 100}%`;
        r.style.right = `${(newRight / containerRect.width) * 100}%`;
      }

      if (newTop < 0) r.style.top = "0%";
      else if (newBottom < 0) r.style.bottom = "0%";
      else {
        r.style.top = `${(newTop / containerRect.height) * 100}%`;
        r.style.bottom = `${(newBottom / containerRect.height) * 100}%`;
      }

      setLastP({
        left: e.clientX - containerRect.left,
        top: e.clientY - containerRect.top,
      });
    }
  };

  return {
    resizableRef,
    containerRef,
    resizeStart,
    resizeEnd,
    dragStart,
    dragEnd,
    onResizableMove,
    onDraggableMove,
  };
}
