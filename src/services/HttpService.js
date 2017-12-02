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
    return Vue.http.get('https://httpbin.org/ip', {
    })
  },
  queryAccountInfo: function (accountAddress, doNotIntercept) {
    return Vue.http.get('http://localhost:8001/account/' + accountAddress, {
      method: 'GET',
      headers: 'Accept: application/json'
    })
  },
  createFundsTx: function (recipient, sender, amount, txCount, fee) {
    // const header = 0;
    return jQuery.post(`http://localhost:8001/createFundsTx/${amount}/${fee}/${txCount}/${sender}/${recipient}`)
  },
	activate: function (data, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/user-account/create-verify', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	forgotPassword: function (email, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/user-account/forgot', { email },
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	forgotPasswordVerification: function (data, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/user-account/forgot-verify', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	getForexCurrent: function (vendor, currency, doNotIntercept) {
		return Vue.http.get(properties.HOST + '/forex/exchange-rate/bitcoin', {
				headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
				params: { currency: currency, vendor: vendor }
		});
	},
	getForexHistory: function (vendor, currency, doNotIntercept) {
		return Vue.http.get(properties.HOST + '/forex/exchange-rate/bitcoin/history', {
				headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
				params: { currency: currency, vendor: vendor }
		});
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
		},

		Admin: {
			deleteUser: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.delete(properties.HOST + '/auth/admin/user-accounts/' + encodedEmail + '/delete');
			},
			undeleteUser: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.put(properties.HOST + '/auth/admin/user-accounts/' + encodedEmail + '/undelete')
			},
			switchUserRole: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.post(properties.HOST + '/auth/admin/user-accounts/' + encodedEmail + '/switch-role');
			},
			getUserAccount: function (email, doNotIntercept) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.get(properties.HOST + '/auth/admin/user-accounts/' + encodedEmail,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
			},
			getUserAccounts: function () {
				return Vue.http.get(properties.HOST + '/auth/admin/user-accounts');
			},
			getAccount: function (publicKeyClient) {
				return Vue.http.get(properties.HOST + '/auth/admin/accounts/' + publicKeyClient);
			},
			getAccounts: function () {
				return Vue.http.get(properties.HOST + '/auth/admin/accounts');
			},
			getEvents: function (urgence) {
				return Vue.http.get(properties.HOST + '/auth/admin/events', { params: { urgence } });
			},
			getServerBalance: function () {
				return Vue.http.get(properties.HOST + '/auth/admin/server-balance');
			},
			postServerPotBaseline: function (amount) {
				return Vue.http.post(properties.HOST + '/auth/admin/server-pot-baseline', null, { params: { amount } });
			},
			getAllServerPotBaselineAmounts: function () {
				return Vue.http.get(properties.HOST + '/auth/admin/server-pot-baseline');
			},
			getTotalServerPotBaselineAmount: function () {
				return Vue.http.get(properties.HOST + '/auth/admin/server-pot-baseline/total');
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
	}
};

export default HttpService;
