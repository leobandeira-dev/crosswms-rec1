FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build frontend (Vite outputs to dist/public per vite.config.ts)
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy node_modules and source needed for server
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start production server (TypeScript via tsx)
CMD ["npx", "tsx", "server/production-server.ts"]