export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Nếu người dùng dán trực tiếp ID (11 ký tự)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Hỗ trợ link Live Stream: https://youtube.com/live/XYZ12345678 hoặc https://www.youtube.com/live/XYZ12345678
  const liveMatch = cleanUrl.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  if (liveMatch && liveMatch[1]) {
    return liveMatch[1];
  }

  // Hỗ trợ watch?v=, youtu.be/, embed/
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
