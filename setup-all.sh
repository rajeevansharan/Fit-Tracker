#!/bin/bash

# FitTracker Complete Setup Script for Unix/macOS/Linux

echo "========================================"
echo "FitTracker Complete Setup"
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

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB does not appear to be installed!"
    echo "Please install MongoDB from https://www.mongodb.com/try/download/community"
    echo ""
fi

echo "========================================"
echo "Setting up Backend..."
echo "========================================"
echo ""

# Setup Backend
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ".env created from .env.example"
        echo "IMPORTANT: Please update JWT_SECRET in backend/.env before production!"
    fi
else
    echo ".env already exists"
fi

echo ""
echo "Backend setup complete!"
echo ""

cd ..

echo "========================================"
echo "Setting up Frontend..."
echo "========================================"
echo ""

# Setup Frontend
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    exit 1
fi

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
echo "Frontend setup complete!"
echo ""

cd ..

echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   mongod"
echo ""
echo "2. Seed the database (optional but recommended):"
echo "   cd backend && npm run seed"
echo ""
echo "3. Start the backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
