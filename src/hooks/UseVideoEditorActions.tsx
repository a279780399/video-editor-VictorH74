import React from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function useVideoEditorActions() {
  const ffmpegRef = React.useRef(new FFmpeg());

  // Carregar ffmpeg.wasm
  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
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

  const cutVideo = async (
    videoUrl: string,
    startTime: string = "9.981289",
    endTime: string = "19.814823"
  ) => {
    const ffmpeg = ffmpegRef.current;
    // temp
    await load();

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-t",
      startTime,
      "-c",
      "copy",
      "part1.mp4",
    ]);

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-ss",
      endTime,
      "-c",
      "copy",
      "part2.mp4",
    ]);

    ffmpeg.writeFile(
      "list.txt",
      ["file 'part1.mp4'", "file 'part2.mp4'"].join("\n")
    );

    await ffmpeg.exec([
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      "list.txt",
      "-c",
      "copy",
      "output.mp4",
    ]);

    // Ler o arquivo cortado
    const data = (await ffmpeg.readFile("output.mp4")) as any;

    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    return URL.createObjectURL(blob);
  };

  const trimVideo = async (
    videoUrl: string,
    startTime: string = "00:00:10",
    endTime: string = "00:00:30"
  ) => {
    const ffmpeg = ffmpegRef.current;

    // temp
    await load();

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    await ffmpeg.exec([
      "-ss",
      startTime,
      "-to",
      endTime,
      "-i",
      "input.mp4",
      "-c",
      "copy",
      "output.mp4",
    ]);

    // Ler o arquivo cortado
    const data = (await ffmpeg.readFile("output.mp4")) as any;

    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    // Criar uma URL para a Blob
    return URL.createObjectURL(blob);
  };

  const addTextOnVideo = async (
    videoUrl: string,
    text: string = "Me nombre es Victor A",
    x: number = 10,
    y: number = 10,
    fontSize: number = 24,
    fontcolor: string = "white"
  ) => {
    const ffmpeg = ffmpegRef.current;

    // temp
    await load();

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    await ffmpeg.writeFile(
      "arial.ttf",
      await fetchFile(
        "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf"
      )
    );

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-vf",
      `drawtext=fontfile=/arial.ttf:text=\'${text}\':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=${fontcolor}`,
      "output.mp4",
    ]);

    const data2 = (await ffmpeg.readFile("output.mp4")) as any;

    // Criar uma URL para a Blob
    return URL.createObjectURL(new Blob([data2.buffer], { type: "video/mp4" }));
  };

  return {
    trimVideo,
    cutVideo,
    addTextOnVideo,
  };
}
