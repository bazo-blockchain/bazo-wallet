import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home';
import Hello from '../components/Hello';
import Login from '../components/Login';
import Secure from '../components/auth/Secure';
import Profile from '../components/auth/Profile';
import AdminAccounts from '../components/auth/admin/Accounts';
import Translation from '../config/Translation';
import ProgressBar from '../config/ProgressBar.js';

import Auth from '../services/Auth';

Vue.use(VueRouter);

const requireAuth = (to, _from, next) => {
	if (!Auth.user.authenticated) {
		Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
		next({
			path: '/login',
			query: { redirect: to.fullPath }
		});
	} else {
		next();
	}
};

const requireAuthAndAdmin = (to, _from, next) => {
	if (!Auth.user.authenticated) {
		requireAuth(to, _from, next);
	} else if (Auth.user.data.role !== 'ADMIN') {
		Vue.toasted.global.warn(Translation.t('toasts.forbidden'), { duration: 6000 });
		next({
			path: '/'
		});
		hideProgressBar();
	} else {
		next();
	}
}

const afterAuth = (_to, from, next) => {
	if (Auth.user.authenticated) {
		next(from.path);
		hideProgressBar();
	} else {
		next();
	}
}

const error404 = (to, _from, next) => {
	Vue.toasted.global.error(Translation.t('toasts.pageNotFound'), { duration: 8000 });
	next({
		path: '/'
	});
	hideProgressBar();
}

const hideProgressBar = () => {
	// the progress bar does not hide automatically, if the route remains the same
	// (e.g. when route is blocked by authorization issues and the 'to' route is the same as the 'from' route)
	// the progress bar then remain "loading", and never stop. this prevents this behavior
	setTimeout(function () {
		ProgressBar.done(true);
	}, 100);
};

export default new VueRouter({
	routes: [
		{ path: '/', name: 'home', component: Home },
		{ path: '/hello', name: 'hello', component: Hello },
		{ path: '/login', name: 'login', component: Login, beforeEnter: afterAuth },
		{ path: '/auth/secure', name: 'secure', component: Secure, beforeEnter: requireAuth },
		{ path: '/auth/profile', name: 'profile', component: Profile, beforeEnter: requireAuth },
		{ path: '/auth/admin/accounts', name: 'admin-accounts', component: AdminAccounts, beforeEnter: requireAuthAndAdmin },
		{ path: '*', name: 'everyOtherPage', component: Home, beforeEnter: error404 }
	]
});
