# Use official Node.js Alpine image for a lightweight container
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Run unit tests to ensure bot logic is sound before building the image
RUN npm test

# Expose the default port
EXPOSE 8080

# Use non-root user for security
USER node

# Start the application
CMD [ "npm", "start" ]
