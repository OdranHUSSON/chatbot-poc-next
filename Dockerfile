# Use the official Node.js image as a parent image
FROM node:19

# Set the working directory in the container
WORKDIR /app

# Install git and openssh-client
RUN apt-get update && apt-get install -y git openssh-client

# Add git to known hosts
RUN mkdir -p /root/.ssh/
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY next*.json ./
COPY next.config.js ./

RUN npm install

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Copy the rest of the application to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Make our shell script executable
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
