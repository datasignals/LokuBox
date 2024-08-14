#!/bin/bash

# Check if a tag is provided as an argument
if [ -z "$1" ]; then
  echo "Provide Semantic Version"
  exit 1
fi

# Assign the first argument to the TAG variable
TAG=$1

# Build the Docker image with the provided tag
docker buildx build --platform=linux/amd64  --tag=datasignals/lokubox-frontend:$TAG --file apps/frontend/Dockerfile .
