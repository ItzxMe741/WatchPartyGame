import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CinemaSeat } from './CinemaSeat';
import { CinemaScreen } from './CinemaScreen';

interface CinemaRoomProps {
  videoId: string;
  isPlaying: boolean;
  takenSeats: Record<string, string>; // seatId -> playerId
  playerNames: Record<string, string>; // playerId -> playerName
  onSelectSeat: (seatId: string) => void;
}

export const CinemaRoom: React.FC<CinemaRoomProps> = ({
  videoId,
  isPlaying,
  takenSeats,
  playerNames,
  onSelectSeat,
}) => {
  // Tạo danh sách ghế theo bậc thang
  // 4 hàng (A, B, C, D). Mỗi hàng chia 2 dãy: Cánh Trái (ghế 1..3), Cánh Phải (ghế 4..6), ở giữa là lối đi
  const seatLayout = useMemo(() => {
    const rows = [
      { name: 'A', z: -2.0, y: 0.0 },
      { name: 'B', z: 0.8, y: 0.6 },
      { name: 'C', z: 3.6, y: 1.2 },
      { name: 'D', z: 6.4, y: 1.8 },
    ];

    const seats: Array<{ id: string; position: [number, number, number] }> = [];

    rows.forEach((row) => {
      // Dãy trái: x = -4.2, -3.1, -2.0
      [-4.2, -3.1, -2.0].forEach((x, idx) => {
        seats.push({
          id: `${row.name}${idx + 1}`,
          position: [x, row.y, row.z],
        });
      });

      // Dãy phải: x = 2.0, 3.1, 4.2
      [2.0, 3.1, 4.2].forEach((x, idx) => {
        seats.push({
          id: `${row.name}${idx + 4}`,
          position: [x, row.y, row.z],
        });
      });
    });

    return seats;
  }, []);

  return (
    <group>
      {/* 1. Màn hình khổng lồ Cinema */}
      <CinemaScreen videoId={videoId} isPlaying={isPlaying} />

      {/* 2. Ánh sáng khán phòng (Cinema Lighting) */}
      <ambientLight intensity={0.25} />
      {/* Đèn downlight trung tâm */}
      <spotLight
        position={[0, 10, 0]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.8}
        color="#fff1d0"
        castShadow
      />
      {/* Đèn chiếu sáng bậc thang / lối đi hai bên */}
      <pointLight position={[-6, 3, 0]} intensity={0.6} color="#e0b042" distance={8} />
      <pointLight position={[6, 3, 0]} intensity={0.6} color="#e0b042" distance={8} />
      <pointLight position={[-6, 4, 6]} intensity={0.6} color="#e0b042" distance={8} />
      <pointLight position={[6, 4, 6]} intensity={0.6} color="#e0b042" distance={8} />

      {/* 3. Bậc thang sàn rạp (Tiered Floor Steps) */}
      {/* Sân khấu phía trước màn hình */}
      <mesh position={[0, -0.2, -6.5]} receiveShadow>
        <boxGeometry args={[16, 0.4, 4.5]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.9} />
      </mesh>

      {/* Tầng 1 (Hàng A): y=0 */}
      <mesh position={[0, -0.2, -2.0]} receiveShadow>
        <boxGeometry args={[16, 0.4, 3.0]} />
        <meshStandardMaterial color="#13151b" roughness={0.85} />
      </mesh>

      {/* Tầng 2 (Hàng B): y=0.6 */}
      <mesh position={[0, 0.1, 0.8]} receiveShadow>
        <boxGeometry args={[16, 0.6, 2.8]} />
        <meshStandardMaterial color="#101217" roughness={0.85} />
      </mesh>

      {/* Tầng 3 (Hàng C): y=1.2 */}
      <mesh position={[0, 0.4, 3.6]} receiveShadow>
        <boxGeometry args={[16, 0.6, 2.8]} />
        <meshStandardMaterial color="#13151b" roughness={0.85} />
      </mesh>

      {/* Tầng 4 (Hàng D + Lối đi sau): y=1.8 */}
      <mesh position={[0, 0.7, 7.5]} receiveShadow>
        <boxGeometry args={[16, 0.6, 5.0]} />
        <meshStandardMaterial color="#101217" roughness={0.85} />
      </mesh>

      {/* Thảm đỏ lối đi giữa rạp (Aisle Carpet) */}
      <mesh position={[0, 0.01, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 17]} />
        <meshStandardMaterial color="#501016" roughness={0.95} />
      </mesh>

      {/* Dải đèn LED dẫn đường bậc thang (Aisle Step Light Strips) */}
      <mesh position={[-0.85, 0.32, -0.6]}>
        <boxGeometry args={[0.08, 0.08, 0.2]} />
        <meshBasicMaterial color="#e0b042" />
      </mesh>
      <mesh position={[0.85, 0.32, -0.6]}>
        <boxGeometry args={[0.08, 0.08, 0.2]} />
        <meshBasicMaterial color="#e0b042" />
      </mesh>

      <mesh position={[-0.85, 0.62, 2.2]}>
        <boxGeometry args={[0.08, 0.08, 0.2]} />
        <meshBasicMaterial color="#e0b042" />
      </mesh>
      <mesh position={[0.85, 0.62, 2.2]}>
        <boxGeometry args={[0.08, 0.08, 0.2]} />
        <meshBasicMaterial color="#e0b042" />
      </mesh>

      {/* 4. Tường rạp chiếu phim (Acoustic Walls) */}
      {/* Tường Trái */}
      <mesh position={[-8, 4.5, 0]}>
        <boxGeometry args={[0.4, 10, 20]} />
        <meshStandardMaterial color="#111318" roughness={0.9} />
      </mesh>
      {/* Các tấm ốp tiêu âm trang trí tường trái (Acoustic panels) */}
      {[-4, -1, 2, 5].map((zPos, i) => (
        <group key={`panel-l-${i}`} position={[-7.75, 4.5, zPos]}>
          <mesh>
            <boxGeometry args={[0.1, 4.5, 1.8]} />
            <meshStandardMaterial color="#1c202a" roughness={0.7} />
          </mesh>
          {/* Đèn LED viền tấm ốp */}
          <mesh position={[0.06, 0, 0]}>
            <boxGeometry args={[0.02, 4.3, 0.05]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        </group>
      ))}

      {/* Tường Phải */}
      <mesh position={[8, 4.5, 0]}>
        <boxGeometry args={[0.4, 10, 20]} />
        <meshStandardMaterial color="#111318" roughness={0.9} />
      </mesh>
      {/* Các tấm ốp tiêu âm trang trí tường phải */}
      {[-4, -1, 2, 5].map((zPos, i) => (
        <group key={`panel-r-${i}`} position={[7.75, 4.5, zPos]}>
          <mesh>
            <boxGeometry args={[0.1, 4.5, 1.8]} />
            <meshStandardMaterial color="#1c202a" roughness={0.7} />
          </mesh>
          <mesh position={[-0.06, 0, 0]}>
            <boxGeometry args={[0.02, 4.3, 0.05]} />
            <meshBasicMaterial color="#e4002b" />
          </mesh>
        </group>
      ))}

      {/* Tường Sau (Back Wall) */}
      <mesh position={[0, 5, 10]}>
        <boxGeometry args={[16.4, 11, 0.4]} />
        <meshStandardMaterial color="#0d0f14" roughness={0.9} />
      </mesh>
      {/* Biển Báo EXIT Phát Sáng Xanh Lá */}
      <group position={[6.5, 3.2, 9.7]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 0.1]} />
          <meshStandardMaterial color="#005a20" emissive="#00e540" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Trần Rạp (Ceiling) */}
      <mesh position={[0, 9.5, 0]}>
        <boxGeometry args={[16.4, 0.4, 20]} />
        <meshStandardMaterial color="#08090c" roughness={0.95} />
      </mesh>

      {/* 5. Render toàn bộ ghế ngồi trong rạp */}
      {seatLayout.map((seat) => {
        const occupantId = takenSeats[seat.id];
        const occupantName = occupantId ? playerNames[occupantId] : undefined;

        return (
          <CinemaSeat
            key={seat.id}
            id={seat.id}
            position={seat.position}
            isOccupied={!!occupantId}
            occupantName={occupantName}
            onSelectSeat={onSelectSeat}
          />
        );
      })}
    </group>
  );
};
