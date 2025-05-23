#!/bin/bash

IMAGE_TAG="graphrunnerds"
NETWORK_NAME="graphrunnerds-net"

# Create a custom network if it doesn't exist
docker network inspect $NETWORK_NAME >/dev/null 2>&1 || \
  docker network create $NETWORK_NAME

# Optional: Build image if not already built
echo "🔧 Building Docker image '$IMAGE_TAG'..."
docker build -t $IMAGE_TAG .

# Loop to start 10 agents
for i in {1..10}
do
  TEMPLATE_ID=$(printf "%02d" $i)
  CONTAINER_NAME="graphrunner-ds-$TEMPLATE_ID"

  echo "🚀 Starting $CONTAINER_NAME with template $TEMPLATE_ID..."

  docker run -d \
    --name "$CONTAINER_NAME" \
    --network $NETWORK_NAME \
    -e TEMPLATE_ID=$TEMPLATE_ID \
    -e GRAPH_RUNNER_URL=http://host.docker.internal:3030/ingest \
    -e SEND_INTERVAL_MS=1000 \
    $IMAGE_TAG
done

echo "✅ All agents launched in network '$NETWORK_NAME'."

echo "🔍 Press Enter to close..."
read
