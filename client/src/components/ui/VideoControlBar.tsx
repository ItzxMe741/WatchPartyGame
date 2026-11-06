import React, { useState } from 'react';
import { Play, Pause, Youtube, RefreshCw, Send, Film, RotateCcw } from 'lucide-react';
import { extractYouTubeId } from '../../utils/youtube';

interface VideoControlBarProps {
  currentVideoId: string;
  videoTitle?: string;
  isPlaying: boolean;
  isHost: boolean;
  onPlay: () => void;
  onPause: () => void;
  onChangeVideo: (videoId: string, title?: string) => void;
}

// Preset các video LCK đỉnh cao để người xem chọn nhanh với 1 cú click
const PRESET_VIDEOS = [
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito (Test Video)' },
  { id: 'fB8TyLTD7EE', title: 'RISE (ft. The Glitch Mob, Mako, and The Word Alive) | Worlds' },
  { id: '0nlJuwO0GDs', title: 'GODS ft. NewJeans | Worlds 2023 Anthem' },
  { id: 'C3GouGa0noM', title: 'Heavy Is The Crown ft. Linkin Park | Worlds 2024' },
  { id: 'fmI_Ndrxy14', title: 'Warriors ft. Imagine Dragons | Worlds Anthem' },
];

export const VideoControlBar: React.FC<VideoControlBarProps> = ({
  currentVideoId,
  videoTitle,
  isPlaying,
  onPlay,
  onPause,
  onChangeVideo,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(inputUrl);
    if (id) {
      onChangeVideo(id, `Video YouTube [${id}]`);
      setInputUrl('');
      setShowInput(false);
      setErrorMsg('');
    } else {
      setErrorMsg('Link YouTube chưa đúng định dạng. Hãy copy link từ YouTube dán vào đây!');
    }
  };

  const handleSelectPreset = (preset: { id: string; title: string }) => {
    onChangeVideo(preset.id, preset.title);
    setShowInput(false);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-5 py-2 flex items-center gap-3.5 shadow-2xl text-slate-100">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs tracking-wider">
          <Youtube className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">LCK CINEMA</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Play/Pause controls */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95"
          title={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Tiêu đề video đang phát */}
        <div className="max-w-[180px] sm:max-w-[280px] truncate text-xs font-medium text-slate-300">
          {videoTitle || `ID: ${currentVideoId}`}
        </div>

        {/* Nút Đổi Clip */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-rose-600/30 active:scale-95"
          title="Ai trong phòng cũng có thể đổi video bất cứ lúc nào"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Đổi Clip</span>
        </button>
      </div>

      {/* Popover Dán Link Hoặc Chọn Clip Mẫu */}
      {showInput && (
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 w-80 sm:w-[420px] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-semibold text-slate-300 flex justify-between items-center">
            <span>Dán link YouTube (bất kỳ ai cũng đổi được)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              Công khai
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setErrorMsg('');
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Phát</span>
            </button>
          </form>

          {errorMsg && <div className="text-[11px] text-rose-400 font-medium">{errorMsg}</div>}

          {/* Danh sách clip LCK nổi bật chọn nhanh */}
          <div className="border-t border-slate-800 pt-2 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Hoặc chọn nhanh clip LCK nổi bật:
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {PRESET_VIDEOS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-xs text-slate-300 hover:text-white transition group"
                >
                  <Film className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition" />
                  <span className="truncate">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
