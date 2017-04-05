import router from '../router';

const SCHEME = 'http://';
const HOSTNAME = 'localhost:8080';
const API_URL = SCHEME + HOSTNAME;

export default {

	user: {
		authenticated: hasTokenInStorage()
	},

	login: function (context, credentials, redirect) {
		context.$http.post(API_URL + '/user/login', credentials)
			.then(response => {
				const token = response.body.token;

				setTokenToStorage(token);
				this.user.authenticated = true;

				if (redirect) {
					router.push({
						path: redirect
					});
				}
			}, response => {
				context.error = response;
			});
	},

	check: function (context) {
		this.user.authenticated = hasTokenInStorage();
		return this.user.authenticated;
	}

};

const KEY_TOKEN = 'coinblesk_token';
function getTokenFromStorage () {
	return window.localStorage.getItem(KEY_TOKEN);
}
function setTokenToStorage (token) {
	window.localStorage.setItem(KEY_TOKEN, token);
}
function hasTokenInStorage () {
	return !!getTokenFromStorage();
}
