import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ChevronDown, ChevronUp, Youtube, Play, ExternalLink } from 'lucide-react';
import { LCK_TEAMS } from '../../constants/teams';
import { extractYouTubeId } from '../../utils/youtube';

export interface ChatMsg {
  id: string;
  senderId: string;
  senderName: string;
  teamId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

interface ChatBoxProps {
  messages: ChatMsg[];
  onSendMessage: (text: string) => void;
  onSendEmote: (emote: string) => void;
  onChangeVideo: (videoId: string, title?: string) => void;
}

const QUICK_EMOTES = ['🏆', '⭐', '🐯', '🍊', '😭', '🔥', '💨', '👏'];

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  onSendEmote,
  onChangeVideo,
}) => {
  const [inputText, setInputText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Phát hiện xem trong input có link YouTube / Live stream không
  const detectedVideoId = extractYouTubeId(inputText);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Phím tắt Enter khi không focus vào ô nào khác -> mở chat và focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active !== inputRef.current) {
          setIsCollapsed(false);
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handlePlayDetectedVideo = () => {
    if (detectedVideoId) {
      onChangeVideo(detectedVideoId, `Video / Live [${detectedVideoId}]`);
      onSendMessage(`🎬 Đã chuyển màn hình rạp sang video: https://youtu.be/${detectedVideoId}`);
      setInputText('');
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Header toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-xl backdrop-blur-md transition"
      >
        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
        <span>Trò Chuyện & Chia Sẻ Link ({messages.length})</span>
        {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Khung chat */}
      {!isCollapsed && (
        <div className="w-80 sm:w-[400px] bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col h-96 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Messages stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-amber-300/80 text-[11px] italic text-center"
                  >
                    {msg.text}
                  </div>
                );
              }

              const team = LCK_TEAMS[msg.teamId] || LCK_TEAMS.t1;
              const msgVideoId = extractYouTubeId(msg.text);

              return (
                <div key={msg.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {team.shortName} {team.badgeEmoji}
                    </span>
                    <span className="font-bold text-slate-200">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 rounded-2xl px-3 py-2 text-slate-100 font-medium inline-block max-w-[95%] break-words border border-slate-800/80">
                    <div>{msg.text}</div>

                    {/* Nếu tin nhắn có chứa link YouTube, hiển thị nút phát nhanh ngay trong khung chat */}
                    {msgVideoId && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <Youtube className="w-3.5 h-3.5" /> Link YouTube
                        </span>
                        <button
                          onClick={() => onChangeVideo(msgVideoId, `Clip do ${msg.senderName} chia sẻ`)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Chiếu Lên Rạp</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action: Nếu bạn vừa paste link YouTube vào ô input, hiện nút Chiếu Ngay */}
          {detectedVideoId && (
            <div className="my-2 p-2 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-between gap-2 text-xs text-rose-200 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 truncate">
                <Youtube className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">Phát hiện link: ID [{detectedVideoId}]</span>
              </div>
              <button
                type="button"
                onClick={handlePlayDetectedVideo}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[11px] shrink-0 transition flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Chiếu Luôn</span>
              </button>
            </div>
          )}

          {/* Thanh emote nhanh */}
          <div className="flex items-center gap-1.5 py-2 border-t border-slate-800/80 overflow-x-auto">
            {QUICK_EMOTES.map((em) => (
              <button
                key={em}
                onClick={() => onSendEmote(em)}
                className="hover:scale-125 transition text-base p-1 rounded hover:bg-slate-800"
              >
                {em}
              </button>
            ))}
          </div>

          {/* Input text */}
          <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Gõ tin nhắn hoặc dán link YouTube/Live..."
              maxLength={250}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition flex items-center justify-center active:scale-95"
              title="Gửi"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
