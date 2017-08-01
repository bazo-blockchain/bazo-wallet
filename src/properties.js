const Properties = {
	// possible values: window.bitcoin.networks.bitcoin, window.bitcoin.networks.testnet
	BITCOIN_NETWORK: window.bitcoin.networks.testnet,

	// server address
	HOST: getCurrentHost() + ':8080'
};

export default Properties;

function getCurrentHost () {
	let protocol = window.location.protocol;
	if (/[^:]$/.test(protocol)) {
		protocol += ':';
	}
	let hostname = window.location.hostname;

	return protocol + '//' + hostname;
}
