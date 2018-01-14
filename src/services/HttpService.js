import Vue from 'vue';
import properties from '@/properties';
import jQuery from 'jQuery';

const DO_NOT_INTERCEPT = { 'DO_NOT_INTERCEPT': 'enabled' };

const HttpService = {
	login: function (credentials, doNotIntercept) {
		return Vue.http.put(properties.HOST + '/user-account/login', credentials,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	register: function (data, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/user-account/create', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	registerWithToken: function (data, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/user-account/create-with-token', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
  queryTransactionAmount: function (doNotIntercept) {
    /*
    * This is just a placeholder method, replace with actual API calls, once the
    * backend is prepared!
    */
    return Vue.http.get('https://httpbin.org/ip', {
    })
  },
  surpriseFunding: function (options) {
    /*
    * This is just a placeholder method, replace with actual API calls, once the
    * backend is prepared!
    */
    let host = 'https://httpbin.org/post';
    if (options.target && options.target.bazoaddress) {
      return jQuery.post(host, {
        amount: options.amount,
        target: options.target.bazoaddress,
        token: options.surpriseToken
      })
    }
  },
  queryAccountInfo: function (accountAddresses, host, silent) {
    let hostbase = `${host || properties.HOST}`
    let url = HttpService.formatHost(hostbase) + 'account/'
    return Promise.all(accountAddresses.map(accountAddress => Vue.http.get(url + accountAddress, {
      method: 'GET',
      headers: 'Accept: application/json',
      showProgressBar: !silent
    })))
  },
  queryTxInfo: function (accountAddress, host, doNotIntercept) {
    let hostbase = `${host || properties.HOST}`
    let url = HttpService.formatHost(hostbase) + 'account/'
    return Vue.http.get(url + accountAddress, {
      method: 'GET',
      headers: 'Accept: application/json'
    })
  },
  createFundsTx: function (recipient, sender, amount, txCount, fee, host) {
    let hostbase = `${host || properties.HOST}`
    let url = HttpService.formatHost(hostbase) + 'createFundsTx/'

    return jQuery.post(`${url}0/${amount}/${fee}/${txCount}/${sender}/${recipient}`);
  },
  sendSignedFundsTx: function (fundsTxHash, signature, host) {
    let hostbase = `${host || properties.HOST}`
    let url = HttpService.formatHost(hostbase) + 'sendFundsTx/'

    return jQuery.post(`${url}${fundsTxHash}/${signature}`);
  },
	Auth: {
		getUser: function (doNotIntercept) {
			return Vue.http.get(properties.HOST + '/auth/common/user-account',
					doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
		},
		changePassword: function (data) {
			return Vue.http.put(properties.HOST + '/auth/common/user-account/change-password', data);
		},

		User: {
			getUserBalance: function (doNotIntercept, showProgressBar) {
				return Vue.http.get(properties.HOST + '/auth/user/balance', {
					headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
					showProgressBar: !(showProgressBar === false)
				});
			},
			getFunds: function () {
				return Vue.http.get(properties.HOST + '/auth/user/funds');
			},
			getEncryptedPrivateKey: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/encrypted-private-key');
			},
			getLockedAddress: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/locked-address');
			},
			getFees: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/fee');
			},
			getUTXO: function (address) {
				return Vue.http.get(properties.HOST + '/auth/user/payment/utxo', { params: { address } });
			},
			getChannelTransaction: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/channel-transaction');
			},
			getServerPotAddress: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/server-pot-address');
			},
			getMaximalAvailableChannelAmount: function () {
				return Vue.http.get(properties.HOST + '/auth/user/payment/remaining-channel-amount');
			},
			getLockedAddressOfEmail: function (email) {
				return Vue.http.get(properties.HOST + '/auth/user/payment/locked-address-of-email', { params: { email } });
			},
			virtualPaymentViaEmail: function (dto, doNotIntercept) {
				return Vue.http.post(properties.HOST + '/auth/user/payment/virtual-payment-email', dto,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
			},
			microPaymentViaEmail: function (dto, doNotIntercept) {
				return Vue.http.post(properties.HOST + '/auth/user/payment/micro-payment-email', dto,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
			},
			externalPayment: function (transaction, doNotIntercept) {
				return Vue.http.post(properties.HOST + '/auth/user/payment/external-payment', null,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT, params: { transaction } } : { params: { transaction } });
			}
		}
	},

	createTimeLockedAddress: function (signedDTO, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/payment/createTimeLockedAddress', signedDTO,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	payout: function (signedDTO, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/payment/payout', signedDTO,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
  formatHost: function (hostBase) {
    if (hostBase.slice(-1) === '/') {
      return hostBase
    } return hostBase + '/'
  }
};

export default HttpService;
