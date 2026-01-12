import { useState } from "react";
import { useConverter } from "./hooks/useConverter";
import DropZone from "./components/upload/DropZone";
import VideoSettings from "./components/settings/VideoSettings";

const App = () => {
  const { ready, converting, progress, gif, convertVideo, error } =
    useConverter();

  const [file, setFile] = useState<File | null>(null);

  const [fps, setFps] = useState<number>(15);
  const [scale, setScale] = useState<number>(480);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [maxDuration, setMaxDuration] = useState<number>(0);

  const handleFileChange = (file: File) => {
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = url;

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        setMaxDuration(duration);
        setStartTime(0);
        setEndTime(Math.min(5, duration));
        URL.revokeObjectURL(url);
        videoElement.remove();
      };
    }
  };

  const handleStartTimeChange = (val: number) => {
    if (val < 0) val = 0;
    if (val >= endTime) val = Math.max(0, endTime - 1);
    setStartTime(val);
  };

  const handleEndTimeChange = (val: number) => {
    if (val > maxDuration) val = maxDuration;
    if (val <= startTime) val = startTime + 1;
    setEndTime(val);
  };
  const progressPercent = Math.min(100, Math.floor(progress * 100));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4 p-4">
      <h1 className="text-4xl font-black text-gray-800 tracking-tight font-mono">
        Video <span className="text-emerald-500">To</span> GIF
      </h1>
      {error && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-mono">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md flex flex-col gap-6 border border-gray-100">
        {!file ? (
          <DropZone disabled={!ready} onFileSelected={handleFileChange} />
        ) : (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-2xl">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-gray-700 truncate block">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            {!converting && (
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Delete File"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {file && (
          <VideoSettings
            startTime={startTime}
            endTime={endTime}
            maxDuration={maxDuration}
            fps={fps}
            scale={scale}
            onStartChange={handleStartTimeChange}
            onEndChange={handleEndTimeChange}
            onFpsChange={setFps}
            onScaleChange={setScale}
            disabled={converting}
          />
        )}

        <button
          className={`relative overflow-hiddenfont-mono w-full text-center px-5 py-3 rounded-xl text-white text-xl transition-all shadow-lg ${
            converting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
          }`}
          onClick={() =>
            file &&
            convertVideo(file, {
              fps: fps,
              scale: scale,
              start: startTime,
              end: endTime,
            })
          }
          type="button"
          disabled={converting || !file}
        >
          {converting && (
            <div
              className="absolute inset-0 rounded-xl bg-emerald-500 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          )}
          <span className="relative z-10 font-mono">
            {converting ? `% ${progressPercent}` : "Convert To GIF"}
          </span>
        </button>
      </div>
      {gif && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-emeral-600 font-bold font-mono">Result:</span>
          <img
            src={URL.createObjectURL(gif)}
            alt="Converted GIF"
            className="rounded-lg shadow-2xl border-4 border-white max-w-full md:max-w-md object-contain"
          />
          <a
            href={URL.createObjectURL(gif)}
            download={`converted-${file?.name}.gif`}
            className="flex items-center gap-2 bg-sky-400/70 text-black-700 px-6 py-2 rounded-full font-mono hover:bg-emerald-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download GIF
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
