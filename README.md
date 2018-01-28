# OySy Wallet

> The web-based wallet for the OySy


## Setup

  1. Install Node.js & NPM. Node.js in version 7.10.1 and 6.11.4 worked fine for the build process.
  2. Install Yarn

         npm install -g yarn

  3. Install Project Dependencies

         yarn install

Some operating systems, like Ubuntu or Debian may require further packages to be installed through a package manager:
```
apt-get install -y bzip2
```
## Development

Serve with hot reload at localhost:8080

    yarn run dev

## Building

Build for production with minification

    yarn run build

Serve the production build at localhost:7070 (e.g. for testing service workers)

    node start-server.js


## Running in production

In order to run this application in production, build it and serve the `dist` folder from a web server. Many functionalities, such as PWA support, NFC-capability etc depend on a secure context, thus a secure context would be preferred. The following functionalities require adjustments in the codebase:

* POS integration:
If you want to let the Wallet query the transaction value based on a given POS ID, implement the respective API call (HttpService.queryTransactionAmount) in `src/services/HttpService.js`.
* Automated Account creation:
If you wish to let users make account creation requests, implement the respective API call (HttpService.surpriseFunding) in `src/services/HttpService.js`. This would require an `AccTx` on the server-side to register the public key, that was generated by the Wallet.
* Communication with the OySy network:
The Wallet needs to communicate with the REST API of an [OySy client](https://github.com/mchetelat/bazo_client). Change the default URL (Store.state.settings.customURL) in `src/config/Store.js` or let users set a custom URL on the `Settings` page of the Wallet. This requires, that advanced options are enabled.
