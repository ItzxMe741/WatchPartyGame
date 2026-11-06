import React, { useState } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface CinemaSeatProps {
  id: string;
  position: [number, number, number];
  isOccupied: boolean;
  occupantName?: string;
  onSelectSeat?: (seatId: string) => void;
}

export const CinemaSeat: React.FC<CinemaSeatProps> = ({
  id,
  position,
  isOccupied,
  occupantName,
  onSelectSeat,
}) => {
  const [hovered, setHovered] = useState(false);

  // Màu ghế nệm nhung đỏ sang trọng của rạp chiếu phim
  const seatColor = isOccupied ? '#4a151b' : hovered ? '#dc2626' : '#991b1b';

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isOccupied) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOccupied && onSelectSeat) {
          onSelectSeat(id);
        }
      }}
    >
      {/* 1. Đệm ngồi (Seat Cushion) */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.65]} />
        <meshStandardMaterial
          color={seatColor}
          roughness={0.7}
          emissive={hovered && !isOccupied ? '#7f1d1d' : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 2. Tựa lưng (Backrest) */}
      <mesh position={[0, 0.85, 0.28]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.7, 0.75, 0.14]} />
        <meshStandardMaterial
          color={seatColor}
          roughness={0.7}
          emissive={hovered && !isOccupied ? '#7f1d1d' : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 3. Tay vịn bên trái */}
      <mesh position={[-0.4, 0.6, 0.05]}>
        <boxGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Giá để cốc nước bên trái */}
      <mesh position={[-0.4, 0.62, -0.2]}>
        <cylinderGeometry args={[0.045, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.8} />
      </mesh>

      {/* 4. Tay vịn bên phải */}
      <mesh position={[0.4, 0.6, 0.05]}>
        <boxGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Giá để cốc nước bên phải */}
      <mesh position={[0.4, 0.62, -0.2]}>
        <cylinderGeometry args={[0.045, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.8} />
      </mesh>

      {/* 5. Chân đế thép gắn sàn */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} />
      </mesh>

      {/* 6. Nhãn số ghế 3D */}
      <Text
        position={[0, 1.25, 0.25]}
        rotation={[-0.1, 0, 0]}
        fontSize={0.12}
        color={hovered && !isOccupied ? '#fde047' : '#e2e8f0'}
        anchorX="center"
        anchorY="middle"
      >
        {isOccupied && occupantName ? `[${occupantName}]` : id}
      </Text>
    </group>
  );
};
