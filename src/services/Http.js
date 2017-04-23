import Vue from 'vue';

const HOST = getCurrentHost() + ':8080';
const DO_NOT_INTERCEPT = { 'DO_NOT_INTERCEPT': 'enabled' };

const Http = {

	getUser: function (doNotIntercept) {
		return Vue.http.get(HOST + '/auth/common/user-account',
			doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	login: function (credentials, doNotIntercept) {
		return Vue.http.put(HOST + '/user-account/login', credentials,
			doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	register: function (credentials) {
		return Vue.http.post(HOST + '/user-account/create', credentials);
	},

	activate: function (data, doNotIntercept) {
		return Vue.http.post(HOST + '/user-account/create-verify', data,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	adminDeleteUser: function (email) {
		const encodedEmail = window.encodeURIComponent(email);
		return Vue.http.delete(HOST + '/auth/admin/user-accounts/' + encodedEmail);
	},

	adminSwitchUserRole: function (email) {
		const encodedEmail = window.encodeURIComponent(email);
		return Vue.http.post(HOST + '/auth/admin/user-accounts/' + encodedEmail + '/switch-role');
	},

	adminGetUserAccount: function (email, doNotIntercept) {
		const encodedEmail = window.encodeURIComponent(email);
		return Vue.http.get(HOST + '/auth/admin/user-accounts/' + encodedEmail,
				doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	adminGetUserAccounts: function () {
		return Vue.http.get(HOST + '/auth/admin/user-accounts');
	},

	adminGetAccounts: function () {
		return Vue.http.get(HOST + '/auth/admin/accounts');
	},

	adminGetEvents: function (urgence) {
		return Vue.http.get(HOST + '/auth/admin/events', { params: { urgence } });
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
