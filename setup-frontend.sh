#!/bin/bash

# FitTracker Frontend Setup Script for Unix/macOS/Linux

echo "========================================"
echo "FitTracker Frontend Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js version:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo "npm should come with Node.js installation"
    exit 1
fi

echo "npm version:"
npm --version
echo ""

# Navigate to frontend directory
cd frontend

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "ERROR: package.json not found in frontend directory!"
    exit 1
fi

echo "Installing frontend dependencies..."
echo "This may take a few minutes..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo ""
echo "========================================"
echo "Dependencies installed successfully!"
echo "========================================"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo ".env.local created from .env.local.example"
    else
        echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
        echo ".env.local created with default configuration"
    fi
else
    echo ".env.local already exists"
fi

echo ""
echo "========================================"
echo "Frontend setup complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure the backend server is running (port 5000)"
echo "2. Run 'npm run dev' to start the frontend server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
