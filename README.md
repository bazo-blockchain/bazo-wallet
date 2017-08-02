# coinblesk-frontend

> Coinblesk-Frontend

## Build Setup

#### Install dependencies
    yarn install

#### Serve with hot reload at localhost:8080
    yarn run dev
    --> See Bugfix

#### Build for production with minification
    yarn run build
    --> See "Bugfix"

#### Build for production and view the bundle analyzer report
    npm_config_report=true yarn build
##### Windows `cmd`
    set npm_config_report=true
    yarn build
    set npm_config_report=false

#### Run unit tests
    yarn run unit

#### Run all tests
    yarn test

#### Recompile bitcoin.js to `src` folder
> Bitcoin.js is usually used in Node.js environments and must be compiled into a web-friendly version. The `compile-bitcoinjs.sh` installs all project (dev & normal) dependencies (including bitcoin.js in the node version) and recompiles it to a web version. This version is then stored in `src/config/library-bitcoinjs.min`. Use a linux system for this (or Cygwin for Windows).

    yarn run compile-bitcoinjs
    // OR
    bash compile-bitcoinjs.sh


## Bugfix
One library (instascan) has a critical bug in it. Building is not possible anymore. See https://github.com/schmich/instascan/issues/60
The current workaround is described in the topic: Replace all occurrences of the following code snippets with an empty string in `node_modules/instascan/src/zxing.js`:
`var fs=require("fs");` and `var nodeFS=require("fs");`
