#!/bin/bash

# Configuration
IMAGE_NAME="card-game-bot"
CONTAINER_NAME="card-game-bot-dev"
PORT=8080

echo "🚀 Starting Bot Development Environment..."

# 1. Build the image (this also runs unit tests due to Dockerfile)
echo "📦 Building Docker image: $IMAGE_NAME..."
if ! docker build -t $IMAGE_NAME .; then
    echo "❌ Build failed! Please check your code and unit tests."
    exit 1
fi

# 2. Stop and remove existing container if it's running
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing existing container: $CONTAINER_NAME..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1
    docker rm $CONTAINER_NAME > /dev/null 2>&1
fi

# 3. Run the new container
echo "🏃 Running container: $CONTAINER_NAME on port $PORT..."
# Using --network host for easiest local development (as specified in POC)
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    --network host \
    $IMAGE_NAME

echo "✅ Bot is now running at http://localhost:$PORT"
echo "📜 Tailing logs (Ctrl+C to stop, bot will keep running in background)..."
docker logs -f $CONTAINER_NAME
