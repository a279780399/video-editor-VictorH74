import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import React from "react";
import useVideoMetadataCtx from "./useVideoMetadataCtx";
import useEditorToolsCtx from "./useEditorToolsCtx";
import useOutputVideoCtx from "./useOutputVideoCtx";

export type DataType = {
  videoUrl: string;
  command: string;
};

export default function useVideoEditorCtxActions() {
  const ffmpegRef = React.useRef(new FFmpeg());
  const { videoUrl, videoResolution } = useVideoMetadataCtx();
  const {
    videoStartTime,
    videoEndTime,
    videoDuration,
    cropArea,
    flipH,
    flipV,
  } = useEditorToolsCtx();
  const { setProgress } = useOutputVideoCtx();

  React.useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    if (process.env.NODE_ENV === "development") {
      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });
    }

    ffmpeg.on("progress", ({ progress }) => {
      console.log(progress);
      setProgress([progress]);
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

  const strToCommand = (commandStr: string) => commandStr.split(" ");

  const createUrl = async (outputName?: string) => {
    const ffmpeg = ffmpegRef.current;

    const data = (await ffmpeg.readFile(outputName || "output.mp4")) as any;
    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    // Criar uma URL para a Blob
    return URL.createObjectURL(blob);
  };

  const trimVideo = async () => {
    const ffmpeg = ffmpegRef.current;

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl!));

    const command = `-ss ${videoStartTime.toString()} -to ${videoEndTime.toString()} -i input.mp4 -c copy output.mp4`;
    await ffmpeg.exec(strToCommand(command));

    return createUrl();
  };

  const cutVideo = async () => {
    const ffmpeg = ffmpegRef.current;

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl!));

    const part1 = `-i input.mp4 -t ${videoStartTime.toString()} -c copy part1.mp4`;
    const part2 = `-i input.mp4 -ss ${videoEndTime.toString()} -c copy part2.mp4`;
    const concatParts = "-f concat -safe 0 -i list.txt -c copy output.mp4";

    await ffmpeg.exec(strToCommand(part1));
    await ffmpeg.exec(strToCommand(part2));

    ffmpeg.writeFile(
      "list.txt",
      ["file 'part1.mp4'", "file 'part2.mp4'"].join("\n")
    );

    await ffmpeg.exec(strToCommand(concatParts));

    return createUrl();
  };

  const crop = async () => {
    const ffmpeg = ffmpegRef.current;

    const numCores = navigator.hardwareConcurrency || 4;

    setProgress(() => Array(numCores).fill(0));

    // Criar um array para armazenar os workers
    let workers: any[] = [];

    for (let i = 0; i < numCores; i++) {
      const worker = new Worker(new URL("./worker.worker.js", import.meta.url));
      workers.push(worker);
    }

    const segmentDuration = (videoDuration! / numCores).toFixed(4);

    // Processar cada segmento em um worker separado
    let promises = [];

    for (let i = 0; i < numCores!; i++) {
      promises.push(
        new Promise<void>((resolve, reject) => {
          workers[i].onmessage = async (
            e: MessageEvent<{ type: string; data: string | number }>
          ) => {
            if (e.data.type === "finished") {
              ffmpeg.writeFile(
                `chunk-${i}.mp4`,
                await fetchFile(e.data.data as string)
              );
              resolve();
            } else if (e.data.type === "progress") {
              setProgress((prev) => {
                let newProgress = [...prev];
                newProgress[i] = Number(e.data.data);
                return newProgress;
              });
            }
          };
          workers[i].onerror = reject;

          const fromTime = `-ss ${i * parseFloat(segmentDuration)}`;
          const toTime = i + 1 === numCores ? "" : ` -t ${segmentDuration}`;
          const command = `-i input.mp4 ${fromTime}${toTime} -c copy output.mp4`;

          workers[i].postMessage({
            videoUrl,
            command,
            cropArea,
            videoWidth: videoResolution!.w,
            videoHeight: videoResolution!.h,
          } as DataType);
        })
      );
    }

    // Aguardar todos os segmentos serem processados
    await Promise.all(promises);

    ffmpeg.writeFile(
      "list.txt",
      Array(numCores)
        .fill(undefined)
        .map((_, i) => `file 'chunk-${i}.mp4'`)
        .join("\n")
      // ["file 'part1.mp4'", "file 'part2.mp4'"].join("\n")
    );

    // concat video chunks
    await ffmpeg.exec(
      strToCommand("-f concat -safe 0 -i list.txt -c copy output.mp4")
    );

    return createUrl();
  };

  const flip = async () => {
    const ffmpeg = ffmpegRef.current;

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl!));

    let flipType = [];

    if (flipH) flipType.push(["hflip"]);
    if (flipV) flipType.push(["vflip"]);

    const command = `-i input.mp4 -vf ${flipType.join(
      ","
    )} -c:a copy output.mp4`;

    await ffmpeg.exec(strToCommand(command));

    return createUrl();
  };

  const addTextOnVideo = async (
    text: string = "Me nombre es Victor A",
    x: number = 10,
    y: number = 10,
    fontSize: number = 24,
    fontcolor: string = "white"
  ) => {
    const ffmpeg = ffmpegRef.current;

    // Escrever o arquivo de vídeo
    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl!));

    await ffmpeg.writeFile(
      "arial.ttf",
      await fetchFile(
        "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf"
      )
    );

    //fontfile=/arial.ttf:
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-vf",
      `drawtext=fontfile=/arial.ttf:text=\'${text}\':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=${fontcolor}`,
      "output.mp4",
    ]);

    return createUrl();
  };

  const toWebm = async (url: string) => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.writeFile("input.mp4", await fetchFile(url));

    console.log("now");

    const command =
      "-i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm".split(
        " "
      );

    console.log(command);

    await ffmpeg.exec(command);

    console.log("exec exited");

    const data2 = (await ffmpeg.readFile("output.webm")) as any;
    return URL.createObjectURL(
      new Blob([data2.buffer], { type: "video/webm" })
    );
  };

  return {
    trimVideo,
    cutVideo,
    crop,
    flip,
    addTextOnVideo,
  };
}
