@echo off
echo ========================================================
echo                 Starting ShopEZ Project
echo ========================================================
echo.
echo Make sure MongoDB is running on your system!
echo.

echo Starting Backend Server in a new window...
start "ShopEZ Backend" cmd /c "cd backend && npm start"

echo Starting Frontend Server in a new window...
start "ShopEZ Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both servers are starting up in separate windows.
echo Frontend will run on: http://localhost:5173
echo Backend will run on:  http://localhost:5000
echo.
echo To stop them, simply close the new command prompt windows.
echo ========================================================
echo.
pause
