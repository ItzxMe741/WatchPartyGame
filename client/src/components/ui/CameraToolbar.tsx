import React, { useState, useEffect } from 'react';
import { Maximize, Minimize, LogOut, Armchair } from 'lucide-react';

interface CinemaTopToolbarProps {
  currentSeatId: string | null;
  onExitToLobby: () => void;
  onAutoSit: () => void;
}

export const CinemaTopToolbar: React.FC<CinemaTopToolbarProps> = ({
  currentSeatId,
  onExitToLobby,
  onAutoSit,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
      {/* Nút Đổi/Ngồi Ghế VIP */}
      <button
        onClick={onAutoSit}
        className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-amber-300 font-semibold text-xs transition shadow-2xl backdrop-blur-md flex items-center gap-1.5 active:scale-95"
        title="Đổi sang ghế xem phim trung tâm đẹp nhất"
      >
        <Armchair className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">{currentSeatId ? `Ghế [${currentSeatId}]` : 'Chọn Ghế VIP'}</span>
      </button>

      {/* Nút Toàn Màn Hình (Fullscreen) */}
      <button
        onClick={toggleFullscreen}
        className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-300 hover:text-white transition shadow-2xl backdrop-blur-md active:scale-95"
        title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình (Full Screen)'}
      >
        {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4" />}
      </button>

      {/* Nút Thoát Về Sảnh Chờ / Trang Chủ */}
      <button
        onClick={onExitToLobby}
        className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-600 border border-rose-500/80 rounded-2xl text-white font-bold text-xs transition shadow-2xl backdrop-blur-md flex items-center gap-1.5 active:scale-95"
        title="Rời khỏi rạp và quay lại Sảnh Trang Chủ"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Về Sảnh</span>
      </button>
    </div>
  );
};
