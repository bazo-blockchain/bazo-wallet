import Vue from 'vue';
import Auth from '../services/Auth';
import Router from '../config/Router';
import Translation from '../config/Translation';

const internalError = () => {
	Vue.toasted.global.errorNoIcon('<i class="fa fa-times"></i>' + Translation.t('toasts.internalError'));
	setTimeout(() => {
		window.location.reload();
	}, 3000);
};

export default {
	name: 'HttpInterceptor',

	intercept: function () {
		Vue.http.interceptors.push(function (request, next) {
			request.headers.set('Authorization', Auth.getAuthHeader());

			next(function (response) {
				const isLoginRequest = /^https?:\/\/[^:/]+(:\d{2,})?\/user\/login$/.test(request.url) && request.method === 'POST';
				const status = response.status + '';

				if (Object.keys(request.params).indexOf('DO_NOT_INTERCEPT') === -1) {
					if (isLoginRequest) {
						if (/^2/.test(status)) {
							Vue.toasted.global.successNoIcon('<i class="fa fa-sign-in"></i>' + Translation.t('toasts.signedIn'));
						} else if (/^4/.test(status)) {
							Vue.toasted.global.warn(Translation.t('toasts.wrongPassword'));
						} else {
							internalError();
						}
					} else {
						if (response.status === 401) {
							Auth.logout();
							Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
							Router.push({ path: '/login' });
						} else if (response.status === 403) {
							Vue.toasted.global.error(Translation.t('toasts.forbidden'));
						} else if (/^[^2]/.test(status)) {
							internalError(Vue);
						}
					}
				}
			});
		});
	}
};
