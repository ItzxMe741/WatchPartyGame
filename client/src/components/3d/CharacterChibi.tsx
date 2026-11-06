import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { generateJerseyTexture } from '../../utils/jerseyTexture';
import { OxygenTankProp } from './OxygenTankProp';
import { LCK_TEAMS } from '../../constants/teams';

interface CharacterChibiProps {
  name: string;
  teamId: string;
  jerseyVariant?: string;
  jerseyNumber?: number;
  customName?: string;
  animation?: string; // 'idle' | 'walk' | 'sit' | 'cheer' | 'oxygen'
  isUsingOxygen?: boolean;
  isCurrentPlayer?: boolean;
  hideHead?: boolean; // Ẩn đầu khi ngồi xem phim để không che màn hình
}

export const CharacterChibi: React.FC<CharacterChibiProps> = ({
  name,
  teamId = 't1',
  jerseyVariant = 'home',
  jerseyNumber = 99,
  customName,
  animation = 'idle',
  isUsingOxygen = false,
  isCurrentPlayer = false,
  hideHead = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const team = LCK_TEAMS[teamId] || LCK_TEAMS.t1;

  // Tạo texture áo đấu LCK
  const jerseyTexture = useMemo(() => {
    return generateJerseyTexture(
      teamId,
      jerseyVariant,
      jerseyNumber,
      customName || name
    );
  }, [teamId, jerseyVariant, jerseyNumber, customName, name]);

  // Game loop animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (animation === 'walk') {
      // Đi bộ: vung chân tay so le
      const walkSpeed = 10;
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t * walkSpeed) * 0.6;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(t * walkSpeed) * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.6;
      if (headRef.current) headRef.current.position.y = 0.95 + Math.abs(Math.sin(t * walkSpeed)) * 0.05;
    } else if (animation === 'sit') {
      // Ngồi trên ghế
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        leftLegRef.current.position.y = 0.45;
        leftLegRef.current.position.z = 0.2;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.position.y = 0.45;
        rightLegRef.current.position.z = 0.2;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (headRef.current) headRef.current.position.y = 0.95;
    } else if (animation === 'cheer') {
      // Ăn mừng: 2 tay giơ cao, nhún nhảy
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.PI - 0.2;
        leftArmRef.current.rotation.z = Math.sin(t * 8) * 0.3 + 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.PI - 0.2;
        rightArmRef.current.rotation.z = -Math.sin(t * 8) * 0.3 - 0.3;
      }
      if (headRef.current) {
        headRef.current.position.y = 0.95 + Math.abs(Math.sin(t * 8)) * 0.1;
      }
    } else if (animation === 'oxygen' || isUsingOxygen) {
      // Meme Hít Oxy: 2 tay đưa về phía trước đỡ bình oxy lên mặt
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.2;
        leftArmRef.current.rotation.z = 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2;
        rightArmRef.current.rotation.z = -0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.15 + Math.sin(t * 4) * 0.08;
      }
    } else {
      // Idle nhún nhảy nhẹ
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.08;
        leftArmRef.current.rotation.z = 0.1;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.08;
        rightArmRef.current.rotation.z = -0.1;
      }
      if (headRef.current) headRef.current.position.y = 0.95 + Math.sin(t * 3) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Nametag 3D trên đầu */}
      <group position={[0, 1.85, 0]}>
        <Text
          fontSize={0.16}
          color={isCurrentPlayer ? '#38bdf8' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`${name} #${jerseyNumber}`}
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.1}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {`[${team.shortName}] ${team.badgeEmoji}`}
        </Text>
      </group>

      {/* 2. ĐẦU CHIBI (Big Cute Head) */}
      {!hideHead && (
        <group ref={headRef} position={[0, 0.95, 0]}>
          {/* Khuôn mặt Chibi tròn dễ thương */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#ffe4cc" roughness={0.6} />
          </mesh>

          {/* Mắt to tròn kiểu Chibi Anime */}
          {/* Mắt trái */}
          <mesh position={[-0.12, 0.02, 0.31]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#1a1a24" />
          </mesh>
          {/* Đốm sáng trong mắt trái */}
          <mesh position={[-0.11, 0.04, 0.34]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Mắt phải */}
          <mesh position={[0.12, 0.02, 0.31]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#1a1a24" />
          </mesh>
          {/* Đốm sáng trong mắt phải */}
          <mesh position={[0.13, 0.04, 0.34]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Má hồng dễ thương */}
          <mesh position={[-0.18, -0.06, 0.28]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ff9999" opacity={0.6} transparent />
          </mesh>
          <mesh position={[0.18, -0.06, 0.28]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ff9999" opacity={0.6} transparent />
          </mesh>

          {/* Tóc phong cách tuyển thủ LCK */}
          <group position={[0, 0.12, -0.04]}>
            <mesh>
              <sphereGeometry args={[0.35, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color="#2d221e" roughness={0.8} />
            </mesh>
            {/* Mái tóc phủ trước trán */}
            <mesh position={[0, 0.14, 0.28]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.32, 0.1, 0.12]} />
              <meshStandardMaterial color="#2d221e" roughness={0.8} />
            </mesh>
          </group>

          {/* Tai nghe Gaming Headset */}
          <group position={[0, 0, 0]}>
            {/* Cầu nối headband */}
            <mesh position={[0, 0.33, 0]}>
              <torusGeometry args={[0.36, 0.03, 12, 32, Math.PI]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>
            {/* Ốp tai trái */}
            <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
              <meshStandardMaterial color={team.variants[jerseyVariant]?.secondaryColor || '#e4002b'} />
            </mesh>
            {/* Ốp tai phải */}
            <mesh position={[0.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
              <meshStandardMaterial color={team.variants[jerseyVariant]?.secondaryColor || '#e4002b'} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. THÂN & ÁO ĐẤU LCK (Torso with Jersey Texture) */}
      <group position={[0, 0.52, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.45, 0.28]} />
          <meshStandardMaterial map={jerseyTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* 4. TAY TRÁI (Left Arm) */}
      <group ref={leftArmRef} position={[-0.26, 0.68, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.32, 12]} />
          <meshStandardMaterial color={team.variants[jerseyVariant]?.primaryColor || '#1e293b'} />
        </mesh>
        {/* Bàn tay tròn mũm mĩm */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#ffe4cc" />
        </mesh>
      </group>

      {/* 5. TAY PHẢI (Right Arm) */}
      <group ref={rightArmRef} position={[0.26, 0.68, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.32, 12]} />
          <meshStandardMaterial color={team.variants[jerseyVariant]?.primaryColor || '#1e293b'} />
        </mesh>
        {/* Bàn tay tròn mũm mĩm */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#ffe4cc" />
        </mesh>
      </group>

      {/* 6. CHÂN TRÁI & GIÀY (Left Leg) */}
      <group ref={leftLegRef} position={[-0.12, 0.3, 0]}>
        {/* Quần ngắn / đùi */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.24, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Giày thể thao Sneaker */}
        <mesh position={[0, -0.26, 0.04]}>
          <boxGeometry args={[0.12, 0.09, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 7. CHÂN PHẢI & GIÀY (Right Leg) */}
      <group ref={rightLegRef} position={[0.12, 0.3, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.24, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, -0.26, 0.04]}>
          <boxGeometry args={[0.12, 0.09, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 8. BÌNH OXY MEME (Đeo sau lưng hoặc đưa lên mặt hít) */}
      <OxygenTankProp isActive={isUsingOxygen || animation === 'oxygen'} />
    </group>
  );
};
