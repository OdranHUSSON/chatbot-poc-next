# Use the official Node.js image as a parent image
FROM node:19

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY next*.json ./
COPY next.config.js ./

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Copy the rest of the application to the container
COPY . .

RUN chmod -R 777 /app
RUN npm install

# Expose port 3000 for the application
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]

# Command to run the application using Next.js's production server
CMD ["npm", "run", "dev"]
