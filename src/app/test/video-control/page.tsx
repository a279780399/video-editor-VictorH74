/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useWindowSize from "@/hooks/useWindowSize";
import { formatTime } from "@/utils/functions";
import Image from "next/image";
import React from "react";

const [frameWidth, frameHeight] = [90, 58];
const baseImgUrl = `https://picsum.photos/${frameWidth}/${frameHeight}?random=`;
const fakeVideoDuration = 779.305133;

type MoveTarget =
  | undefined
  | "selectpartSTART"
  | "selectpartEND"
  | "rangeinput";

export default function Page() {
  const [width] = useWindowSize();
  const debouncedFunction = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const playbackControlContainerRef = React.useRef<HTMLInputElement>(null);
  const playbackControlRef = React.useRef<HTMLInputElement>(null);
  const shadowThumbRef = React.useRef<HTMLInputElement>(null);
  const shadowThumbValueRef = React.useRef<HTMLInputElement>(null);
  const videoStartTimeRef = React.useRef<HTMLDivElement>(null);
  const videoEndTimeRef = React.useRef<HTMLDivElement>(null);

  const videoStartSectionRef = React.useRef<HTMLDivElement>(null);
  const videoCutSectionRef = React.useRef<HTMLDivElement>(null);
  const videoEndSectionRef = React.useRef<HTMLDivElement>(null);

  const [frameAmount, setFrameAmount] = React.useState(0);

  const [showIndicator, setShowIndicator] = React.useState(false);

  const [currentT, setCurrentT] = React.useState(0);
  const [videoStartTime, setVideoStartTime] = React.useState(0);
  const [videoEndTime, setVideoEndTime] = React.useState(0);

  const [mouseMoveTarget, setMouseMoveTarget] = React.useState<MoveTarget>();

  React.useEffect(() => {
    setVideoEndTime(fakeVideoDuration);

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  React.useEffect(() => {
    setShowIndicator(mouseMoveTarget === "rangeinput");
  }, [mouseMoveTarget]);

  React.useEffect(() => {
    const debounce = (func: () => void, delay: number) => {
      if (debouncedFunction.current) {
        clearTimeout(debouncedFunction.current);
      }

      debouncedFunction.current = setTimeout(func, delay);
    };

    debounce(generateFrames, 300);
  }, [width]);

  const generateFrames = () => {
    if (!playbackControlContainerRef.current) return;

    // quantidade de frames a ser renderizados
    let frameAmount = Math.ceil(
      (playbackControlContainerRef.current.offsetWidth + frameWidth) /
        frameWidth
    );
    setFrameAmount(frameAmount);
  };

  const handleMouseUp = () => {
    if (mouseMoveTarget === "rangeinput") return;
    document.body.style.cursor = "default";
    setMouseMoveTarget(undefined);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!mouseMoveTarget) return;
    if (!playbackControlRef || !playbackControlRef.current) return;

    const playbackControl = playbackControlRef.current;

    const rect = playbackControl.getBoundingClientRect();

    const width = rect.right - rect.left; // Largura do elemento

    const [leftDistance, rightDistance] = [
      e.clientX - rect.left,
      (e.clientX - rect.right) * -1,
    ];

    const leftPercent = leftDistance / width
    const value = leftPercent * Number(playbackControl.max)

    const playbackControlValue =
      (leftDistance / width) * (Number(playbackControl.max) / 1000);

    const moveSelectPart = (
      target: MoveTarget,
      ref: React.RefObject<HTMLDivElement>,
      ref2: React.RefObject<HTMLDivElement>,
      ref3: React.RefObject<HTMLDivElement>,
      abortCondition: boolean,
      cb: (ref: React.RefObject<HTMLDivElement>) => void
    ) => {
      if (
        mouseMoveTarget === target &&
        ref.current &&
        ref2.current &&
        ref3.current
      ) {
        if (abortCondition) return true;

        setCurrentT(playbackControlValue);

        cb(ref);

        ref2.current.style.right = rightDistance + "px";
        ref3.current.style.left = leftDistance + "px";

        return true;
      }
      return false;
    };

    // select part START div moviment
    if (
      moveSelectPart(
        "selectpartSTART",
        videoStartTimeRef,
        videoStartSectionRef,
        videoCutSectionRef,
        playbackControlValue >= videoEndTime || playbackControlValue < 0,
        (ref) => {
          if (ref.current) {
            setVideoStartTime(playbackControlValue);
            ref.current.style.left = `${leftDistance}px`;
          }
        }
      )
    )
      return;
    if (
      moveSelectPart(
        "selectpartEND",
        videoEndTimeRef,
        videoCutSectionRef,
        videoEndSectionRef,
        playbackControlValue <= videoStartTime ||
          (videoEndTime >= fakeVideoDuration && playbackControlValue > fakeVideoDuration),
        (ref) => {
          if (ref.current) {
            setVideoEndTime(playbackControlValue);
            ref.current.style.right = `${rightDistance}px`;
          }
        }
      )
    )
      return;

    if (!shadowThumbRef || !shadowThumbRef.current) return;
    if (!shadowThumbValueRef || !shadowThumbValueRef.current) return;

    shadowThumbRef.current.style.left = `${leftPercent*100}%`;

    shadowThumbValueRef.current.textContent = formatTime(value / 1000);
    // shadowThumbValueRef.current.textContent = (value / 1000).toString();
  };

  const toggleShowIndicator = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (e.type === "mouseleave" && mouseMoveTarget === "rangeinput") {
      setMouseMoveTarget(undefined);
    } else if (e.type === "mouseover" && !mouseMoveTarget) {
      setMouseMoveTarget("rangeinput");
    }
  };

  const selectPartStartHandleMouseDown = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (!videoStartTimeRef.current) return;
    setVideoStartTime(e.clientX - videoStartTimeRef.current.offsetLeft);
    setMouseMoveTarget("selectpartSTART");
  };

  const selectPartEndHandleMouseDown = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (!videoEndTimeRef.current) return;
    setVideoEndTime(e.clientX - videoEndTimeRef.current.offsetLeft);
    setMouseMoveTarget("selectpartEND");
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="grid w-screen h-screen place-items-center px-3 select-none"
    >
      <div className="flex flex-col gap-4 w-11/12 items-center">
        <h2>Current value: {formatTime(currentT)}</h2>
        <div
          ref={playbackControlContainerRef}
          className="relative h-[58px] w-full"
        >
          {/* <span className="absolute">{currentT}</span> */}
          {/* <div className="absolute pointer-events-none bg-slate-500 inset-0 opacity-50" /> */}

          {Array(2)
            .fill(undefined)
            .map((_, i) => (
              <div
                key={i}
                className={`absolute top-0 bottom-0 w-2 bg-sky-400 z-50 flex flex-col justify-center items-center gap-1 ${
                  i === 1 && "right-0"
                }`}
                ref={i === 0 ? videoStartTimeRef : videoEndTimeRef}
                onMouseDown={
                  i === 0
                    ? selectPartStartHandleMouseDown
                    : selectPartEndHandleMouseDown
                }
                onMouseOver={() => {
                  document.body.style.cursor = "ew-resize";
                }}
                onMouseLeave={() => {
                  if (mouseMoveTarget) return;
                  document.body.style.cursor = "default";
                }}
              >
                <span className="absolute -bottom-7 text-sky-400">
                  {formatTime(i === 0 ? videoStartTime : videoEndTime)}
                </span>
                {Array(3)
                  .fill(undefined)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="size-[5px] rounded-full bg-white"
                    ></div>
                  ))}
              </div>
            ))}

          <div
            ref={videoStartSectionRef}
            className="absolute pointer-events-none bg-red-400 top-0 bottom-0 left-0 right-full opacity-50"
          />
          <div
            ref={videoCutSectionRef}
            className="absolute pointer-events-none bg-blue-400 top-0 bottom-0 left-0 right-0  opacity-50"
          />
          <div
            ref={videoEndSectionRef}
            className="absolute pointer-events-none bg-green-300 top-0 bottom-0 left-full right-0 opacity-50"
          />

          <input
            ref={playbackControlRef}
            type="range"
            min={0}
            max={(Number(fakeVideoDuration.toFixed(1)) * 1000)}
            value={0}
            onChange={(e) => {
              console.log(Number(e.currentTarget.value) / 1000)
              setCurrentT(Number(e.currentTarget.value) / 1000)
            }}
            onMouseOver={toggleShowIndicator}
            onMouseLeave={toggleShowIndicator}
            className="slider rounded-lg bg-transparent absolute inset-0 borçder-2 appearance-none overflow-hidden"
            id="myRange"
          />

          <div
            style={{ display: showIndicator ? "grid" : "none" }}
            ref={shadowThumbRef}
            className="absolute bg-orange-400 w-[1px] h-full pointer-events-none"
          >
            <span
              ref={shadowThumbValueRef}
              className="absolute -top-7 -translate-x-1/2 text-orange-300"
            >
              {currentT}
            </span>
          </div>

          <div className="overflow-hidden h-full flex flex-row justify-center">
            {Array(frameAmount)
              .fill(undefined)
              .map((_, i) => (
                <Image
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                  key={i}
                  width={frameWidth}
                  height={frameHeight}
                  src={baseImgUrl + i}
                  alt="frame"
                />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
