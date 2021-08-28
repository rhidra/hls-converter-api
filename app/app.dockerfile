## Build
FROM mhart/alpine-node:16.4.2 as build-stage

# Set working directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copy source files
COPY ./ ./

# Install dependencies
RUN yarn install

# Build the server
RUN yarn build

# Remove source files and dev dependancies
RUN rm -rf node_modules
RUN rm -rf ./src
RUN yarn cache clean

# Install only prod dependencies
RUN yarn install --production

## Deployement

# Using a nginx server
FROM nginx:1.21.1
COPY --from=build-stage /usr/app/build /usr/share/nginx/html