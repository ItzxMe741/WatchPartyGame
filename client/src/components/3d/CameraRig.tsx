import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface CameraRigProps {
  seatPosition: [number, number, number] | null;
}

export const CameraRig: React.FC<CameraRigProps> = ({ seatPosition }) => {
  const { camera } = useThree();

  // Đặt góc nhìn cố định chuẩn Rạp Chiếu Phim: Nhìn từ dưới lên màn hình khổng lồ
  useEffect(() => {
    // Màn hình rạp ở [0, 4.5, -9]
    // Vị trí camera cố định hoàn hảo: Ở hàng ghế khán giả [0, 2.2, 4.2], ngước lên màn hình
    if (seatPosition) {
      // Nếu người chơi chọn 1 ghế cụ thể: Camera đặt ngay tầm mắt ghế đó ngước lên màn hình
      camera.position.set(seatPosition[0], seatPosition[1] + 1.1, seatPosition[2] - 0.1);
    } else {
      // Góc nhìn khán phòng chuẩn trung tâm
      camera.position.set(0, 2.2, 4.2);
    }
    camera.lookAt(0, 4.8, -9);
    camera.updateProjectionMatrix();
  }, [seatPosition, camera]);

  useFrame(() => {
    // Luôn giữ camera cố định hướng về tâm màn hình lớn, không bị lệch
    if (seatPosition) {
      camera.position.set(seatPosition[0], seatPosition[1] + 1.1, seatPosition[2] - 0.1);
    } else {
      camera.position.set(0, 2.2, 4.2);
    }
    camera.lookAt(0, 4.8, -9);
  });

  return null;
};
