#!/bin/bash

# PixelMeet Local Setup Script

echo "🚀 Setting up PixelMeet locally..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! To start the development server:"
    echo "   npm run dev"
    echo ""
    echo "Then open http://localhost:5000 in your browser"
    echo "Open multiple tabs to test the video chat functionality"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
