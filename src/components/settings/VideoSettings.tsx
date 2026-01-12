interface VideoSettingsProps {
  startTime: number;
  endTime: number;
  maxDuration: number;
  fps: number;
  scale: number;
  onStartChange: (val: number) => void;
  onEndChange: (val: number) => void;
  onFpsChange: (val: number) => void;
  onScaleChange: (val: number) => void;
  disabled: boolean;
}

const VideoSettings = ({
  startTime,
  endTime,
  maxDuration,
  fps,
  scale,
  onScaleChange,
  onEndChange,
  onStartChange,
  onFpsChange,
  disabled,
}: VideoSettingsProps) => {
  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 transition-opacity ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h2 className="font-mono font-bold text-gray-700 border-b border-gray-200 pb-2">
        Settings
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs font-bold text-gray-500">
            Start (sec)
          </label>
          <input
            className="bg-white border border-gray-300 rounded-lg p-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            type="number"
            min="0"
            max={maxDuration - 1}
            step="0.1"
            value={startTime}
            onChange={(e) => onStartChange(Number(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs font-bold text-gray-500">
            Max: {maxDuration.toFixed(1)}s
          </label>
          <input
            className="bg-white border border-gray-300 rounded-lg p-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            type="number"
            min={startTime + 1}
            max={maxDuration}
            step="0.1"
            value={endTime}
            onChange={(e) => onEndChange(Number(e.target.value))}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs font-bold text-gray-500">
            FPS
          </label>
          <select
            className="bg-white border border-gray-300 rounded-lg p-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={fps}
            onChange={(e) => onFpsChange(Number(e.target.value))}
            disabled={disabled}
          >
            <option value="10">10 FPS</option>
            <option value="15">15 FPS</option>
            <option value="20">20 FPS</option>
            <option value="24">24 FPS</option>
            <option value="30">30 FPS</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs font-bold text-gray-500">
            Width (px)
          </label>
          <select
            className="bg-white border border-gray-300 rounded-lg p-2 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            disabled={disabled}
          >
            <option value="240">240px</option>
            <option value="360">360px</option>
            <option value="480">480px</option>
            <option value="720">720px</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VideoSettings;
