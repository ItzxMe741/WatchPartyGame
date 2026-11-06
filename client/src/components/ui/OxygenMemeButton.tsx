import React, { useEffect } from 'react';
import { Wind, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OxygenMemeButtonProps {
  isUsingOxygen: boolean;
  onToggleOxygen: () => void;
  onCheer: () => void;
}

export const OxygenMemeButton: React.FC<OxygenMemeButtonProps> = ({
  isUsingOxygen,
  onToggleOxygen,
  onCheer,
}) => {
  // Phím tắt O (Oxy) và C (Cheer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code.toLowerCase() === 'keyo') {
        onToggleOxygen();
      } else if (e.code.toLowerCase() === 'keyc') {
        triggerCheer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleOxygen]);

  const triggerCheer = () => {
    onCheer();
    // Bắn pháo hoa ăn mừng LCK
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#e4002b', '#ffd700', '#00e5ff'],
    });
  };

  return (
    <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3 pointer-events-auto">
      {/* Nút HÍT OXY MEME */}
      <button
        onClick={onToggleOxygen}
        className={`group relative px-5 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-2xl active:scale-95 ${
          isUsingOxygen
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 ring-4 ring-cyan-400/50 scale-105 animate-pulse'
            : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400'
        }`}
      >
        <Wind className={`w-5 h-5 ${isUsingOxygen ? 'animate-spin' : 'group-hover:scale-110'} transition`} />
        <div className="flex flex-col text-left">
          <span>{isUsingOxygen ? 'ĐANG HÍT OXY...' : 'HÍT OXY KHẨN CẤP'}</span>
          <span className="text-[10px] font-normal lowercase tracking-normal text-cyan-300/80">
            Phím tắt [O]
          </span>
        </div>
        {isUsingOxygen && (
          <span className="absolute -top-3 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
            99% SPO2 💨
          </span>
        )}
      </button>

      {/* Nút Cheer / Ăn Mừng Vô Địch */}
      <button
        onClick={triggerCheer}
        className="px-4 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-xl"
        title="Ăn mừng / Cheer [C]"
      >
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline">Ăn Mừng [C]</span>
      </button>
    </div>
  );
};
