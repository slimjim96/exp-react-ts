# Use Node 20 LTS Alpine for smaller image size
FROM node:20-alpine

ENV PROJECT_NAME="exp-react-webapp"
ENV NODE_ENV=production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code and configs
COPY . .

# Build frontend with Vite
RUN npm run build

# Build backend
RUN npm run build:backend

# Expose port (corrected from 3000 to 3002)
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "exp-react-svc/index.js"]
