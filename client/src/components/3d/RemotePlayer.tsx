import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterChibi } from './CharacterChibi';

interface RemotePlayerProps {
  id: string;
  name: string;
  transform: {
    x: number;
    y: number;
    z: number;
    rotationY: number;
  };
  animation: string;
  teamId: string;
  jerseyVariant: string;
  jerseyNumber: number;
  customName: string;
  isUsingOxygen: boolean;
}

export const RemotePlayer: React.FC<RemotePlayerProps> = ({
  name,
  transform,
  animation,
  teamId,
  jerseyVariant,
  jerseyNumber,
  customName,
  isUsingOxygen,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth lerp vị trí và góc xoay
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerpFactor = Math.min(1, delta * 14);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      transform.x,
      lerpFactor
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      transform.y,
      lerpFactor
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      transform.z,
      lerpFactor
    );

    // Lerp góc xoay
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      transform.rotationY,
      lerpFactor
    );
  });

  return (
    <group ref={groupRef} position={[transform.x, transform.y, transform.z]}>
      <CharacterChibi
        name={name}
        teamId={teamId}
        jerseyVariant={jerseyVariant}
        jerseyNumber={jerseyNumber}
        customName={customName}
        animation={animation}
        isUsingOxygen={isUsingOxygen}
        isCurrentPlayer={false}
      />
    </group>
  );
};
