# --- Build stage ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Build tools for the better-sqlite3 native module.
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
# NEXT_PUBLIC_* vars are inlined at build time — pass them as build args if used.
RUN npm run build

# --- Runtime stage ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy the built app + installed deps.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# The SQLite database lives here — mount a volume at /app/data to persist it.
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000
CMD ["node_modules/next/dist/bin/next", "start"]
