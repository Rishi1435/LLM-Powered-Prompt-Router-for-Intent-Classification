# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package files
COPY package*.json ./

# Install dependencies based on package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Run the Express server when the container launches
CMD ["npm", "start"]
