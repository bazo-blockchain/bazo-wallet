import Vue from 'vue';
import Auth from '../services/Auth';
import router from '../router';

const internalError = () => {
	Vue.toasted.global.error('An internal error occured. The page will be reloaded.');
	setTimeout(() => {
		window.location.reload();
	}, 3000);
};

export default {
	name: 'Interceptor',

	intercept: function () {
		Vue.http.interceptors.push(function (request, next) {
			request.headers.set('Authorization', Auth.getAuthHeader());

			next(function (response) {
				const isLoginRequest = /^https?:\/\/[^:/]+(:\d{2,})?\/user\/login$/.test(request.url) && request.method === 'POST';
				const status = response.status + '';

				if (isLoginRequest) {
					if (/^2/.test(status)) {
						Vue.toasted.global.success('You have successfully been authenticated.')
					} else if (/^4/.test(status)) {
						Vue.toasted.global.warn('The combination of your username/password is incorrect.');
					} else if (/^5/.test(status)) {
						internalError();
					}
				} else {
					if (response.status === 401) {
						Auth.repudiate();
						Vue.toasted.global.warn('You are trying to access a protected resource. Please authenticate yourself first.', { duration: 6000 });
						router.push({ path: '/login' });
					} else if (response.status === 403) {
						Vue.toasted.global.error('You do not have the rights to access this site.');
					} else if (/^(4|5)/.test(status)) {
						internalError(Vue);
					}
				}
			});
		});
	}
};
