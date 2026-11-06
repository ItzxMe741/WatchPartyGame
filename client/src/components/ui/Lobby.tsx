import React, { useState } from 'react';
import { LCK_TEAMS, LCKTeam, TeamVariant } from '../../constants/teams';
import { Tv, Sparkles, User, ArrowRight, Shield, Shirt, Play } from 'lucide-react';

interface LobbyProps {
  onJoinRoom: (config: {
    roomId: string;
    playerName: string;
    teamId: string;
    jerseyVariant: string;
    jerseyNumber: number;
    customName: string;
  }) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('LCK_Viewer_' + Math.floor(Math.random() * 899 + 100));
  const [selectedTeam, setSelectedTeam] = useState('t1');
  const [selectedVariant, setSelectedVariant] = useState('home');
  const [jerseyNumber, setJerseyNumber] = useState(99);
  const [customName, setCustomName] = useState('FAKER');
  const [roomId, setRoomId] = useState('lck-champions');

  const teamData = LCK_TEAMS[selectedTeam] || LCK_TEAMS.t1;
  const availableVariants = Object.values(teamData.variants) as TeamVariant[];

  const handleEnterCinema = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = (roomId.trim() || 'lck-champions').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    onJoinRoom({
      roomId: cleanRoom,
      playerName: playerName.trim() || 'Khán_Giả',
      teamId: selectedTeam,
      jerseyVariant: selectedVariant,
      jerseyNumber: Number(jerseyNumber) || 99,
      customName: (customName.trim() || playerName).toUpperCase(),
    });
  };

  const handleQuickRoom = (targetRoom: string) => {
    setRoomId(targetRoom);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080e] overflow-y-auto text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Background Decor Ambient */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/15 blur-[140px]" />
        <div className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-sky-500/15 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-slate-800/80 backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-2">
              LCK CINEMA WATCH PARTY
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                3D VIRTUAL
              </span>
            </h1>
            <p className="text-xs text-slate-400">Rạp chiếu phim 3D ảo cho fan hâm mộ LCK Việt Nam</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span>LCK Spring 2025</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400">Máy chủ sẵn sàng</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <form onSubmit={handleEnterCinema} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cột Trái: Chọn Đội Tuyển & Tạo Nhân Vật (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
            <div>
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <Shirt className="w-4 h-4" /> 1. Chọn Đội Tuyển & Đồng Phục Yêu Thích
              </h2>
              <p className="text-xs text-slate-400">Khoác áo đội bạn cổ vũ để vào rạp cổ vũ cùng mọi người</p>
            </div>

            {/* Grid các đội LCK */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.values(LCK_TEAMS) as LCKTeam[]).map((team) => {
                const isSelected = team.id === selectedTeam;
                return (
                  <button
                    type="button"
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team.id);
                      const firstVariant = Object.keys(team.variants)[0];
                      setSelectedVariant(firstVariant);
                      setJerseyNumber(team.defaultNumber);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20'
                        : 'border-slate-800/90 bg-slate-950/50 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xl">{team.badgeEmoji}</span>
                      <span className="text-xs font-black text-slate-300">{team.shortName}</span>
                    </div>
                    <span className="font-bold text-xs text-white truncate">{team.name}</span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Chọn Biến Thể Áo Đấu */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Biến thể áo ({teamData.name}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableVariants.map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition ${
                      v.id === selectedVariant
                        ? 'border-sky-400 bg-sky-500/15 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: v.primaryColor }}
                    />
                    <span className="truncate">{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tuỳ biến Tên & Số Áo */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Tên in sau lưng (IGN):
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  placeholder="FAKER, CHOVI..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                  Số áo thi đấu:
                </label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin Người Chơi & Chọn Phòng Chiếu (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-5">
              <div>
                <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" /> 2. Thông Tin Khán Giả
                </h2>
                <p className="text-xs text-slate-400">Tên hiển thị trên đầu nhân vật trong rạp</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên bạn trong rạp:</label>
                <input
                  type="text"
                  maxLength={18}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Nhập nickname của bạn..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Phòng Chiếu Phim (Room ID):
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="lck-champions, faker99..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Gợi ý phòng nhanh */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Hoặc chọn phòng có sẵn:</span>
                <div className="flex flex-wrap gap-2">
                  {['lck-champions', 't1-faker', 'geng-house', 'lck-vietnam'].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => handleQuickRoom(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                        roomId === r
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      #{r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút Bước Vào Rạp Chiếu Phim */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-rose-600/25 transition active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>BƯỚC VÀO RẠP CHIẾU PHIM</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Meme Hint Card */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-400 text-xs flex items-center gap-3">
              <span className="text-2xl">💨</span>
              <p>
                Trang bị sẵn <strong className="text-cyan-400">Bình Oxy khẩn cấp</strong> (Phím <strong>[O]</strong>) để cấp cứu khi đội nhà đánh combat nghẹt thở!
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        LCK Cinema Watch Party — Three.js + React Three Fiber + Node.js Socket.io.
      </footer>
    </div>
  );
};
