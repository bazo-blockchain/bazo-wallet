import Vue from 'vue';

const HOST = getCurrentHost() + ':8080';
const DO_NOT_INTERCEPT = { 'DO_NOT_INTERCEPT': 'enabled' };

const Http = {

	getUser: function (doNotIntercept) {
		return Vue.http.get(HOST + '/v1/user/auth/get',
			doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	login: function (credentials, doNotIntercept) {
		return Vue.http.post(HOST + '/user/login', credentials,
			doNotIntercept ? { headers: DO_NOT_INTERCEPT } : undefined);
	},

	adminGetAccounts: function () {
		return Vue.http.get(HOST + '/admin/accounts');
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
