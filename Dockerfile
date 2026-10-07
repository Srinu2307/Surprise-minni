# ==============================================================================
# STAGE 1: Build the React Client Application with Vite
# ==============================================================================
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Install client dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source code and public assets
COPY client/ ./

# Build optimized production bundle
RUN npm run build

# ==============================================================================
# STAGE 2: Production Server Runner
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Install production server dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server application
COPY server/ ./server/

# Copy audio and media assets
COPY audio.mp3 ./
COPY ytmp3free.cc_anuvanuvuu-video-lyrics-om-bheem-bush-sree-vishnu-arijit-singh-harsha-konuganti-sunny-mr-youtubemp3free.org.mp3 ./
COPY ["minni pics/", "./minni pics/"]

# Copy built frontend assets from client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist
COPY client/public/ ./client/public/

# Ensure non-root node user owns application files for security
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose server port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/stats || exit 1

# Start the full-stack server
CMD ["node", "server/index.js"]
