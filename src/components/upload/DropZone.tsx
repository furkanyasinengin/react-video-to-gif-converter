import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

const DropZone = ({ onFileSelected, disabled }: DropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("video/")) {
      onFileSelected(file);
    } else {
      alert("Only Video Files");
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };
  return (
    <>
      <div
        className={`w-full max-w-xl h-64 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer ${
          disabled
            ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
            : ""
        } ${
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-105 shadow-2xl"
            : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleClick}
      >
        <div
          className={`p-4 rounded-full ${
            isDragOver
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-700">
            {isDragOver ? "Drop File!" : "Upload Video"}
          </p>
          <p className="text-sm text-gray-400 mt-2">Drag Here or Click</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={onInputChange}
        disabled={disabled}
      />
    </>
  );
};

export default DropZone;
