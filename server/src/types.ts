export type VideoStatus = 'IDLE' | 'PLAYING' | 'PAUSED';

export interface VideoState {
  videoId: string; // YouTube video ID (vd: 'dQw4w9WgXcQ' hoặc 'dQw4w9WgXcQ')
  title?: string;
  status: VideoStatus;
  mediaTime: number; // Giây hiện tại khi update trạng thái
  lastServerTimestamp: number; // Thời điểm server ghi nhận update (Date.now())
  playbackRate: number;
  updatedBy: string; // Tên hoặc ID người chỉnh
}

export interface PlayerTransform {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

export interface Player {
  id: string; // Socket ID
  name: string;
  isHost: boolean;
  transform: PlayerTransform;
  animation: string; // 'idle' | 'walk' | 'run' | 'sit' | 'cheer' | 'oxygen'
  teamId: string; // 't1' | 'geng' | 'hle' | 'dk' | 'kt' | 'drx' | 'ns' | 'bro'
  jerseyVariant: string; // 'home' | 'away' | 'special'
  jerseyNumber: number; // Số áo (vd: 99 Faker)
  customName: string; // Tên in trên áo
  seatId: string | null; // ID ghế nếu đang ngồi
  isUsingOxygen: boolean;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  teamId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface EmoteEvent {
  senderId: string;
  emoteType: 'cheer' | 'oxygen' | 'clap' | 'crying' | 'flame' | 'trophy' | 't1' | 'geng';
  timestamp: number;
}

export interface RoomState {
  roomId: string;
  hostId: string;
  video: VideoState;
  players: Record<string, Player>;
  takenSeats: Record<string, string>; // seatId -> playerId
}
