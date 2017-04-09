import Vue from 'vue';
import Translation from '../config/Translation';
import Router from '../config/Router';

const SCHEME = 'http://';
const HOSTNAME = 'localhost:8080';
const API_URL = SCHEME + HOSTNAME;
const KEY_TOKEN = 'coinblesk_token';

const Auth = {

	user: {
		authenticated: hasTokenInStorage(),
		data: null
	},

	refreshUser: function (context) {
		if (hasTokenInStorage()) {
			return context.$http.get(API_URL + '/v1/user/auth/get', { headers: { 'DO_NOT_INTERCEPT': 'enabled' } })
				.then(response => {
					setUserData(response.body);
				}, response => {
					removeTokenFromStorage();
					removeUserData();

					Vue.toasted.global.warn(Translation.t('toasts.sessionExpired'));
					Router.push({ path: '/login' });
				});
		} else {
			removeUserData();
			return Promise.resolve();
		}
	},

	login: function (context, credentials, redirect) {
		return context.$http.post(API_URL + '/user/login', credentials, { headers: { 'DO_NOT_INTERCEPT': 'enabled' } })
			.then(response => {
				setTokenToStorage(response.body.token);

				return Auth.refreshUser(context).then(function () {
					Vue.toasted.global.successNoIcon('<i class="fa fa-sign-in"></i>' + Translation.t('toasts.signedIn'));
					if (redirect) {
						Router.push({
							path: redirect
						});
					}
				});
			}, response => {
				if (/^4/.test(response.status.toString())) {
					Vue.toasted.global.warn(Translation.t('toasts.wrongPassword'));
				}
			});
	},

	logout: function () {
		removeTokenFromStorage();
		removeUserData();

		Vue.toasted.global.successNoIcon('<i class="fa fa-sign-out"></i>' + Translation.t('toasts.signedOff'));
		Router.push({ path: '/' });
	},

	getAuthHeader: function () {
		if (!hasTokenInStorage()) {
			return null;
		}
		return 'Bearer ' + getTokenFromStorage();
	}

};

function getTokenFromStorage () {
	return window.localStorage.getItem(KEY_TOKEN);
}
function setTokenToStorage (token) {
	Auth.user.authenticated = true;
	window.localStorage.setItem(KEY_TOKEN, token);
}
function setUserData (data) {
	Auth.user.data = data;

	// TODO this is temporary, role should be included in user object from server
	Auth.user.data.role = (function extractRoleFromTokenPayload () {
		if (!hasTokenInStorage()) {
			return null;
		} else {
			const base64Payload = getTokenFromStorage().split('.')[1];
			const payload = JSON.parse(window.atob(base64Payload));
			return payload.auth;
		}
	})();
}
function hasTokenInStorage () {
	return !!getTokenFromStorage();
}
function removeTokenFromStorage () {
	Auth.user.authenticated = false;
	window.localStorage.removeItem(KEY_TOKEN);
}
function removeUserData () {
	Auth.user.data = null;
}

export default Auth;
