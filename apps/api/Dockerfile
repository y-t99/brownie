# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Copy source code
COPY . .

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @brownie/api build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["node", "dist/main"]