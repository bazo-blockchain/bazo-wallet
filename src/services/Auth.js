import Vue from 'vue';
import Translation from '../config/Translation';
import Router from '../config/Router';
import Http from '../services/Http';
import Store from '../config/Store';

const KEY_TOKEN = 'coinblesk_token';

const Auth = {

	auth: {
		authenticated: hasTokenInStorage(),
		role: getRoleFromStorage()
	},

	refreshUser: function () {
		if (hasTokenInStorage()) {
			return Http.getUser(true)
				.then(response => {
					Store.commit('updateUser', response.body);
				}, response => {
					removeTokenFromStorage();
					Store.commit('updateUser', null);

					Vue.toasted.global.warn(Translation.t('toasts.sessionExpired'));
					Router.push({ path: '/login' });
				});
		} else {
			Store.commit('updateUser', null);
			return Promise.resolve();
		}
	},

	login: function (credentials, redirect) {
		return Http.login(credentials, true)
			.then(response => {
				setTokenToStorage(response.body.token);

				return Auth.refreshUser().then(function () {
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
		Store.commit('updateUser', null);

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
	window.localStorage.setItem(KEY_TOKEN, token);
	Auth.auth.authenticated = true;
	Auth.auth.role = getRoleFromStorage();
}
function hasTokenInStorage () {
	return !!getTokenFromStorage();
}
function removeTokenFromStorage () {
	Auth.auth.authenticated = false;
	window.localStorage.removeItem(KEY_TOKEN);
}
function getRoleFromStorage () {
	const role = (function extractRoleFromTokenPayload () {
		if (!hasTokenInStorage()) {
			return null;
		} else {
			const base64Payload = getTokenFromStorage().split('.')[1];
			const payload = JSON.parse(window.atob(base64Payload));
			return payload.auth;
		}
	})();

	return role;
}

export default Auth;
