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
			const doNotIntercept = !!request.headers.get('DO_NOT_INTERCEPT');

			next(function (response) {
				if (/^(?!2|400$|401$|403$)/.test(response.status.toString())) {
					internalError();
				} else if (!doNotIntercept) {
					if (response.status === 401) {
						Auth.logout();
						Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
						Router.push({ path: '/login' });
					}
					if (response.status === 403) {
						Vue.toasted.global.error(Translation.t('toasts.forbidden'));
					}
					if (response.status === 400) {
						Vue.toasted.global.error(Translation.t('toasts.validationError'));
					}
				}
			});
		});
	}
};
