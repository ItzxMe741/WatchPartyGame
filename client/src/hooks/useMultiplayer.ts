import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMsg } from '../components/ui/ChatBox';

export interface RemotePlayerData {
  id: string;
  name: string;
  isHost: boolean;
  transform: { x: number; y: number; z: number; rotationY: number };
  animation: string;
  teamId: string;
  jerseyVariant: string;
  jerseyNumber: number;
  customName: string;
  seatId: string | null;
  isUsingOxygen: boolean;
}

export function useMultiplayer() {
  const [roomId, setRoomId] = useState<string>('lck-champions');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [remotePlayers, setRemotePlayers] = useState<Record<string, RemotePlayerData>>({});
  const [takenSeats, setTakenSeats] = useState<Record<string, string>>({}); // seatId -> playerId
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Video state
  const [videoState, setVideoState] = useState<{
    videoId: string;
    title?: string;
    status: 'PLAYING' | 'PAUSED' | 'IDLE';
    mediaTime: number;
  }>({
    videoId: 'kJQP7kiw5Fk', // Default LCK highlight video ID
    title: 'LCK 2025 Opening Highlight',
    status: 'PAUSED',
    mediaTime: 0,
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Đọc roomId từ query param nếu có
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room') || 'lck-champions';
    setRoomId(roomParam);

    // Sử dụng VITE_SERVER_URL khi deploy online (Vercel/Cloudflare) hoặc fallback về localhost:3001
    const socketUrl = (import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Connected to LCK Cinema Server:', socket.id);
      setIsConnected(true);

      // Join room
      socket.emit('room:join', {
        roomId: roomParam,
        playerName: 'LCK_Fan_' + Math.floor(Math.random() * 900 + 100),
        teamId: 't1',
        jerseyVariant: 'home',
        jerseyNumber: 99,
        customName: 'FAKER',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('room:initial_state', (data: any) => {
      if (data.hostId === socket.id) {
        setIsHost(true);
      }
      if (data.video) {
        setVideoState(data.video);
      }
      if (data.takenSeats) {
        setTakenSeats(data.takenSeats);
      }
      if (data.players) {
        const others: Record<string, RemotePlayerData> = {};
        Object.entries(data.players).forEach(([id, p]: [string, any]) => {
          if (id !== socket.id) {
            others[id] = p;
          }
        });
        setRemotePlayers(others);
      }
    });

    socket.on('player:joined', (player: RemotePlayerData) => {
      if (player.id !== socket.id) {
        setRemotePlayers((prev) => ({ ...prev, [player.id]: player }));
      }
    });

    socket.on('player:left', ({ id, newHostId }: { id: string; newHostId?: string }) => {
      setRemotePlayers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (newHostId && newHostId === socket.id) {
        setIsHost(true);
      }
    });

    socket.on('player:moved', ({ id, transform, animation }: any) => {
      setRemotePlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: {
            ...prev[id],
            transform,
            animation,
          },
        };
      });
    });

    socket.on('player:jersey_changed', (data: any) => {
      setRemotePlayers((prev) => {
        if (!prev[data.id]) return prev;
        return {
          ...prev,
          [data.id]: {
            ...prev[data.id],
            teamId: data.teamId,
            jerseyVariant: data.variant,
            jerseyNumber: data.number,
            customName: data.customName,
          },
        };
      });
    });

    socket.on('player:oxygen_state', ({ id, isUsingOxygen }: any) => {
      setRemotePlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: {
            ...prev[id],
            isUsingOxygen,
            animation: isUsingOxygen ? 'oxygen' : 'idle',
          },
        };
      });
    });

    socket.on('seat:occupied', ({ seatId, playerId }: { seatId: string; playerId: string }) => {
      setTakenSeats((prev) => ({ ...prev, [seatId]: playerId }));
    });

    socket.on('seat:freed', ({ seatId }: { seatId: string }) => {
      setTakenSeats((prev) => {
        const next = { ...prev };
        delete next[seatId];
        return next;
      });
    });

    socket.on('video:sync', (newVideoState: any) => {
      setVideoState(newVideoState);
    });

    socket.on('chat:message', (msg: ChatMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Dispatch methods
  const sendTransform = useCallback(
    (transform: { x: number; y: number; z: number; rotationY: number }, animation: string) => {
      socketRef.current?.emit('player:transform', { transform, animation });
    },
    []
  );

  const sitSeat = useCallback((seatId: string) => {
    socketRef.current?.emit('player:sit', { seatId });
  }, []);

  const standUp = useCallback(() => {
    socketRef.current?.emit('player:stand');
  }, []);

  const changeJersey = useCallback(
    (teamId: string, variant: string, number: number, customName: string) => {
      socketRef.current?.emit('player:change_jersey', {
        teamId,
        variant,
        number,
        customName,
      });
    },
    []
  );

  const setOxygen = useCallback((isUsing: boolean) => {
    socketRef.current?.emit('player:oxygen', isUsing);
  }, []);

  const sendEmote = useCallback((emoteType: string) => {
    socketRef.current?.emit('player:emote', emoteType);
    socketRef.current?.emit('chat:send', emoteType);
  }, []);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.emit('chat:send', text);
  }, []);

  const playVideo = useCallback(() => {
    socketRef.current?.emit('video:play');
  }, []);

  const pauseVideo = useCallback(() => {
    socketRef.current?.emit('video:pause');
  }, []);

  const changeVideo = useCallback((videoId: string, title?: string) => {
    socketRef.current?.emit('video:change', { videoId, title });
  }, []);

  const switchRoom = useCallback(
    (newRoomId: string, playerName?: string) => {
      if (!newRoomId || newRoomId === roomId) return;
      setRoomId(newRoomId);
      setRemotePlayers({});
      setTakenSeats({});
      setMessages([]);

      // Update URL param
      const url = new URL(window.location.href);
      url.searchParams.set('room', newRoomId);
      window.history.pushState({}, '', url.toString());

      socketRef.current?.emit('room:join', {
        roomId: newRoomId,
        playerName: playerName || 'LCK_Fan_' + Math.floor(Math.random() * 900 + 100),
        teamId: 't1',
        jerseyVariant: 'home',
        jerseyNumber: 99,
        customName: 'FAKER',
      });
    },
    [roomId]
  );

  return {
    roomId,
    isConnected,
    isHost,
    remotePlayers,
    takenSeats,
    videoState,
    messages,
    sendTransform,
    sitSeat,
    standUp,
    changeJersey,
    setOxygen,
    sendEmote,
    sendMessage,
    playVideo,
    pauseVideo,
    changeVideo,
    switchRoom,
  };
}
