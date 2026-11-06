import React, { useState } from 'react';
import { Users, Shirt, Copy, Check, Tv, HelpCircle, Eye, PlusCircle, LogIn, Sparkles } from 'lucide-react';

interface RoomInfoBarProps {
  roomId: string;
  playerCount: number;
  currentSeatId: string | null;
  cameraViewMode: 'cinema_direct' | 'third_person';
  onToggleCameraView: () => void;
  onOpenJerseyModal: () => void;
  onStandUp: () => void;
  onChangeRoom: (newRoomId: string) => void;
}

export const RoomInfoBar: React.FC<RoomInfoBarProps> = ({
  roomId,
  playerCount,
  currentSeatId,
  cameraViewMode,
  onToggleCameraView,
  onOpenJerseyModal,
  onStandUp,
  onChangeRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [inputRoomName, setInputRoomName] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinOrCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomName.trim()) return;
    const cleanRoom = inputRoomName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    onChangeRoom(cleanRoom);
    setShowRoomModal(false);
    setInputRoomName('');
  };

  const handleCreateRandom = () => {
    const randomId = 'lck-' + Math.random().toString(36).substring(2, 7);
    onChangeRoom(randomId);
    setShowRoomModal(false);
  };

  return (
    <>
      {/* Góc trên bên trái: Room badge & Action buttons */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 pointer-events-auto">
        {/* Nút Phòng & Mở Room Manager */}
        <button
          onClick={() => setShowRoomModal(true)}
          className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-xl text-xs transition group"
          title="Bấm để Tạo phòng riêng hoặc Chuyển phòng"
        >
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Tv className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            <span>Phòng: #{roomId}</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
            Đổi phòng
          </span>
        </button>

        {/* Copy Link Mời Bạn Bè */}
        <button
          onClick={handleCopyLink}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-300 hover:text-white transition flex items-center gap-1 text-xs shadow-xl backdrop-blur-md"
          title="Copy link phòng gửi cho bạn bè cùng vào xem"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
          <span className="hidden md:inline">{copied ? 'Đã sao chép link' : 'Mời bạn'}</span>
        </button>

        {/* Số người đang trong phòng */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-2 flex items-center gap-1.5 text-slate-300 text-xs shadow-xl font-medium">
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>{playerCount} người</span>
        </div>

        {/* Nút Đổi Áo Đấu LCK */}
        <button
          onClick={onOpenJerseyModal}
          className="bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-500/50 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs font-bold text-amber-300 backdrop-blur-md shadow-xl transition active:scale-95"
        >
          <Shirt className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Đổi Đồng Phục LCK</span>
        </button>

        {/* Nút Trợ Giúp Phím Tắt */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-400 hover:text-white transition backdrop-blur-md shadow-xl"
          title="Xem hướng dẫn điều khiển"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Thông báo & Công cụ điều khiển khi Đang Ngồi Ghế */}
      {currentSeatId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/60 px-4 py-2 rounded-2xl text-xs font-medium text-amber-300 flex items-center gap-3 shadow-2xl">
            <span>Đang ngồi ghế <strong>[{currentSeatId}]</strong></span>

            {/* Nút Chuyển Đổi Góc Nhìn Xem Phim */}
            <button
              onClick={onToggleCameraView}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold flex items-center gap-1.5 transition border border-slate-600 text-[11px]"
              title="Đổi giữa Góc nhìn rạp trực diện (không bị che) và Góc nhìn toàn cảnh"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{cameraViewMode === 'cinema_direct' ? 'Góc Nhìn: Trực Diện Màn Hình' : 'Góc Nhìn: Toàn Cảnh Ghế'}</span>
            </button>

            {/* Nút Đứng Dậy */}
            <button
              onClick={onStandUp}
              className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-[11px]"
            >
              Đứng dậy [WASD]
            </button>
          </div>
        </div>
      )}

      {/* Modal Quản Lý & Tạo Phòng Riêng */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl text-xs space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-amber-400" />
                Quản Lý & Tạo Phòng Chiếu
              </h3>
              <button
                onClick={() => setShowRoomModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-xs">
              Mỗi phòng là một rạp chiếu phim 3D riêng biệt. Bạn có thể tạo phòng mới cho hội bạn hoặc vào phòng có sẵn!
            </p>

            <form onSubmit={handleJoinOrCreate} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Tên phòng hoặc Mã code:</label>
                <input
                  type="text"
                  value={inputRoomName}
                  onChange={(e) => setInputRoomName(e.target.value)}
                  placeholder="Ví dụ: t1-champions, faker99, ban-be-toi..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Vào / Tạo Phòng Này</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateRandom}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition flex items-center gap-1"
                  title="Tạo phòng ngẫu nhiên"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ngẫu nhiên</span>
                </button>
              </div>
            </form>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Phòng hiện tại: <strong className="text-amber-400">#{roomId}</strong></span>
              <button
                onClick={handleCopyLink}
                className="text-sky-400 hover:underline"
              >
                Sao chép link mời
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hướng Dẫn Điều Khiển */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              🎮 Hướng Dẫn Điều Khiển Rạp 3D
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold">W / A / S / D</span>
                <span>Di chuyển trong rạp</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-sky-400 font-bold">Kéo Chuột Trái/Phải</span>
                <span>Xoay góc nhìn 360° tự do</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">Click vào ghế</span>
                <span>Ngồi vào ghế xem phim</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-rose-400 font-bold">Phím [O]</span>
                <span>Hít oxy khẩn cấp (Meme)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold">Phím [C]</span>
                <span>Ăn mừng vô địch</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition mt-4"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
