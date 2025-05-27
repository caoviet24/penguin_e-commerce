# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodeuser && \
    chown -R nodeuser:nodejs /app/uploads

# Change to non-root user
USER nodeuser

# Expose port
EXPOSE 8000

# Define environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Start command
CMD ["node", "server.js"]