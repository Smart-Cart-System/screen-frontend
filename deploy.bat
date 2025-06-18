@echo off
echo Deploying Cart Frontend...

echo Stopping existing container...
docker-compose down

echo Building and starting container...
docker-compose up -d --build

echo Checking container status...
docker-compose ps

echo Deployment complete! Frontend available at http://localhost:3001
echo Your nginx proxy should forward cart.duckycart.me to this container.
