import Vue from 'vue';
import properties from '@/properties';

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
			virtualPaymentViaEmail: function (dto, doNotIntercept) {
				return Vue.http.post(properties.HOST + '/auth/user/payment/virtual-payment-email', dto,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
			},
			microPaymentViaEmail: function (dto, doNotIntercept) {
				return Vue.http.post(properties.HOST + '/auth/user/payment/micro-payment-email', dto,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
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

	microPayment: function (signedDTO, doNotIntercept) {
		return Vue.http.post(properties.HOST + '/payment/micropayment', signedDTO,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
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
