@echo off
REM FitTracker Complete Setup Script for Windows

echo ========================================
echo FitTracker Complete Setup
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

REM Check if MongoDB is running
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB does not appear to be installed!
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo.
)

echo ========================================
echo Setting up Backend...
echo ========================================
echo.

REM Setup Backend
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)

REM Create .env if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env >nul 2>nul
    if exist .env (
        echo .env created from .env.example
        echo IMPORTANT: Please update JWT_SECRET in backend\.env before production!
    )
) else (
    echo .env already exists
)

echo.
echo Backend setup complete!
echo.

cd ..

echo ========================================
echo Setting up Frontend...
echo ========================================
echo.

REM Setup Frontend
cd frontend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.local.example .env.local >nul 2>nul
    if exist .env.local (
        echo .env.local created from .env.local.example
    ) else (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
        echo .env.local created with default configuration
    )
) else (
    echo .env.local already exists
)

echo.
echo Frontend setup complete!
echo.

cd ..

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Make sure MongoDB is running:
echo    mongod
echo.
echo 2. Seed the database (optional but recommended):
echo    cd backend
echo    npm run seed
echo.
echo 3. Start the backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 4. Start the frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:3000 in your browser
echo.
echo For detailed instructions, see SETUP.md
echo.
pause
