import Vue from 'vue';
// import Router from '@/config/Router';
import Translation from '@/config/Translation';
import Store from '@/config/Store';

const internalError = () => {
	Vue.toasted.global.errorNoIcon('<i class="fa fa-times"></i>' + Translation.t('toasts.internalError'));
	setTimeout(() => {
		// window.location.reload();
	}, 3000);
};

export default {
	name: 'HttpInterceptor',

	intercept: function () {
		Vue.http.interceptors.push(function (request, next) {
			const doNotIntercept = !!request.headers.get('DO_NOT_INTERCEPT');

			next(function (response) {
				if (/^5/.test(response.status.toString())) {
					internalError();
				} else if (/(^0$)/.test(response.status.toString())) {
					// a request was made, even though the user is offline!
					// Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineError'));
				} else if (/^(?!2|400$|401$|403$)/.test(response.status.toString()) && !doNotIntercept) {
					internalError();
				} else if (!doNotIntercept) {
					if (response.status === 401) {
						if (Store.state.auth.authenticated) {
							// session expired, token not valid anymore
							Store.dispatch('logout');
							Vue.toasted.global.warnNoIcon('<i class="fa fa-sign-out">' + Translation.t('toasts.sessionExpired'));
							// Router.push({ path: '/login' });
						} else {
							Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
							// Router.push({ path: '/login' });
						}
					}
					if (response.status === 403) {
						Vue.toasted.global.error(Translation.t('toasts.forbidden'));
					}
					if (response.status === 400) {
						Vue.toasted.global.warn(Translation.t('toasts.validationError'));
					}
				}
			});
		});
	}
};
