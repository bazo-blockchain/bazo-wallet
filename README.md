# coinblesk-frontend

> The web frontend for Coinblesk

The front-end cannot be run without the [`coinblesk-server`](https://github.com/coinblesk/coinblesk-server). First, start the server, then the frontend.

## Setup

  1. Install Node.js & NPM
  2. Install Yarn
 
         npm install -g yarn

  3. Install Project Dependencies

         yarn install

## Development

Serve with hot reload at localhost:8080

    yarn run dev

## Building

Build for production with minification

    yarn run build

Serve the production build at localhost:7070 (e.g. for testing service workers)

    node start-server.js
