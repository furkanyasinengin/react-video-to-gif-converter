import { useEffect, useState, useRef, useCallback } from "react";
import type { WorkerResponse } from "../types/worker.types";

export const useConverter = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [gif, setGif] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/ffmpeg.worker.ts", import.meta.url),
        { type: "module" }
      );
      workerRef.current.onmessage = (event) => {
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
        }
      };
      workerRef.current.postMessage({ type: "LOAD" });
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const convertVideo = useCallback((file: File) => {
    setConverting(true);
    setError(null);
    setGif(null);
    if (workerRef.current) {
      workerRef.current.postMessage({ type: "CONVERT", file: file });
    }
  }, []);

  return { ready, converting, progress, gif, error, convertVideo };
};
