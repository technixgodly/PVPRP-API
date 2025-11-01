# Use Node 24 LTS Alpine
FROM node:24-alpine
WORKDIR /usr/src/app
# Install dependencies
COPY package*.json ./
RUN npm ci --only=production
# Copy source code
COPY . .
# Expose port
EXPOSE 3000
# Start server
CMD ["npm", "start"]
