import { useState } from "react";
import type { ChangeEvent } from "react";
import { useConverter } from "./hooks/useConverter";

const App = () => {
  const { ready, converting, progress, gif, convertVideo, error } =
    useConverter();

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 font-mono">
        Video To GIF
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
        <label
          className={`font-mono w-full text-center px-5 py-3 rounded-xl text-white text-xl transition-all shadow-lg ${
            ready
              ? "bg-sky-500 hover:bg-sky-600 cursor-pointer"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          htmlFor="fileInput"
        >
          {file ? file.name : ready ? "Upload Video" : "Loading Core..."}
        </label>
        <input
          onChange={handleFileChange}
          hidden={true}
          disabled={!ready}
          id="fileInput"
          type="file"
          accept="video/*"
        />
        <button
          className={`font-mono w-full text-center px-5 py-3 rounded-xl text-white text-xl transition-all shadow-lg ${
            converting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
          }`}
          onClick={() => file && convertVideo(file)}
          type="button"
          disabled={converting || !file}
        >
          {converting ? `% ${Math.floor(progress * 100)}` : "Convert To GIF"}
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
            download="converted.gif"
            className="text-sm text-gray-500 underline hover:text-sky-600"
          >
            Download GIF
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
