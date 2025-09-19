# Stage 1: Build the application using pnpm for reliability
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy config files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Create the minimal production server using npm
FROM node:20-alpine
WORKDIR /app

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/dist ./dist
# Copy only the production dependencies' package.json
COPY --from=builder /app/package.json ./

# Install only the 'serve' package needed for production
RUN npm install -g serve

# Expose the port the server will run on
EXPOSE 3000

# The command to start the server, listening on all interfaces
CMD [ "serve", "-s", "dist", "-l", "3000" ]