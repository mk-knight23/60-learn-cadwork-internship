# Multi-stage build for Angular Cadwork Internship Portal
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY angular.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist/cadwork-internship /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]