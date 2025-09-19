# === STAGE 1: BUILDER ===
# Use a standard Node.js image to build our application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only the necessary config files to leverage Docker's layer caching
COPY package.json pnpm-lock.yaml .npmrc* ./
# The .npmrc* will copy .npmrc if it exists, but won't fail if it doesn't

# Install all dependencies using pnpm
RUN pnpm install --frozen-lockfile

# --- THIS IS THE CRITICAL FIX ---
# After installation, manually make the Vite CLI executable.
RUN chmod +x ./node_modules/.bin/vite

# Copy the rest of our application's source code
COPY . .

# Run the build script
RUN pnpm run build


# === STAGE 2: PRODUCTION SERVER ===
# Use a minimal, clean image for the final deployment
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install only the 'serve' package, which is all we need to run the app
RUN npm install -g serve

# Copy the built assets from the 'builder' stage into the current directory
COPY --from=builder /app/dist .

# Expose the port that the 'serve' command will run on
EXPOSE 3000

# The command to start the server.
# -s tells it to serve as a Single Page App.
# -l 3000 tells it to listen on all interfaces on port 3000.
CMD [ "serve", "-s", ".", "-l", "3000" ]