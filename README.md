# Statics files protected with Google OAuth2

Small server written in _node_ that serves static files protected with Google OAuth2 authentication

## Setup

1. Create a project and OAuth 2.0 client id and secret at https://console.developers.google.com
1. Create a `.env` file with the needed information (take `.env.example` as reference)
1. Install project dependencies with `npm install`

## Usage

- Add static files inside `public/docs/`
- Start production server: `npm start`
- Start development server: `npm start:dev`

## Features

- **Authentication** implemented for **Google** strategy
- Static files inside `public/docs/` are **protected** by login
- The content of the directory `public/docs/` is **listed dynamically**
- **handlebars.js** template engine implemented (`views/`)

## Docker

Run the project with Docker:

```
docker run -it --rm \
    -p 3000:3000 \
    -v $(pwd)/.env:/app/.env \
    -v $(pwd)/public/docs:/app/public/docs \
    -v $(pwd)/views:/app/views \
    node-express-statics-auth
```

### Parameters

- -p 3000 - the port of the server
- -v /app/.env - loads environment variables from .env
- -v /app/public/docs - the directory where the files will be accessible after users authentication (optional)
- -v /app/views - dynamic view of the server powered by handlebars.js (optional)

## Docker and nginx proxy

Alternatively, Docker can be used to, for example, secure the connection with a certificate through a _nginx reverse proxy_. See docker-compose.yml
