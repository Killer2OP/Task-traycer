@echo off
echo 🚀 Setting up Task Traycer...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy env.example .env.local
    echo ✅ .env.local created from template
    echo ⚠️  Please edit .env.local with your MongoDB Atlas connection string and JWT secret
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your MongoDB Atlas credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo For detailed setup instructions, see README.md
pause
