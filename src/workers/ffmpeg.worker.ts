import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { WorkerRequest } from "../types/worker.types";

const ffmpeg = new FFmpeg();

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { type } = event.data;
  switch (type) {
    case "LOAD":
      await ffmpeg.load();
      self.postMessage({ type: "LOADED" });
      break;

    case "CONVERT": {
      const { file } = event.data;
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.exec(["-i", "input.mp4", "output.gif"]);
      const data = await ffmpeg.readFile("output.gif");
      const blobFile = new Blob([new Uint8Array(data as any)], {
        type: "image/gif",
      });
      self.postMessage({ type: "DONE", data: blobFile });
      break;
    }
  }
};
