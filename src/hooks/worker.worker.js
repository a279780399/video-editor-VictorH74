import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from "@ffmpeg/util";



self.onmessage = async (e) => {
    const { videoUrl, fromTime, toTime } = e.data

    const ffmpeg = new FFmpeg()

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    }

    await load()

    ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));

    const command = `-i input.mp4 -ss ${fromTime} -to ${toTime
        } -c copy output.mp4`;

    await ffmpeg.exec(command.split(" "));

    // crop=w:h:x:y'
    await ffmpeg.exec([
        "-i",
        "output.mp4",
        "-vf",
        "crop=ih/9*16:ih:(iw-ih/9*16)/2:0",
        "-c:a",
        "copy",
        "output2.mp4",
    ]);

    const data = (await ffmpeg.readFile("output2.mp4"));
    // Criar uma Blob a partir dos dados
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    // Criar uma URL para a Blob
    self.postMessage(URL.createObjectURL(blob));
}