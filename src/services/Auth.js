import Vue from 'vue';
import Translation from '../config/Translation';
import router from '../config/router';

const SCHEME = 'http://';
const HOSTNAME = 'localhost:8080';
const API_URL = SCHEME + HOSTNAME;
const KEY_TOKEN = 'coinblesk_token';

const getTokenFromStorage = () => {
	return window.localStorage.getItem(KEY_TOKEN);
}
const setTokenToStorage = (token) => {
	window.localStorage.setItem(KEY_TOKEN, token);
}
const hasTokenInStorage = () => {
	return !!getTokenFromStorage();
}
const removeTokenFromStorage = () => {
	window.localStorage.removeItem(KEY_TOKEN);
}
const getPayloadFromTokenInStorage = () => {
	if (!hasTokenInStorage()) {
		return null;
	}
	const base64Payload = getTokenFromStorage().split('.')[1];
	return JSON.parse(window.atob(base64Payload));
}

const update = (Auth) => {
	Auth.user.authenticated = hasTokenInStorage();
	Auth.user.payload = getPayloadFromTokenInStorage();
	Auth.user.token = getTokenFromStorage();
	Auth.user.data = null;
}

const Auth = {

	user: {
		authenticated: hasTokenInStorage(),
		payload: getPayloadFromTokenInStorage(),
		token: getTokenFromStorage(),
		data: null
	},

	refreshUserData: function (context) {
		if (hasTokenInStorage()) {
			return context.$http.get(API_URL + '/v1/user/auth/get', { params: { 'DO_NOT_INTERCEPT': 1 } })
				.then(response => {
					Auth.user.data = response.body;
				}, response => {
					removeTokenFromStorage();
					update(Auth);
					Auth.user.data = null;

					Vue.toasted.global.warn(Translation.t('toasts.sessionExpired'));
					router.push({ path: '/login' });
				});
		} else {
			Auth.user.data = null;
			return Promise.resolve();
		}
	},

	login: function (context, credentials, redirect) {
		return context.$http.post(API_URL + '/user/login', credentials)
			.then(response => {
				const token = response.body.token;

				setTokenToStorage(token);
				update(Auth);

				return Auth.refreshUserData(context).then(function () {
					if (redirect) {
						router.push({
							path: redirect
						});
					}
				});
			}, response => {
				context.error = response;
			});
	},

	logout: function () {
		removeTokenFromStorage();
		update(Auth);
		Auth.refreshUserData();

		Vue.toasted.global.successNoIcon('<i class="fa fa-sign-out"></i>' + Translation.t('toasts.signedOff'));
		router.push({ path: '/' });
	},

	getAuthHeader: function () {
		if (!hasTokenInStorage()) {
			return null;
		}
		return 'Bearer ' + getTokenFromStorage();
	}

};

export default Auth;
