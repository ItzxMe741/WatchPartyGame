import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { CinemaRoom } from './rooms/CinemaRoom.js';
import { Player, ChatMessage, EmoteEvent } from './types.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = new Map<string, CinemaRoom>();

function getOrCreateRoom(roomId: string): CinemaRoom {
  let room = rooms.get(roomId);
  if (!room) {
    room = new CinemaRoom(roomId);
    rooms.set(roomId, room);
    console.log(`[Room Created] Room ID: ${roomId}`);
  }
  return room;
}

// REST endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now(), roomCount: rooms.size });
});

app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map((r) => ({
    roomId: r.roomId,
    playerCount: r.players.size,
    videoTitle: r.video.title,
    videoId: r.video.videoId,
    status: r.video.status,
  }));
  res.json(roomList);
});

// Socket.io handlers
io.on('connection', (socket: Socket) => {
  let currentRoomId: string | null = null;
  let playerId = socket.id;

  // 1. Time sync (NTP-like ping-pong)
  socket.on('sync:ping', (clientSendTimestamp: number) => {
    socket.emit('sync:pong', {
      clientSendTimestamp,
      serverReceiveTimestamp: Date.now(),
    });
  });

  // 2. Join / Switch Room
  socket.on(
    'room:join',
    ({
      roomId,
      playerName,
      teamId,
      jerseyVariant,
      jerseyNumber,
      customName,
    }: {
      roomId: string;
      playerName: string;
      teamId: string;
      jerseyVariant: string;
      jerseyNumber: number;
      customName: string;
    }) => {
      // Nếu đang ở phòng cũ, rời khỏi phòng cũ trước
      if (currentRoomId && currentRoomId !== roomId) {
        socket.leave(currentRoomId);
        const oldRoom = rooms.get(currentRoomId);
        if (oldRoom) {
          const { newHostId, freedSeatId } = oldRoom.removePlayer(playerId);
          if (freedSeatId) {
            io.to(currentRoomId).emit('seat:freed', { seatId: freedSeatId, playerId });
          }
          io.to(currentRoomId).emit('player:left', { id: playerId, newHostId });
        }
      }

      const room = getOrCreateRoom(roomId);
      currentRoomId = roomId;
      socket.join(roomId);

      const newPlayer: Player = {
        id: playerId,
        name: playerName || `Player_${playerId.slice(0, 4)}`,
        isHost: room.players.size === 0,
        transform: {
          x: (Math.random() - 0.5) * 4,
          y: 0,
          z: 3 + Math.random() * 2, // Đứng ở khu vực lối đi giữa rạp
          rotationY: Math.PI, // Nhìn về phía màn hình rạp chiếu
        },
        animation: 'idle',
        teamId: teamId || 't1',
        jerseyVariant: jerseyVariant || 'home',
        jerseyNumber: jerseyNumber || 99,
        customName: customName || playerName || 'FAKER',
        seatId: null,
        isUsingOxygen: false,
        avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      };

      room.addPlayer(newPlayer);

      // Gửi toàn bộ state cho người vừa vào
      socket.emit('room:initial_state', room.getState());

      // Thông báo cho tất cả người khác trong phòng
      socket.to(roomId).emit('player:joined', newPlayer);

      // System chat broadcast
      const joinMsg: ChatMessage = {
        id: 'sys_' + Date.now(),
        senderId: 'SYSTEM',
        senderName: 'Cinema Bot',
        teamId: newPlayer.teamId,
        text: `${newPlayer.name} vừa bước vào rạp với áo đấu [${newPlayer.teamId.toUpperCase()}]!`,
        timestamp: Date.now(),
        isSystem: true,
      };
      io.to(roomId).emit('chat:message', joinMsg);
    }
  );

  // 3. Di chuyển Player (Transform Sync)
  socket.on(
    'player:transform',
    (data: { transform: Player['transform']; animation: string }) => {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      room.updatePlayerTransform(playerId, data.transform, data.animation);
      // Broadcast vị trí cho những người khác trong phòng
      socket.to(currentRoomId).emit('player:moved', {
        id: playerId,
        transform: data.transform,
        animation: data.animation,
      });
    }
  );

  // 4. Ghế ngồi (Sit / Stand)
  socket.on('player:sit', ({ seatId }: { seatId: string }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const success = room.sitSeat(playerId, seatId);
    if (success) {
      io.to(currentRoomId).emit('seat:occupied', { seatId, playerId });
    }
  });

  socket.on('player:stand', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const freedSeatId = room.standUp(playerId);
    if (freedSeatId) {
      io.to(currentRoomId).emit('seat:freed', { seatId: freedSeatId, playerId });
    }
  });

  // 5. Thay đổi đồng phục LCK
  socket.on(
    'player:change_jersey',
    (data: { teamId: string; variant: string; number: number; customName: string }) => {
      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      room.updatePlayerJersey(
        playerId,
        data.teamId,
        data.variant,
        data.number,
        data.customName
      );

      io.to(currentRoomId).emit('player:jersey_changed', {
        id: playerId,
        ...data,
      });
    }
  );

  // 6. Meme Hít Oxy & Emotes
  socket.on('player:oxygen', (isUsing: boolean) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    room.setOxygen(playerId, isUsing);
    io.to(currentRoomId).emit('player:oxygen_state', {
      id: playerId,
      isUsingOxygen: isUsing,
    });
  });

  socket.on('player:emote', (emoteType: EmoteEvent['emoteType']) => {
    if (!currentRoomId) return;
    io.to(currentRoomId).emit('player:emoted', {
      senderId: playerId,
      emoteType,
      timestamp: Date.now(),
    });
  });

  // 7. Video Synchronisation (Server Authoritative)
  socket.on('video:play', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.get(playerId);
    const updatedVideo = room.playVideo(player?.name || 'Someone');
    io.to(currentRoomId).emit('video:sync', updatedVideo);
  });

  socket.on('video:pause', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.get(playerId);
    const updatedVideo = room.pauseVideo(player?.name || 'Someone');
    io.to(currentRoomId).emit('video:sync', updatedVideo);
  });

  socket.on('video:seek', ({ time }: { time: number }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.get(playerId);
    const updatedVideo = room.seekVideo(time, player?.name || 'Someone');
    io.to(currentRoomId).emit('video:sync', updatedVideo);
  });

  socket.on('video:change', ({ videoId, title }: { videoId: string; title?: string }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.get(playerId);
    const updatedVideo = room.changeVideo(videoId, title, player?.name || 'Ai đó');
    io.to(currentRoomId).emit('video:sync', updatedVideo);

    const changeMsg: ChatMessage = {
      id: 'sys_' + Date.now(),
      senderId: 'SYSTEM',
      senderName: 'Cinema Bot',
      teamId: player?.teamId || 't1',
      text: `${player?.name || 'Khán giả'} vừa đổi video sang: "${title || videoId}"!`,
      timestamp: Date.now(),
      isSystem: true,
    };
    io.to(currentRoomId).emit('chat:message', changeMsg);
  });

  // 8. Chat Message
  socket.on('chat:send', (text: string) => {
    if (!currentRoomId || !text || text.trim() === '') return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.get(playerId);
    if (!player) return;

    const msg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      senderId: playerId,
      senderName: player.name,
      teamId: player.teamId,
      text: text.trim().slice(0, 200), // Max 200 chars
      timestamp: Date.now(),
    };

    io.to(currentRoomId).emit('chat:message', msg);
  });

  // 9. Disconnect
  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        const leavingPlayer = room.players.get(playerId);
        const { newHostId, freedSeatId } = room.removePlayer(playerId);

        if (freedSeatId) {
          io.to(currentRoomId).emit('seat:freed', { seatId: freedSeatId, playerId });
        }

        io.to(currentRoomId).emit('player:left', {
          id: playerId,
          name: leavingPlayer?.name,
          newHostId,
        });

        if (room.players.size === 0) {
          console.log(`[Room Closed] Room ID: ${currentRoomId} is empty.`);
          rooms.delete(currentRoomId);
        }
      }
    }
    console.log(`[Socket Disconnected] ${playerId}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎬 LCK Cinema Watch Party Server listening on http://localhost:${PORT}`);
});
