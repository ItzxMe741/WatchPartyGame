import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterChibi } from './CharacterChibi';
interface LocalPlayerProps {
  name: string;
  teamId: string;
  jerseyVariant: string;
  jerseyNumber: number;
  customName: string;
  currentSeatId: string | null;
  seatPosition: [number, number, number] | null;
  isUsingOxygen: boolean;
  cameraPreset?: string;
  playerPositionRef: React.MutableRefObject<THREE.Vector3>;
  onTransformChange: (
    transform: { x: number; y: number; z: number; rotationY: number },
    animation: string
  ) => void;
  onStandUp: () => void;
}

export const LocalPlayer: React.FC<LocalPlayerProps> = ({
  name,
  teamId,
  jerseyVariant,
  jerseyNumber,
  customName,
  currentSeatId,
  seatPosition,
  isUsingOxygen,
  cameraPreset,
  playerPositionRef,
  onTransformChange,
  onStandUp,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const rotationY = useRef(Math.PI); // Mặt hướng về phía màn hình (z âm)
  const currentAnim = useRef('idle');
  const lastSyncTime = useRef(0);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Nếu đang gõ text vào input chat/url thì không di chuyển
      const activeEl = document.activeElement;
      if (activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName)) {
        return;
      }

      const code = e.code.toLowerCase();
      keysPressed.current[code] = true;

      // Nếu đang ngồi mà bấm WASD hoặc Space -> tự động đứng dậy
      if (
        currentSeatId &&
        ['keyw', 'keya', 'keys', 'keyd', 'space', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(code)
      ) {
        onStandUp();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentSeatId, onStandUp]);

  // Cập nhật vị trí khi ngồi vào ghế
  useEffect(() => {
    if (seatPosition && currentSeatId) {
      playerPositionRef.current.set(seatPosition[0], seatPosition[1] + 0.1, seatPosition[2] - 0.05);
      rotationY.current = Math.PI; // Ngồi thẳng hướng về phía màn hình lớn
      currentAnim.current = 'sit';
    }
  }, [seatPosition, currentSeatId, playerPositionRef]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (currentSeatId && seatPosition) {
      // Đang ngồi trên ghế
      groupRef.current.position.set(seatPosition[0], seatPosition[1] + 0.1, seatPosition[2] - 0.05);
      groupRef.current.rotation.y = Math.PI;
      return;
    }

    // Tự do di chuyển (WASD + Mũi tên)
    let moveX = 0;
    let moveZ = 0;
    const speed = 4.5;

    if (keysPressed.current['keyw'] || keysPressed.current['arrowup']) moveZ -= 1;
    if (keysPressed.current['keys'] || keysPressed.current['arrowdown']) moveZ += 1;
    if (keysPressed.current['keya'] || keysPressed.current['arrowleft']) moveX -= 1;
    if (keysPressed.current['keyd'] || keysPressed.current['arrowright']) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = (moveX / length) * speed * delta;
      const dirZ = (moveZ / length) * speed * delta;

      // Giới hạn ranh giới phòng rạp chiếu phim (không đi xuyên tường)
      const nextX = THREE.MathUtils.clamp(playerPositionRef.current.x + dirX, -7.0, 7.0);
      const nextZ = THREE.MathUtils.clamp(playerPositionRef.current.z + dirZ, -4.5, 8.5);

      playerPositionRef.current.x = nextX;
      playerPositionRef.current.z = nextZ;

      // Tính toán độ cao sàn rạp theo các tầng bậc thang
      if (nextZ < -0.6) {
        playerPositionRef.current.y = 0.0;
      } else if (nextZ < 2.2) {
        playerPositionRef.current.y = 0.6;
      } else if (nextZ < 5.0) {
        playerPositionRef.current.y = 1.2;
      } else {
        playerPositionRef.current.y = 1.8;
      }

      // Xoay hướng nhân vật theo hướng di chuyển
      rotationY.current = Math.atan2(moveX, moveZ);
      currentAnim.current = 'walk';
    } else {
      currentAnim.current = isUsingOxygen ? 'oxygen' : 'idle';
    }

    groupRef.current.position.copy(playerPositionRef.current);
    groupRef.current.rotation.y = rotationY.current;

    // Đồng bộ transform lên server định kỳ 50ms
    const now = Date.now();
    if (now - lastSyncTime.current > 50) {
      lastSyncTime.current = now;
      onTransformChange(
        {
          x: playerPositionRef.current.x,
          y: playerPositionRef.current.y,
          z: playerPositionRef.current.z,
          rotationY: rotationY.current,
        },
        currentAnim.current
      );
    }
  });

  // Khi đang ngồi xem ở góc ghế trực diện: ẩn đầu để tầm nhìn màn hình 100% trong suốt
  const shouldHideHead = !!currentSeatId && cameraPreset === 'seat';

  return (
    <group ref={groupRef} position={[playerPositionRef.current.x, playerPositionRef.current.y, playerPositionRef.current.z]}>
      <CharacterChibi
        name={name}
        teamId={teamId}
        jerseyVariant={jerseyVariant}
        jerseyNumber={jerseyNumber}
        customName={customName}
        animation={currentAnim.current}
        isUsingOxygen={isUsingOxygen}
        isCurrentPlayer={true}
        hideHead={shouldHideHead}
      />
    </group>
  );
};
