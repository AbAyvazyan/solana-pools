#!/bin/bash

echo "🐳 Building and testing Solana Pools Docker container..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t solana-pools .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    
    # Run the container
    echo "🚀 Starting container..."
    docker run -d --name solana-pools-test -p 3000:3000 solana-pools
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        echo "🌐 Application is running at http://localhost:3000"
        echo ""
        echo "📋 Container logs:"
        docker logs solana-pools-test
        
        echo ""
        echo "🛑 To stop the container, run:"
        echo "   docker stop solana-pools-test"
        echo "   docker rm solana-pools-test"
    else
        echo "❌ Failed to start container"
        exit 1
    fi
else
    echo "❌ Failed to build Docker image"
    exit 1
fi
