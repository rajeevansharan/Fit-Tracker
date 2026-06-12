@echo off
REM FitTracker Frontend Setup Script for Windows
echo ========================================
echo FitTracker Frontend Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed!
    echo npm should come with Node.js installation
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

REM Navigate to frontend directory
cd frontend

REM Check if package.json exists
if not exist package.json (
    echo ERROR: package.json not found in frontend directory!
    pause
    exit /b 1
)

echo Installing frontend dependencies...
echo This may take a few minutes...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Dependencies installed successfully!
echo ========================================
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.local.example .env.local >nul 2>nul
    if exist .env.local (
        echo .env.local created successfully!
    ) else (
        echo Creating .env.local manually...
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
    )
) else (
    echo .env.local already exists
)

echo.
echo ========================================
echo Frontend setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure the backend server is running (port 5000)
echo 2. Run 'npm run dev' to start the frontend server
echo 3. Open http://localhost:3000 in your browser
echo.
pause
