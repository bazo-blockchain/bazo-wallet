import router from '../router';

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
}

export default {

	user: {
		authenticated: hasTokenInStorage(),
		payload: getPayloadFromTokenInStorage(),
		token: getTokenFromStorage()
	},

	authenticate: function (context, credentials, redirect) {
		context.$http.post(API_URL + '/user/login', credentials)
			.then(response => {
				const token = response.body.token;
				setTokenToStorage(token);
				update(this);

				if (redirect) {
					router.push({
						path: redirect
					});
				}
			}, response => {
				context.error = response;
			});
	},

	repudiate: function () {
		removeTokenFromStorage();
		update(this);
		router.push({ path: '/' });
	},

	getAuthHeader: function () {
		if (!hasTokenInStorage()) {
			return null;
		}
		return 'Bearer ' + getTokenFromStorage();
	}

};

