@echo off
title LCK Cinema Watch Party Launcher
echo ===================================================
echo     🎬 KHOI DONG LCK CINEMA WATCH PARTY 🎬
echo ===================================================
echo.

echo [1/3] Dang khoi dong Backend Server (Port 3001)...
start "LCK Cinema Server" cmd /k "cd server && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Dang khoi dong Client Web 3D (Port 3000)...
start "LCK Cinema Client" cmd /k "cd client && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Dang mo trinh duyet...
start http://localhost:3000

echo.
echo ===================================================
echo  Da khoi dong xong! Chuc ban xem LCK vui ve!
echo ===================================================
pause
