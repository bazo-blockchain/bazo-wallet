import Vue from 'vue';

const HOST = getCurrentHost() + ':8080';
const DO_NOT_INTERCEPT = { 'DO_NOT_INTERCEPT': 'enabled' };

const HttpService = {
	login: function (credentials, doNotIntercept) {
		return Vue.http.put(HOST + '/user-account/login', credentials,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	register: function (data, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/create', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	registerWithToken: function (data, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/create-with-token', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	activate: function (data, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/create-verify', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	forgotPassword: function (email, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/forgot', { email },
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	forgotPasswordVerification: function (data, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/forgot-verify', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	getForexCurrent: function (vendor, currency, doNotIntercept) {
		return Vue.http.get(HOST + '/forex/exchange-rate/bitcoin', {
				headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
				params: { currency: currency, vendor: vendor }
		});
	},
	getForexHistory: function (vendor, currency, doNotIntercept) {
		return Vue.http.get(HOST + '/forex/exchange-rate/bitcoin/history', {
				headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
				params: { currency: currency, vendor: vendor }
		});
	},

	Auth: {
		getUser: function (doNotIntercept) {
			return Vue.http.get(HOST + '/auth/common/user-account',
					doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
		},

		User: {
			getUserBalance: function (doNotIntercept, showProgressBar) {
				return Vue.http.get(HOST + '/auth/user/balance', {
					headers: doNotIntercept ? DO_NOT_INTERCEPT : undefined,
					showProgressBar: !(showProgressBar === false)
				});
			},
			getFunds: function () {
				return Vue.http.get(HOST + '/auth/user/funds');
			},
			getEncryptedPrivateKey: function () {
				return Vue.http.get(HOST + '/auth/user/encrypted-private-key');
			},
			getPaymentRequirements: function () {
				return Vue.http.get(HOST + '/auth/user/payment-requirements');
			}
		},

		Admin: {
			deleteUser: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.delete(HOST + '/auth/admin/user-accounts/' + encodedEmail + '/delete');
			},
			undeleteUser: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.put(HOST + '/auth/admin/user-accounts/' + encodedEmail + '/undelete')
			},
			switchUserRole: function (email) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.post(HOST + '/auth/admin/user-accounts/' + encodedEmail + '/switch-role');
			},
			getUserAccount: function (email, doNotIntercept) {
				const encodedEmail = window.encodeURIComponent(email);
				return Vue.http.get(HOST + '/auth/admin/user-accounts/' + encodedEmail,
						doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
			},
			getUserAccounts: function () {
				return Vue.http.get(HOST + '/auth/admin/user-accounts');
			},
			getAccount: function (publicKeyClient) {
				return Vue.http.get(HOST + '/auth/admin/accounts/' + publicKeyClient);
			},
			getAccounts: function () {
				return Vue.http.get(HOST + '/auth/admin/accounts');
			},
			getEvents: function (urgence) {
				return Vue.http.get(HOST + '/auth/admin/events', { params: { urgence } });
			},
			getServerBalance: function () {
				return Vue.http.get(HOST + '/auth/admin/server-balance');
			},
			postServerPotBaseline: function (amount) {
				return Vue.http.post(HOST + '/auth/admin/server-pot-baseline', null, { params: { amount } });
			},
			getAllServerPotBaselineAmounts: function () {
				return Vue.http.get(HOST + '/auth/admin/server-pot-baseline');
			},
			getTotalServerPotBaselineAmount: function () {
				return Vue.http.get(HOST + '/auth/admin/server-pot-baseline/total');
			}
		}
	}
};

export default HttpService;

function getCurrentHost () {
	let protocol = window.location.protocol;
	if (/[^:]$/.test(protocol)) {
		protocol += ':';
	}
	let hostname = window.location.hostname;

	return protocol + '//' + hostname;
}
