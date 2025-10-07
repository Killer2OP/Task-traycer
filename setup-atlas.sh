#!/bin/bash

# Task Traycer - MongoDB Atlas Setup Script
# This script helps you set up your environment for MongoDB Atlas

echo "🚀 Task Traycer - MongoDB Atlas Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created from env.example"
    echo ""
    echo "⚠️  IMPORTANT: You need to update .env.local with your MongoDB Atlas connection string"
    echo "   See MONGODB_ATLAS_SETUP.md for detailed instructions"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)"
echo "2. Update .env.local with your Atlas connection string"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "- MongoDB Atlas Setup: MONGODB_ATLAS_SETUP.md"
echo "- Project README: README.md"
echo ""
echo "Happy coding! 🚀"
