import Vue from 'vue';

const HOST = getCurrentHost() + ':8080';
const DO_NOT_INTERCEPT = { 'DO_NOT_INTERCEPT': 'enabled' };

const Http = {
	login: function (credentials, doNotIntercept) {
		return Vue.http.put(HOST + '/user-account/login', credentials,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},
	register: function (credentials, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/create', credentials,
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
	getForexCurrent: function (vendor, currency) {
		return Vue.http.get(HOST + '/forex/exchange-rate/bitcoin', { params: { currency: currency, vendor: vendor } });
	},
	getForexHistory: function (vendor, currency) {
		return Vue.http.get(HOST + '/forex/exchange-rate/bitcoin/history', { params: { currency: currency, vendor: vendor } });
	},

	Auth: {
		getUser: function (doNotIntercept) {
			return Vue.http.get(HOST + '/auth/common/user-account',
					doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
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

export default Http;

function getCurrentHost () {
	let protocol = window.location.protocol;
	if (/[^:]$/.test(protocol)) {
		protocol += ':';
	}
	let hostname = window.location.hostname;

	return protocol + '//' + hostname;
}
