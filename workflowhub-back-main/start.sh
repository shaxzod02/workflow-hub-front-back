#!/bin/bash

echo "🚀 Starting Workflow Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created! Please edit it with your MongoDB connection string."
fi

# Check if MongoDB is running (macOS)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't seem to be running."
    echo "   Please start MongoDB first:"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Or start MongoDB manually"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting development server..."
echo "📊 Health check: http://localhost:5000/health"
echo "🔗 API Base: http://localhost:5000/api"
echo ""

npm run dev
