import Bitcoin from 'coinblesk-frontend-bitcoinjs';

const Properties = {
	// possible values: Bitcoin.networks.bitcoin, Bitcoin.networks.testnet
	BITCOIN_NETWORK: Bitcoin.networks.testnet,

	// server address
	// HOST: getCurrentHost() + ':8080'
	HOST: getCurrentHost()
};

export default Properties;

function getCurrentHost () {
	/* let protocol = window.location.protocol;
	if (/[^:]$/.test(protocol)) {
		protocol += ':';
	}
	let hostname = window.location.hostname;

	return protocol + '//' + hostname; */
	return 'https://bitcoin2-test.csg.uzh.ch/coinblesk-server'
}
