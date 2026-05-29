@echo off
title GreenField Arena - Launcher
color 0A
setlocal

echo.
echo  ============================================
echo   GREENFIELD ARENA  -  Turf Booking System
echo  ============================================
echo.

:: Set root to the folder where this .bat file lives
set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend

:: Kill anything already on port 3001 or 5173
echo  Freeing ports...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3001 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":5173 "') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Start Backend in a minimized window
echo  [1/2] Starting Backend on port 3001...
start "GF-Backend" /min cmd /k "cd /d "%BACKEND%" && node server.js"

:: Give backend time to boot
ping -n 3 127.0.0.1 >nul

:: Start Frontend in a minimized window
echo  [2/2] Starting Frontend on port 5173...
start "GF-Frontend" /min cmd /k "cd /d "%FRONTEND%" && npm run dev -- --port 5173 --host 0.0.0.0"

:: Give Vite time to compile
echo  Waiting for Vite to compile...
ping -n 6 127.0.0.1 >nul

:: Open in Chrome (try common install paths)
echo  Opening in Chrome...
set CHROME_1=%ProgramFiles%\Google\Chrome\Application\chrome.exe
set CHROME_2=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
set CHROME_3=%LocalAppData%\Google\Chrome\Application\chrome.exe

if exist "%CHROME_1%" (
    start "" "%CHROME_1%" --new-window "http://127.0.0.1:5173"
    goto :opened
)
if exist "%CHROME_2%" (
    start "" "%CHROME_2%" --new-window "http://127.0.0.1:5173"
    goto :opened
)
if exist "%CHROME_3%" (
    start "" "%CHROME_3%" --new-window "http://127.0.0.1:5173"
    goto :opened
)

:: Fallback to default browser
start "" "http://127.0.0.1:5173"

:opened
echo.
echo  ============================================
echo   App is live!
echo.
echo   Home     :  http://127.0.0.1:5173
echo   Booking  :  http://127.0.0.1:5173/booking
echo   Admin    :  http://127.0.0.1:5173/admin
echo   API      :  http://127.0.0.1:3001
echo  ============================================
echo.
echo  Keep this window open while using the app.
echo  Press any key here to STOP all servers.
echo.
pause >nul

:: Cleanup on exit
echo  Shutting down...
taskkill /FI "WINDOWTITLE eq GF-Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq GF-Frontend" /F >nul 2>&1
echo  Servers stopped. Goodbye!
endlocal
