import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import type { WorkerRequest, WorkerResponse } from "../types/worker.types";

const ffmpeg = new FFmpeg();

ffmpeg.on("progress", ({ progress }) => {
  self.postMessage({ type: "PROGRESS", progress } as WorkerResponse);
});

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { type } = event.data;
  switch (type) {
    case "LOAD":
      try {
        const baseURL = event.data.baseUrl;
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });

        self.postMessage({ type: "LOADED" } as WorkerResponse);
      } catch (error: any) {
        self.postMessage({
          type: "ERROR",
          message: error.message,
        } as WorkerResponse);
      }
      break;

    case "CONVERT": {
      try {
        const { file } = event.data;
        await ffmpeg.writeFile("input.mp4", await fetchFile(file));
        await ffmpeg.exec(["-i", "input.mp4", "output.gif"]);
        const data = await ffmpeg.readFile("output.gif");

        const blob = new Blob([new Uint8Array(data as any)], {
          type: "image/gif",
        });
        self.postMessage({ type: "DONE", data: blob } as WorkerResponse);

        await ffmpeg.deleteFile("input.mp4");
        await ffmpeg.deleteFile("output.gif");
      } catch (error: any) {
        self.postMessage({
          type: "ERROR",
          message: error.message,
        } as WorkerResponse);
      }
      break;
    }
  }
};
