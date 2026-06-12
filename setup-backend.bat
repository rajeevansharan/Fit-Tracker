@echo off
echo ===============================================
echo   FitTracker Pro - Backend Setup Script
echo ===============================================
echo.

cd backend

echo [1/4] Installing backend dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
) else (
    echo .env file already exists. Skipping...
)

echo.
echo [3/4] Backend setup complete!
echo.
echo ===============================================
echo   Next Steps:
echo ===============================================
echo 1. Edit backend\.env with your configuration
echo 2. Make sure MongoDB is running
echo 3. Run: cd backend ^& npm run seed
echo 4. Run: cd backend ^& npm run dev
echo.
echo Then in a new terminal:
echo 5. Run: npm install (from root directory)
echo 6. Run: npm run dev
echo.
echo Access the app at http://localhost:3000
echo ===============================================

pause
