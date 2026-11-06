import React, { useState } from 'react';
import { LCK_TEAMS } from '../../constants/teams';
import { Shirt, Check, X, Sparkles } from 'lucide-react';

interface JerseySelectorProps {
  currentTeamId: string;
  currentVariant: string;
  currentNumber: number;
  currentCustomName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectJersey: (teamId: string, variant: string, number: number, customName: string) => void;
}

export const JerseySelector: React.FC<JerseySelectorProps> = ({
  currentTeamId,
  currentVariant,
  currentNumber,
  currentCustomName,
  isOpen,
  onClose,
  onSelectJersey,
}) => {
  const [selectedTeam, setSelectedTeam] = useState(currentTeamId);
  const [selectedVariant, setSelectedVariant] = useState(currentVariant);
  const [number, setNumber] = useState(currentNumber);
  const [customName, setCustomName] = useState(currentCustomName);

  if (!isOpen) return null;

  const teamData = LCK_TEAMS[selectedTeam] || LCK_TEAMS.t1;
  const availableVariants = Object.values(teamData.variants);

  const handleApply = () => {
    onSelectJersey(selectedTeam, selectedVariant, Number(number) || 99, customName.trim() || 'FAN');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 pointer-events-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Hệ Thống Đồng Phục LCK
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Khoác lên màu áo đội tuyển bạn yêu thích và hòa cùng không khí cuồng nhiệt!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Chọn Đội Tuyển LCK */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              1. Chọn Đội Tuyển
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(LCK_TEAMS).map((team) => {
                const isSelected = team.id === selectedTeam;
                return (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team.id);
                      const firstVariant = Object.keys(team.variants)[0];
                      setSelectedVariant(firstVariant);
                      setNumber(team.defaultNumber);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{team.badgeEmoji}</span>
                      <span className="text-xs font-black tracking-wider text-slate-300">
                        {team.shortName}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white truncate">{team.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{team.tagline}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Biến Thể Áo Đấu (Home / Away / Worlds Special) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              2. Biến Thể Áo Đấu ({teamData.name})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableVariants.map((variant) => {
                const isSelected = variant.id === selectedVariant;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                        style={{ backgroundColor: variant.primaryColor }}
                      />
                      <span className="text-xs font-semibold">{variant.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tùy Chỉnh Số Áo & Tên In Sau Lưng */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              3. Tùy Biến Tên & Số Áo Sau Lưng
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tên in sau áo (IGN):</label>
                <input
                  type="text"
                  maxLength={12}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  placeholder="FAKER, CHOVI, SHOWMAKER..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400 uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Số áo thi đấu (0-99):</label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={number}
                  onChange={(e) => setNumber(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/25 transition flex items-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Xác Nhận Thay Áo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
