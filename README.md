# 🎬 LCK Cinema Watch Party 3D

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FItzxMe741%2FWatchPartyGame&root-directory=client)

Một không gian rạp chiếu phim 3D ảo (Virtual 3D Cinema) dành cho người hâm mộ LCK và Esports. Cùng bạn bè vào xem YouTube / Live stream, trò chuyện, thay áo đấu các đội LCK (T1, Gen.G, HLE, DK...) và meme "Hít Oxy" khẩn cấp!

---

## 🚀 Hướng Dẫn Deploy Lên GitHub, Vercel & Cloudflare

Dự án gồm 2 phần:
- **`client/`**: React 18 + Three.js + R3F + TailwindCSS (Deploy lên **Vercel** hoặc **Cloudflare Pages**)
- **`server/`**: Node.js + Socket.io Server (Cần server persistent chạy WebSocket, deploy lên **Render / Railway** hoặc **Cloudflare Tunnel**)

---

### Bước 1: Đưa Code Lên GitHub
Mở terminal tại thư mục dự án và chạy:
```bash
git init
git add .
git commit -m "feat: complete LCK Cinema Watch Party 3D"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

---

### Bước 2: Deploy Backend Server (Render.com Miễn Phí)
1. Đăng nhập vào [Render.com](https://render.com).
2. Chọn **New Web Service** -> Kết nối tới GitHub repo vừa tạo.
3. Cài đặt các thông số:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Bấm **Create Web Service**. Sau khi hoàn tất, Render sẽ cấp cho bạn một URL backend HTTPS, ví dụ:
   `https://lck-cinema-backend.onrender.com`

---

### Bước 3: Deploy Frontend Lên Vercel
1. Đăng nhập vào [Vercel](https://vercel.com).
2. Chọn **Add New Project** -> Chọn GitHub repo của bạn.
3. Trong phần cấu hình dự án:
   - **Root Directory**: Bấm Edit và chọn thư mục `client`
   - **Environment Variables**: Thêm biến môi trường:
     - Tên: `VITE_SERVER_URL`
     - Giá trị: URL Backend ở Bước 2 (vd: `https://lck-cinema-backend.onrender.com`)
4. Bấm **Deploy**. Bạn sẽ có link web Vercel cực nhanh để gửi cho đồng đội vào xem cùng!

---

### 🌟 Cách Nhanh Nhất (Dùng Cloudflare Tunnel Miễn Phí - Đồng Đội Vào Ngay Lập Tức)
Nếu bạn đang chạy game trên máy của mình (`localhost:3000` và `localhost:3001`) và muốn bạn bè vào chơi chung ngay mà không cần thuê server:
1. Tải [Cloudflare Tunnel (cloudflared)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).
2. Mở cmd và gõ:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
3. Cloudflare sẽ tạo cho bạn một đường link HTTPS công khai (vd: `https://lck-cinema.trycloudflare.com`). Bạn chỉ việc gửi link đó cho đồng đội là tất cả có thể vào cùng phòng rạp chiếu phim ngay!
