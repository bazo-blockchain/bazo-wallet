// possible entries are 'DEV', 'TEST' and 'PROD'
const Properties = getProperties('DEV');
export default Properties;

function getProperties (env) {
	if (env === 'DEV') {
		return {
			ENVIRONMENT: env,
			HOST: 'https://csg.uzh.ch/bazo/api'
		};
	} else if (env === 'TEST') {
		return {
			ENVIRONMENT: env
    };
	} else if (env === 'PROD') {
		return {
			ENVIRONMENT: env
		};
	} else {
		throw new Error('OySy Error: An invalid environment is set. Set a correct one in bazo-wallet/src/properties.js');
	}
}
