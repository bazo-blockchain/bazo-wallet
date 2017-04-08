import Vue from 'vue';
import Auth from '../services/Auth';
import router from '../config/router';
import Translation from '../config/Translation';

const internalError = () => {
	Vue.toasted.global.error(Translation.t('toasts.internalError'));
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
						Vue.toasted.global.success(Translation.t('toasts.signedIn'));
					} else if (/^4/.test(status)) {
						Vue.toasted.global.warn(Translation.t('toasts.wrongPassword'));
					} else {
						internalError();
					}
				} else {
					if (response.status === 401) {
						Auth.repudiate();
						Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
						router.push({ path: '/login' });
					} else if (response.status === 403) {
						Vue.toasted.global.error(Translation.t('toasts.forbidden'));
					} else if (/^[^2]/.test(status)) {
						internalError(Vue);
					}
				}
			});
		});
	}
};
