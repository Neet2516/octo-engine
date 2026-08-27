FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
