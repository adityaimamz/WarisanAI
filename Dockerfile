# ── Stage 1: Build ──
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .

ARG VITE_NEON_AUTH_URL
ENV VITE_NEON_AUTH_URL=$VITE_NEON_AUTH_URL

RUN npm run build
    
# ── Stage 2: Production ──
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "start"]