# Statics files protected with Google OAuth2

Small server written in _node_ that serves static files protected with Google OAuth2 authentication

## Setup

1. Create a project and OAuth 2.0 client id and secret at https://console.developers.google.com
1. Create a `.env` file with the needed information (take `.env.example` as reference)
1. Install project dependencies with `npm install`

## Usage

- Add static files inside `/public/docs/`
- Start production server: `npm start`
- Start development server: `npm start:dev`

## Features

- **Authentication** implemented for **Google** strategy
- Static files inside `/public/docs/` are **protected** by login
- The content of the directory `/public/docs/` is **listed dynamically**
- **handlebars.js** template engine implemented
