import * as THREE from 'three';
import { LCK_TEAMS, TeamVariant } from '../constants/teams';

// Cache texture để không tạo lại nhiều lần nếu cùng thông số
const textureCache = new Map<string, THREE.CanvasTexture>();

export function generateJerseyTexture(
  teamId: string,
  variantId: string = 'home',
  number: number = 99,
  customName: string = 'FAKER'
): THREE.CanvasTexture {
  const cacheKey = `${teamId}_${variantId}_${number}_${customName}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const team = LCK_TEAMS[teamId] || LCK_TEAMS.t1;
  const variant: TeamVariant = team.variants[variantId] || Object.values(team.variants)[0];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    return fallbackTexture;
  }

  // --- 1. Background Pattern ---
  ctx.fillStyle = variant.primaryColor;
  ctx.fillRect(0, 0, 512, 512);

  if (variant.patternType === 'stripes') {
    ctx.fillStyle = variant.secondaryColor;
    for (let x = 0; x < 512; x += 64) {
      ctx.fillRect(x, 0, 28, 512);
    }
  } else if (variant.patternType === 'split') {
    ctx.fillStyle = variant.secondaryColor;
    ctx.fillRect(256, 0, 256, 512);
  } else if (variant.patternType === 'diagonal') {
    ctx.fillStyle = variant.secondaryColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(256, 0);
    ctx.lineTo(512, 512);
    ctx.lineTo(256, 512);
    ctx.closePath();
    ctx.fill();
  } else if (variant.patternType === 'stars') {
    // Worlds Gold edition pattern
    ctx.fillStyle = variant.secondaryColor;
    ctx.fillRect(0, 0, 512, 60);
    ctx.fillRect(0, 452, 512, 60);
  }

  // Viền cổ áo & bo tay
  ctx.strokeStyle = variant.accentColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 498, 498);

  // --- 2. FRONT SIDE (Nửa trên canvas từ y=0 đến y=256) ---
  // LCK Badge
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(30, 30, 80, 35);
  ctx.fillStyle = '#C8AA6E';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LCK', 70, 55);

  // Logo đội
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = variant.textColor;
  ctx.font = '900 64px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(team.logoText, 256, 150);
  ctx.shadowBlur = 0;

  // Stars (nếu là T1 hoặc có sao)
  if (team.starCount && team.starCount > 0) {
    ctx.fillStyle = '#FFD700';
    ctx.font = '22px sans-serif';
    const stars = '★'.repeat(team.starCount);
    ctx.fillText(stars, 256, 85);
  }

  // Vạch phân chia mặt trước và sau
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.stroke();

  // --- 3. BACK SIDE (Nửa dưới canvas từ y=256 đến y=512) ---
  // Tên in sau lưng
  ctx.fillStyle = variant.textColor;
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(customName.toUpperCase().slice(0, 12), 256, 320);

  // Số áo to bản
  ctx.font = '900 120px Impact, sans-serif';
  ctx.fillText(String(number), 256, 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.set(cacheKey, texture);
  return texture;
}
