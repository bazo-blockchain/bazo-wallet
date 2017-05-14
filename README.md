# coinblesk-frontend

> Coinblesk-Frontend

## Build Setup

# install dependencies
    yarn install

# serve with hot reload at localhost:8080
    yarn run dev

# build for production with minification
    yarn run build

# build for production and view the bundle analyzer report
    npm_config_report=true yarn build
### Windows `cmd`
    set npm_config_report=true
    yarn build
    set npm_config_report=false

# run unit tests
    yarn run unit

# run all tests
    yarn test

# recompile bitcoin.js to `src` folder <sub>[linux only, windows → cygwin]</sub>
    yarn run compile-bitcoinjs
    # OR
    bash compile-bitcoinjs.sh
