import Bitcoin from 'coinblesk-frontend-bitcoinjs';

// possible entries are 'DEV', 'TEST' and 'PROD'
const Properties = getProperties('DEV2');
export default Properties;

function getProperties (env) {
	if (env === 'DEV') {
		return {
			ENVIRONMENT: env,
			// Bitcoin.networks.testnet works also for pregtest
			BITCOIN_NETWORK: Bitcoin.networks.testnet,
			HOST: getCurrentHost() + ':8080'
		};
	} else if (env === 'TEST') {
		return {
			ENVIRONMENT: env,
			BITCOIN_NETWORK: Bitcoin.networks.testnet,
			HOST: 'https://bitcoin2-test.csg.uzh.ch/coinblesk-server'
		};
	} else if (env === 'PROD') {
		return {
			ENVIRONMENT: env,
			BITCOIN_NETWORK: Bitcoin.networks.bitcoin,
			// TODO enter a correct host here:
			HOST: 'https://bitcoin.csg.uzh.ch/coinblesk-server'
		};
	} else {
		throw new Error('Coinblesk Error: An invalid environment is set. Set a correct one in coinblesk-frontend/src/properties.js');
	}
}

function getCurrentHost () {
	let protocol = window.location.protocol;
	if (/[^:]$/.test(protocol)) {
		protocol += ':';
	}
	let hostname = window.location.hostname;

	return protocol + '//' + hostname;
}
