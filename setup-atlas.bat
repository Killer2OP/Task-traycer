@echo off
REM Task Traycer - MongoDB Atlas Setup Script for Windows
REM This script helps you set up your environment for MongoDB Atlas

echo 🚀 Task Traycer - MongoDB Atlas Setup
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    copy env.example .env.local >nul
    echo ✅ .env.local created from env.example
    echo.
    echo ⚠️  IMPORTANT: You need to update .env.local with your MongoDB Atlas connection string
    echo    See MONGODB_ATLAS_SETUP.md for detailed instructions
    echo.
) else (
    echo ✅ .env.local already exists
)

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Set up MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)
echo 2. Update .env.local with your Atlas connection string
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
echo 📚 Documentation:
echo - MongoDB Atlas Setup: MONGODB_ATLAS_SETUP.md
echo - Project README: README.md
echo.
echo Happy coding! 🚀
pause
