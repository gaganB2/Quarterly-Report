# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy pnpm-lock.yaml, package.json, and .npmrc
COPY pnpm-lock.yaml package.json .npmrc ./

# Install dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Create the production server
FROM node:20-alpine

WORKDIR /app

# Install the 'serve' package globally
RUN npm install -g pnpm && pnpm add -g serve

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Expose the port the server will run on
EXPOSE 3000

# The command to start the server
# This listens on all interfaces, on the specified port
CMD [ "serve", "-s", "dist", "-l", "3000" ]