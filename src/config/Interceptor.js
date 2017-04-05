import Auth from '../services/Auth';
import router from '../router';

export default {
	name: 'Interceptor',

	intercept: function (Vue) {
		Vue.http.interceptors.push(function (request, next) {
			request.headers.set('Authorization', Auth.getAuthHeader());

			next(function (response) {
				if (response.status === 401) {
					Auth.repudiate();
					router.push({ path: '/login' });
				} else if (response.status === 403) {
					console.log('You do not have the rights to access this site.')
				}
			});
		});
	}
};
