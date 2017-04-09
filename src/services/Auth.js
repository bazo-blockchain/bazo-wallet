import Vue from 'vue';
import Translation from '../config/Translation';
import Router from '../config/Router';

const SCHEME = 'http://';
const HOSTNAME = 'localhost:8080';
const API_URL = SCHEME + HOSTNAME;
const KEY_TOKEN = 'coinblesk_token';

const Auth = {

	user: {
		authenticated: null,
		data: null
	},

	refreshUser: function (context) {
		// initial authentication check (page load)
		Auth.user.authenticated = hasTokenInStorage();

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

const getTokenFromStorage = () => {
	return window.localStorage.getItem(KEY_TOKEN);
};
const setTokenToStorage = (token) => {
	Auth.user.authenticated = true;
	window.localStorage.setItem(KEY_TOKEN, token);
};
const setUserData = (data) => {
	Auth.user.data = data;
};
const hasTokenInStorage = () => {
	return !!getTokenFromStorage();
};
const removeTokenFromStorage = () => {
	Auth.user.authenticated = false;
	window.localStorage.removeItem(KEY_TOKEN);
};
const removeUserData = () => {
	Auth.user.data = null;
};

export default Auth;
