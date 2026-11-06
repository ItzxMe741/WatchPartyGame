import React, { useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { CinemaRoom } from './components/3d/CinemaRoom';
import { LocalPlayer } from './components/3d/LocalPlayer';
import { RemotePlayer } from './components/3d/RemotePlayer';
import { CameraRig } from './components/3d/CameraRig';
import { VideoControlBar } from './components/ui/VideoControlBar';
import { RoomInfoBar } from './components/ui/RoomInfoBar';
import { OxygenMemeButton } from './components/ui/OxygenMemeButton';
import { ChatBox } from './components/ui/ChatBox';
import { JerseySelector } from './components/ui/JerseySelector';
import { Lobby } from './components/ui/Lobby';
import { CinemaTopToolbar } from './components/ui/CameraToolbar';
import { useMultiplayer } from './hooks/useMultiplayer';

// Tọa độ định sẵn của từng ghế rạp
const SEAT_COORDINATES: Record<string, [number, number, number]> = {};
[
  { name: 'A', z: -2.0, y: 0.0 },
  { name: 'B', z: 0.8, y: 0.6 },
  { name: 'C', z: 3.6, y: 1.2 },
  { name: 'D', z: 6.4, y: 1.8 },
].forEach((row) => {
  [-4.2, -3.1, -2.0].forEach((x, idx) => {
    SEAT_COORDINATES[`${row.name}${idx + 1}`] = [x, row.y, row.z];
  });
  [2.0, 3.1, 4.2].forEach((x, idx) => {
    SEAT_COORDINATES[`${row.name}${idx + 4}`] = [x, row.y, row.z];
  });
});

export default function App() {
  // Trạng thái: Đang ở Sảnh Lobby hay Đã bước vào Rạp 3D
  const [isInCinema, setIsInCinema] = useState(false);

  // Local Player customization
  const [localName, setLocalName] = useState('LCK_Viewer');
  const [localTeam, setLocalTeam] = useState('t1');
  const [localVariant, setLocalVariant] = useState('home');
  const [localNumber, setLocalNumber] = useState(99);
  const [localCustomName, setLocalCustomName] = useState('FAKER');

  // Mặc định tự động ngồi ghế VIP trung tâm B4
  const [currentSeatId, setCurrentSeatId] = useState<string | null>('B4');

  // Multiplayer Hook
  const {
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
  } = useMultiplayer();

  const playerPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(2.0, 0.7, 0.75));
  const [isUsingOxygen, setIsUsingOxygen] = useState(false);
  const [isJerseyModalOpen, setIsJerseyModalOpen] = useState(false);

  // Seat coordinate if sitting
  const seatPosition = currentSeatId ? SEAT_COORDINATES[currentSeatId] || null : null;

  // Player names mapping for 3D seat labels
  const playerNames = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(remotePlayers).forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [remotePlayers]);

  const handleJoinFromLobby = (config: {
    roomId: string;
    playerName: string;
    teamId: string;
    jerseyVariant: string;
    jerseyNumber: number;
    customName: string;
  }) => {
    setLocalName(config.playerName);
    setLocalTeam(config.teamId);
    setLocalVariant(config.jerseyVariant);
    setLocalNumber(config.jerseyNumber);
    setLocalCustomName(config.customName);

    switchRoom(config.roomId, config.playerName);
    changeJersey(config.teamId, config.jerseyVariant, config.jerseyNumber, config.customName);

    // Tự động ngồi vào ghế VIP B4
    setCurrentSeatId('B4');
    sitSeat('B4');
    setIsInCinema(true);
  };

  const handleExitToLobby = () => {
    if (currentSeatId) {
      standUp();
      setCurrentSeatId(null);
    }
    setIsInCinema(false);
  };

  const handleSelectSeat = (seatId: string) => {
    setCurrentSeatId(seatId);
    sitSeat(seatId);
  };

  const handleAutoSitNext = () => {
    // Đổi qua lại giữa các hàng ghế đẹp
    const popularSeats = ['B4', 'B3', 'C4', 'C3', 'A4', 'D4'];
    const nextIdx = (popularSeats.indexOf(currentSeatId || '') + 1) % popularSeats.length;
    const targetSeat = popularSeats[nextIdx];
    handleSelectSeat(targetSeat);
  };

  const handleApplyJersey = (teamId: string, variant: string, number: number, customName: string) => {
    setLocalTeam(teamId);
    setLocalVariant(variant);
    setLocalNumber(number);
    setLocalCustomName(customName);
    changeJersey(teamId, variant, number, customName);
  };

  const handleToggleOxygen = () => {
    const nextVal = !isUsingOxygen;
    setIsUsingOxygen(nextVal);
    setOxygen(nextVal);
  };

  const handleCheer = () => {
    sendEmote('🏆');
  };

  // Nếu chưa vào rạp -> Hiển thị Sảnh Chờ Lobby
  if (!isInCinema) {
    return <Lobby onJoinRoom={handleJoinFromLobby} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 1. Canvas Three.js R3F 3D Cinema Scene - GÓC NHÌN CỐ ĐỊNH TỪ DƯỚI LÊN MÀN HÌNH */}
      <Canvas
        camera={{ position: [0, 2.2, 4.2], fov: 62 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <color attach="background" args={['#040508']} />

        {/* Khán phòng rạp chiếu phim + Màn hình khổng lồ */}
        <CinemaRoom
          videoId={videoState.videoId}
          isPlaying={videoState.status === 'PLAYING'}
          takenSeats={takenSeats}
          playerNames={playerNames}
          onSelectSeat={handleSelectSeat}
        />

        {/* Camera Cố Định Nhìn Từ Dưới Lên Chuẩn Rạp Chiếu Phim (Fixed Camera Rig) */}
        <CameraRig seatPosition={seatPosition} />

        {/* Người chơi cục bộ (Ngồi ghế xem phim, ẩn đầu ở góc nhìn chính để màn hình thông thoáng) */}
        <LocalPlayer
          name={localName}
          teamId={localTeam}
          jerseyVariant={localVariant}
          jerseyNumber={localNumber}
          customName={localCustomName}
          currentSeatId={currentSeatId}
          seatPosition={seatPosition}
          isUsingOxygen={isUsingOxygen}
          cameraPreset="seat"
          playerPositionRef={playerPositionRef}
          onTransformChange={sendTransform}
          onStandUp={() => {}}
        />

        {/* Những người chơi khác trong rạp (Đồng đội ngồi xem cùng bạn) */}
        {Object.values(remotePlayers).map((player) => (
          <RemotePlayer
            key={player.id}
            id={player.id}
            name={player.name}
            transform={player.transform}
            animation={player.animation || 'sit'}
            teamId={player.teamId}
            jerseyVariant={player.jerseyVariant}
            jerseyNumber={player.jerseyNumber}
            customName={player.customName}
            isUsingOxygen={player.isUsingOxygen}
          />
        ))}
      </Canvas>

      {/* 2. 2D UI Overlay Layers */}
      <VideoControlBar
        currentVideoId={videoState.videoId}
        videoTitle={videoState.title}
        isPlaying={videoState.status === 'PLAYING'}
        isHost={isHost}
        onPlay={playVideo}
        onPause={pauseVideo}
        onChangeVideo={changeVideo}
      />

      <RoomInfoBar
        roomId={roomId}
        playerCount={Object.keys(remotePlayers).length + 1}
        currentSeatId={currentSeatId}
        cameraViewMode="cinema_direct"
        onToggleCameraView={() => {}}
        onOpenJerseyModal={() => setIsJerseyModalOpen(true)}
        onStandUp={handleAutoSitNext}
        onChangeRoom={(newId) => switchRoom(newId, localName)}
      />

      <CinemaTopToolbar
        currentSeatId={currentSeatId}
        onExitToLobby={handleExitToLobby}
        onAutoSit={handleAutoSitNext}
      />

      <OxygenMemeButton
        isUsingOxygen={isUsingOxygen}
        onToggleOxygen={handleToggleOxygen}
        onCheer={handleCheer}
      />

      {/* Khung Chat Tích Hợp Link Bật Video / Live Stream Tương Tác */}
      <ChatBox
        messages={messages}
        onSendMessage={sendMessage}
        onSendEmote={sendEmote}
        onChangeVideo={changeVideo}
      />

      <JerseySelector
        isOpen={isJerseyModalOpen}
        currentTeamId={localTeam}
        currentVariant={localVariant}
        currentNumber={localNumber}
        currentCustomName={localCustomName}
        onClose={() => setIsJerseyModalOpen(false)}
        onSelectJersey={handleApplyJersey}
      />
    </div>
  );
}
