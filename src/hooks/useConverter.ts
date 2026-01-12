import { useEffect, useState, useRef, useCallback } from "react";
import FFmpegWorker from "../workers/ffmpeg.worker?worker";
import type { WorkerResponse } from "../types/worker.types";

export const useConverter = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [gif, setGif] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new FFmpegWorker();
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const data = event.data as WorkerResponse;

      switch (data.type) {
        case "LOADED":
          setReady(true);
          break;
        case "DONE":
          setGif(data.data);
          setConverting(false);
          break;
        case "PROGRESS":
          setProgress(data.progress);
          break;
        case "ERROR":
          setError(data.message);
          setConverting(false);
          break;
      }
    };

    worker.postMessage({
      type: "LOAD",
      baseUrl: window.location.origin,
    });
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const convertVideo = useCallback((file: File) => {
    if (workerRef.current) {
      setConverting(true);
      setError(null);
      setGif(null);
      workerRef.current.postMessage({ type: "CONVERT", file: file });
    }
  }, []);

  return { ready, converting, progress, gif, error, convertVideo };
};
