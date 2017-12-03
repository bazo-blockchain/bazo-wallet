// possible entries are 'DEV', 'TEST' and 'PROD'
const Properties = getProperties('DEV');
export default Properties;

function getProperties (env) {
	if (env === 'DEV') {
		return {
			ENVIRONMENT: env,
			HOST: getCurrentHost() + ':8001'
		};
	} else if (env === 'TEST') {
		return {
			ENVIRONMENT: env,
			HOST: 'https://bitcoin2-test.csg.uzh.ch/coinblesk-server'
		};
	} else if (env === 'PROD') {
		return {
			ENVIRONMENT: env,
			// TODO enter a correct host here:
			HOST: 'TBD'
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
