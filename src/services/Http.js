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
