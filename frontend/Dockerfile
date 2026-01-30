# === STAGE 1: BUILDER ===
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN chmod +x ./node_modules/.bin/vite
RUN pnpm run build

# === STAGE 2: PRODUCTION SERVER ===
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist .
EXPOSE 3000
CMD [ "serve", "-s", ".", "-l", "3000" ]