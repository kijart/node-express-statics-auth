FROM node:8-alpine

LABEL maintainer="Luis Miguel Vicente Fuentes <kijart@gmail.com>"

WORKDIR /app

# Copy server files
COPY auth.js \
     server.js \
     package.json \
     /app/
COPY public/docs/.gitkeep /app/public/docs/.gitkeep
COPY views/ /app/views/

# Install dependencies
RUN npm install

# Up the server
ENTRYPOINT npm start
