import React from "react";
import useResizableBox, { HandlerType } from "./useResizableBox";
import useVideoEditorCtx from "@/hooks/useVideoEditorCtx";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ResizableBox() {
  const {
    containerRef,
    maskWestRef,
    maskNorthRef,
    maskEastRef,
    maskSouthRef,
    resizableRef,
    resizeEnd,
    resizeStart,
    dragEnd,
    dragStart,
    onDraggableMove,
    onResizableMove,
  } = useResizableBox();
  const { cropArea } = useVideoEditorCtx();
  return (
    <div
      ref={containerRef}
      onMouseUp={resizeEnd}
      onMouseLeave={resizeEnd}
      onMouseMove={onResizableMove}
      className="absolute inset-0 select-none"
    >
      {/* Masks */}
      <div ref={maskWestRef} className="absolute left-0 bg-[#0000006b]" />
      <div ref={maskNorthRef} className="absolute top-0 inset-x-0 bg-[#0000006b]" />
      <div ref={maskEastRef} className="absolute right-0 bg-[#0000006b]" />
      <div ref={maskSouthRef} className="absolute bottom-0 inset-x-0 bg-[#0000006b]" />

      <div
        ref={resizableRef}
        className="border-2 border-slate-400 absolute cursor-grab"
        style={{
          left: cropArea.x,
          top: cropArea.y,
          right: "0",
          bottom: 0,
          // width: cropArea.w + "px",
          // height: cropArea.h + "px",
        }}
        onMouseUp={dragEnd}
        onMouseLeave={dragEnd}
        onMouseDown={dragStart}
        onMouseMove={onDraggableMove}
      >
        {[
          {
            direction: "nw",
            classStr: "-translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
          },
          {
            direction: "n",
            classStr:
              "left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
          },
          {
            direction: "ne",
            classStr:
              "right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
          },
          {
            direction: "e",
            classStr:
              "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
          },
          {
            direction: "se",
            classStr:
              "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
          },
          {
            direction: "s",
            classStr:
              "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
          },
          {
            direction: "sw",
            classStr:
              "bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
          },
          {
            direction: "w",
            classStr:
              "top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
          },
        ].map(({ direction, classStr }) => (
          <span
            key={direction}
            onMouseDown={(e) => resizeStart(e, direction as HandlerType)}
            className={`bg-green-300 w-3 h-3 rounded-full absolute ${classStr}`}
          />
        ))}
      </div>
    </div>
  );
}
