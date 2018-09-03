// possible entries are 'DEV', 'TEST' and 'PROD'
const Properties = getProperties('DEV');
export default Properties;

function getProperties (env) {
	if (env === 'DEV') {
		return {
			ENVIRONMENT: env,
			HOST: 'https://oysyconnect.westeurope.cloudapp.azure.com/',
      CARMA_HOST: 'https://carma-poc.autoidlabs.ch/',
      // TODO: Set this app ID in production environments.
      CARM_APP_ID: 'a63c1f72-8198-4a59-85be-67a96f87ab41'
		};
	} else if (env === 'TEST') {
		return {
			ENVIRONMENT: env,
      HOST: 'https://oysyconnect.westeurope.cloudapp.azure.com/'
    };
	} else if (env === 'PROD') {
		return {
			ENVIRONMENT: env,
      HOST: 'https://oysyconnect.westeurope.cloudapp.azure.com/'
		};
	} else {
		throw new Error('OySy Error: An invalid environment is set. Set a correct one in bazo-wallet/src/properties.js');
	}
}
