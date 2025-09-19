# === STAGE 1: BUILDER ===
# Use a standard Node.js image to build our application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# --- THIS IS THE ENVIRONMENT VARIABLE FIX ---
# 1. Declare a build argument. Railway will automatically find the
#    VITE_API_BASE_URL environment variable from your service and pass it
#    to this build argument.
ARG VITE_API_BASE_URL

# 2. Set this build argument as an environment variable that is available
#    *during the build process*.
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# --- END OF FIX ---

# Install pnpm globally
RUN npm install -g pnpm

# Copy only the necessary config files to leverage Docker's layer caching
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install all dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of our application's source code
COPY . .

# --- THIS IS THE PERMISSION FIX ---
# Manually make the vite CLI executable before trying to run it.
RUN chmod +x ./node_modules/.bin/vite

# Now, run the build script. It will now have access to the environment
# variable AND the correct permissions. This will succeed.
RUN pnpm run build


# === STAGE 2: PRODUCTION SERVER ===
# Use a minimal, clean image for the final deployment
FROM node:20-alpine

WORKDIR /app

# Install only the 'serve' package, which is all we need to run the app
RUN npm install -g serve

# Copy the built assets from the 'builder' stage into the current directory
COPY --from=builder /app/dist .

# Expose the port that the 'serve' command will run on
EXPOSE 3000

# The command to start the server.
CMD [ "serve", "-s", ".", "-l", "3000" ]