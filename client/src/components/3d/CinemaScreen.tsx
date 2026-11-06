import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CinemaScreenProps {
  videoId: string;
  isPlaying: boolean;
  onPlayerReady?: (player: any) => void;
}

export const CinemaScreen: React.FC<CinemaScreenProps> = ({ videoId, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Kích thước màn hình rạp chiếu phim (16:9 khổng lồ)
  const screenWidth = 14;
  const screenHeight = 7.875;

  return (
    <group position={[0, 4.5, -9]}>
      {/* Khung viền ngoài của màn hình (Bezel) */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[screenWidth + 0.6, screenHeight + 0.6, 0.1]} />
        <meshStandardMaterial color="#0c0e12" roughness={0.8} metalness={0.5} />
      </mesh>

      {/* Đèn hắt tường Ambilight Glow phía sau màn hình */}
      <pointLight position={[0, 0, -0.2]} intensity={2.5} distance={15} color="#3b82f6" />
      <pointLight position={[0, -2, 0.5]} intensity={1.8} distance={8} color="#e0b042" />

      {/* Mặt phẳng màn hình 3D (Projection Surface) */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* YouTube IFrame Embed được chiếu thẳng vào toạ độ 3D thông qua Drei Html */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.02]}
        distanceFactor={6}
        style={{
          width: '1280px',
          height: '720px',
          userSelect: 'none',
          pointerEvents: 'auto',
          background: '#000',
        }}
      >
        <div className="w-full h-full relative overflow-hidden bg-black select-none rounded shadow-2xl">
          <iframe
            id="youtube-cinema-player"
            className="w-full h-full border-0 pointer-events-auto"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1&origin=${encodeURIComponent(
              window.location.origin
            )}`}
            title="LCK Cinema Screen"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Html>
    </group>
  );
};
