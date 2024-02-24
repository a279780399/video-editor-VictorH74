/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useEditorToolsCtx from "@/hooks/useEditorToolsCtx";
import useResizableBoxCtx from "@/hooks/useResizableBoxCtx";
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
  const [onResize, setOnResize] = React.useState<HandlerType>();
  const [onDrag, setOnDrag] = React.useState(false);
  const [lastP, setLastP] = React.useState({ left: 0, top: 0 });
  const [prevValues, setPrevValues] = React.useState<
    Record<DirectionType, number>
  >({ bottom: 0, left: 0, right: 0, top: 0 });

  const { cropArea } = useEditorToolsCtx();
  const {
    containerRef,
    resizableRef,
    maskEastRef,
    maskNorthRef,
    maskSouthRef,
    maskWestRef,
    updateCropArea,
    updateMasks,
  } = useResizableBoxCtx();

  // setup mask positions
  React.useEffect(() => {
    updateMasks();
  }, []);

  const moveMaskByDirection = (d: DirectionType, newValue: number) => {
    const containerMeasure =
      containerRef.current!.getBoundingClientRect()[
        ["top", "bottom"].includes(d) ? "height" : "width"
      ];

    const value = `${(newValue / containerMeasure) * 100}%`;
    const revertedValue = `${
      ((containerMeasure - newValue) / containerMeasure) * 100
    }%`;

    switch (d) {
      case "left":
        maskWestRef.current!.style.right = revertedValue;
        break;
      case "top":
        maskNorthRef.current!.style.bottom = revertedValue;
        maskWestRef.current!.style.top = value;
        maskEastRef.current!.style.top = value;
        break;
      case "right":
        maskEastRef.current!.style.left = revertedValue;
        break;
      case "bottom":
        maskSouthRef.current!.style.top = revertedValue;
        maskWestRef.current!.style.bottom = value;
        maskEastRef.current!.style.bottom = value;
        break;
    }
  };

  const resize = (direction: DirectionType, mouseP: number) => {
    const r = resizableRef.current!;
    const isYAxis = ["top", "bottom"].includes(direction);
    const cRect = containerRef.current!.getBoundingClientRect();
    const measure = cRect[isYAxis ? "height" : "width"];

    let distance = mouseP - (isYAxis ? cRect.top : cRect[direction]);

    if (direction === "right") distance *= -1;

    const isBottom = direction === "bottom";
    const newValue = isBottom ? measure - distance : distance;
    const newValuePercent = (newValue / measure) * 100;

    const minDimension = 10;
    if (
      r[isYAxis ? "offsetHeight" : "offsetWidth"] < minDimension &&
      newValuePercent > prevValues[direction]
    )
      return;

    setPrevValues((oldValues) => ({
      ...oldValues,
      [direction]: newValuePercent,
    }));

    if (newValuePercent < 0) return (r.style[direction] = "0%");

    r.style[direction] = newValuePercent + "%";
    moveMaskByDirection(direction, newValue);
  };

  const resizeDirection = (
    mouseP: [number, number] // [x, y]
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
    updateCropArea();
  };

  const onResizableMove = (e: React.MouseEvent) => {
    if (onResize) resizeDirection([e.clientX, e.clientY])[onResize]();
  };

  const dragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onDrag) return;
    const containerRect = containerRef.current!.getBoundingClientRect();
    setLastP({
      left: e.clientX - containerRect.left,
      top: e.clientY - containerRect.top,
    });
    setOnDrag(true);
    document.body.style.cursor = "grabbing";
  };

  const dragEnd = () => {
    if (onResize || !onDrag) return;
    updateCropArea();
    setOnDrag(false);
    document.body.style.cursor = "default";
  };

  const onDraggableMove = (e: React.MouseEvent) => {
    if (onDrag && !onResize) {
      const [r, c, mw, mn, me, ms] = [
        resizableRef.current!,
        containerRef.current!,
        maskWestRef.current!,
        maskNorthRef.current!,
        maskEastRef.current!,
        maskSouthRef.current!,
      ];
      const resizableRect = r.getBoundingClientRect();
      const containerRect = c.getBoundingClientRect();

      const xFactor = e.clientX - containerRect.left - lastP.left;
      const yFactor = e.clientY - containerRect.top - lastP.top;

      // previous resizable box diretions values
      const top = resizableRect.top - containerRect.top;
      const bottom = containerRect.height - (top + resizableRect.height);
      const left = resizableRect.left - containerRect.left;
      const right = containerRect.width - (left + resizableRect.width);

      // new resizable box diretions values
      const newLeft = left + xFactor;
      const newRight = right - xFactor;
      const newTop = top + yFactor;
      const newBottom = bottom - yFactor;

      // X position border constraints
      if (newLeft < 0) {
        r.style.left = "0%";
        mw.style.right = "100%";
      } else if (newRight < 0) {
        r.style.right = "0%";
        me.style.left = "100%";
      } else {
        r.style.left = `${(newLeft / containerRect.width) * 100}%`;
        r.style.right = `${(newRight / containerRect.width) * 100}%`;

        moveMaskByDirection("left", newLeft);
        moveMaskByDirection("right", newRight);
      }

      // Y position border constraints
      if (newTop < 0) {
        r.style.top = "0%";
        mn.style.bottom = "100%";
      } else if (newBottom < 0) {
        r.style.bottom = "0%";
        ms.style.top = "100%";
      } else {
        r.style.top = `${(newTop / containerRect.height) * 100}%`;
        moveMaskByDirection("top", newTop);

        r.style.bottom = `${(newBottom / containerRect.height) * 100}%`;
        moveMaskByDirection("bottom", newBottom);
      }

      setLastP({
        left: e.clientX - containerRect.left,
        top: e.clientY - containerRect.top,
      });
    }
  };

  return {
    containerRef,
    resizableRef,
    cropArea,
    maskWestRef,
    maskNorthRef,
    maskEastRef,
    maskSouthRef,
    resizeStart,
    resizeEnd,
    dragStart,
    dragEnd,
    onResizableMove,
    onDraggableMove,
  };
}
