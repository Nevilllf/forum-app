# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app code
COPY . .

# Expose port (same as backend PORT)
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
