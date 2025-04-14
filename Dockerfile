# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY rollup.config.js ./
COPY src ./src

RUN npm install
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist/index.min.js ./dist/

# Set NODE_ENV
ENV NODE_ENV=production

CMD ["node", "dist/index.min.js"] 