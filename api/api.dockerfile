# Build the code
FROM mhart/alpine-node:16.4.2

# Set working directory
RUN mkdir -p /usr/api
WORKDIR /usr/api

# Copy source files
COPY ./ ./

# Install dependencies
RUN npm install

# Build the server
RUN npm run build

# Remove source files
RUN rm -rf ./src

# Start the server
CMD ["npm", "start"]
