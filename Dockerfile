# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html  
CMD ["nginx", "-g", "daemon off;"]
