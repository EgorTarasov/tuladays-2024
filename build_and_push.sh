#!/bin/bash

# Set variables
GITHUB_USERNAME="egortarasov"
GITHUB_REPO="tuladays-2024"
BACKEND_IMAGE="backend"
TELEGRAM_IMAGE="telegram"
TAG="latest"

# Build backend image
echo "Building backend image..."
docker build -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPO/$BACKEND_IMAGE:$TAG -f ./backend/Dockerfile.backend ./backend

# Build telegram image
echo "Building telegram image..."
docker build -t ghcr.io/$GITHUB_USERNAME/$GITHUB_REPO/$TELEGRAM_IMAGE:$TAG -f ./bot/Dockerfile.telegram ./bot

# Push backend image
echo "Pushing backend image to GitHub Container Registry..."
docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPO/$BACKEND_IMAGE:$TAG

# Push telegram image
echo "Pushing telegram image to GitHub Container Registry..."
docker push ghcr.io/$GITHUB_USERNAME/$GITHUB_REPO/$TELEGRAM_IMAGE:$TAG

echo "Done!"