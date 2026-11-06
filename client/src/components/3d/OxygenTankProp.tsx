import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface OxygenTankPropProps {
  isActive: boolean; // Có đang hít không
}

export const OxygenTankProp: React.FC<OxygenTankPropProps> = ({ isActive }) => {
  const bubblesRef = useRef<THREE.Group>(null);

  // Hiệu ứng bong bóng/hơi sương oxy xịt ra khi hít
  useFrame((state, delta) => {
    if (bubblesRef.current && isActive) {
      bubblesRef.current.children.forEach((bubble, idx) => {
        bubble.position.y += delta * 1.5;
        bubble.scale.multiplyScalar(0.98);
        if (bubble.position.y > 1.2) {
          bubble.position.y = 0.1;
          bubble.position.x = (Math.random() - 0.5) * 0.3;
          bubble.position.z = (Math.random() - 0.5) * 0.3;
          bubble.scale.set(1, 1, 1);
        }
      });
    }
  });

  return (
    <group position={isActive ? [0, 0.45, -0.35] : [0, 0.4, 0.28]}>
      {/* Thân bình oxy y tế màu xanh/trắng */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Đỉnh bình & van điều áp */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.088, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
      </mesh>

      {/* Đồng hồ đo áp suất (Pressure Gauge) */}
      <mesh position={[0.08, 0.28, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Dây dẫn khí */}
      <mesh position={[0, 0.2, -0.08]}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0.12, 0),
              new THREE.Vector3(0, 0.1, -0.1),
              new THREE.Vector3(0, -0.05, -0.15),
            ]),
            12,
            0.012,
            8,
            false,
          ]}
        />
        <meshStandardMaterial color="#ffffff" roughness={0.5} opacity={0.8} transparent />
      </mesh>

      {/* Hiệu ứng khói/hơi sương Oxy phun trào khi hít */}
      {isActive && (
        <group ref={bubblesRef} position={[0, 0.35, -0.15]}>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[(i % 2 === 0 ? 1 : -1) * 0.06, i * 0.15, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#a5f3fc" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
