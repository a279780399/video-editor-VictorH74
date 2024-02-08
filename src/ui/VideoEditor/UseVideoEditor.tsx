/* eslint-disable react-hooks/exhaustive-deps */
import useWindowSize from "@/hooks/UseWindowSize";
import React from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
export default function useVideoEditor(videoUrl: string) {
  const startTimestamp = performance.now();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const debouncedFunction = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const ffmpegRef = React.useRef(new FFmpeg());

  const [videoDuration, setVideoDuration] = React.useState<
    number | undefined
  >();
  const [showPlayBtn, setShowPlayBtn] = React.useState(false);
  const [paused, setPaused] = React.useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);
  const [frames, setFrames] = React.useState<string[]>([]);

  const [width] = useWindowSize();

  React.useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    // videoRef.current.src = videoUrl;
    trimVideo().then((url) => {
      if (!videoRef || !videoRef.current) return;
      if (url) videoRef.current.src = url;
    });
    requestAnimationFrame(updateVideoTime);
  }, []);

  React.useEffect(() => {
    const debounce = (func: () => void, delay: number) => {
      if (debouncedFunction.current) {
        clearTimeout(debouncedFunction.current);
      }

      debouncedFunction.current = setTimeout(func, delay);
    };

    debounce(generateFrames, 300);
  }, [videoDuration, width]);

  React.useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (paused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [paused]);

  const formatTime = React.useCallback(function (time: number) {
    let seconds = time % 60;
    let minutes = time < 60 ? 0 : Math.floor(time / 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds.toFixed(2)}`;
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.clear();
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const cutVideo = async () => {
    const ffmpeg = ffmpegRef.current;
    // Carregar ffmpeg.wasm
    await load();

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-filter_complex",
      "trim=duration=20:start=0,trim=duration=10:start=30,setpts=N/FRAME_RATE/TB",
      "output.mp4",
    ]);

    // Ler o arquivo cortado
    const data = (await ffmpeg.readFile("output.mp4")) as any;

    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    // Criar uma URL para a Blob
    return URL.createObjectURL(blob);
  };

  const trimVideo = async (
    from: string = "00:00:10",
    to: string = "00:00:30"
  ) => {
    const ffmpeg = ffmpegRef.current;
    // Carregar ffmpeg.wasm
    await load();

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    await ffmpeg.exec([
      "-ss",
      from,
      "-to",
      to,
      "-i",
      "input.mp4",
      "output.mp4",
    ]);

    // Ler o arquivo cortado
    const data = (await ffmpeg.readFile("output.mp4")) as any;

    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    // Criar uma URL para a Blob
    return URL.createObjectURL(blob);
  };

  const generateFrames = async () => {
    if (!videoDuration) return;

    const avarage = videoDuration / Math.floor(width / 106);
    let frameTimes = [0];

    for (let time = avarage; time <= videoDuration; time += avarage) {
      frameTimes.push(time);
    }
    frameTimes.push(videoDuration);

    const video = document.createElement("video");
    video.src = videoUrl;
    await video.load();
    await new Promise((resolve) => (video.onloadedmetadata = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = 98;
    canvas.height = 60;

    const context = canvas.getContext("2d");

    if (!context) return;

    let frameUrls = [];

    for (const frameTime of frameTimes) {
      video.currentTime = frameTime;

      await new Promise((resolve) => {
        video.onseeked = resolve;
      });

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      frameUrls.push(canvas.toDataURL("image/png"));
    }

    setFrames(frameUrls);
  };

  function updateVideoTime() {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
    }

    requestAnimationFrame(updateVideoTime);
  }

  function saveVideo() {
    // verificar se há duração inicial e final de corte de vídeo (TODO: criar estados)
    // ...
    // download do video
  }

  return {
    frames,
    paused,
    videoRef,
    showPlayBtn,
    videoDuration,
    videoCurrentTime,
    setShowPlayBtn,
    setVideoDuration,
    formatTime,
    setPaused,
  };
}
