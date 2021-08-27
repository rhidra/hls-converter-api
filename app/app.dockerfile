# Build the code
FROM mhart/alpine-node:16.4.2

# Set working directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copy source files
COPY ./ ./

# Install dependencies
RUN yarn

# Build the server
RUN yarn build

# Remove source files
RUN rm -rf ./src ./public

# Start the server
CMD ["npm", "run", "startEncoder"]
