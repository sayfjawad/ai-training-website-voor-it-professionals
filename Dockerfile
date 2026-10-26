# ── Build stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# vite build -> dist/ (static site) ; esbuild -> dist/server.cjs
RUN npm run build

# ── Runtime stage ────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3002 \
    DATA_DIR=/data
# Only production dependencies (express/nodemailer/dotenv are required at runtime)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN mkdir -p /data
EXPOSE 3002
CMD ["node", "dist/server.cjs"]
