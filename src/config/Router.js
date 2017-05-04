import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home';
import Hello from '../components/Hello';
import Forex from '@/components/Forex';
import Activation from '../components/Activation';
import PasswordForgotten from '../components/PasswordForgotten';
import PasswordForgottenVerification from '../components/PasswordForgottenVerification';
import Registration from '../components/Registration';
import Login from '../components/Login';
import Authenticated from '../components/auth/Authenticated';
import UserAuthenticated from '../components/auth/user/UserAuthenticated';
import Profile from '../components/auth/Profile';
import AdminServerBalance from '../components/auth/admin/AdminServerBalance';
import AdminAccountsDetail from '../components/auth/admin/AdminAccountsDetail';
import AdminAccounts from '../components/auth/admin/AdminAccounts';
import AdminUserAccounts from '@/components/auth/admin/AdminUserAccounts';
import AdminUserAccountsDetail from '@/components/auth/admin/AdminUserAccountsDetail';
import AdminEvents from '../components/auth/admin/AdminEvents';
import Translation from '../config/Translation';
import ProgressBar from '../config/ProgressBar.js';

import Auth from '../services/Auth';

Vue.use(VueRouter);

const requireAuth = (to, _from, next) => {
	if (!Auth.auth.authenticated) {
		Vue.toasted.global.warn(Translation.t('toasts.unauthorized'), { duration: 6000 });
		next({
			path: '/login',
			query: { redirect: to.fullPath }
		});
	} else {
		next();
	}
};

const requireAuthAndRole = (role, to, _from, next) => {
	if (!Auth.auth.authenticated) {
		requireAuth(to, _from, next);
	} else if (Auth.auth.role !== role) {
		Vue.toasted.global.warn(Translation.t('toasts.forbidden'), { duration: 6000 });
		next({
			path: '/'
		});
		hideProgressBar();
	} else {
		next();
	}
};
const requireAuthAndAdmin = (to, _from, next) => {
	return requireAuthAndRole('ROLE_ADMIN', to, _from, next);
};
const requireAuthAndUser = (to, _from, next) => {
	return requireAuthAndRole('ROLE_USER', to, _from, next);
};

const afterAuth = (_to, from, next) => {
	if (Auth.auth.authenticated) {
		next(from.path);
		hideProgressBar();
	} else {
		next();
	}
};

const error404 = (to, _from, next) => {
	Vue.toasted.global.error(Translation.t('toasts.pageNotFound'), { duration: 8000 });
	next({
		path: '/'
	});
	hideProgressBar();
};

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
		{ path: '/registration', name: 'registration', component: Registration },
		{ path: '/password-forgotten', name: 'password-forgotten', component: PasswordForgotten },
		{ path: '/password-forgotten-verification/:email?/:token?', name: 'password-forgotten-verification', component: PasswordForgottenVerification, props: true },
		{ path: '/activation/:email?/:token?', name: 'activation', component: Activation, props: true },
		{ path: '/login', name: 'login', component: Login, beforeEnter: afterAuth },

		{ path: '/hello', name: 'hello', component: Hello },
		{ path: '/forex', name: 'forex', component: Forex },

		{ path: '/auth/profile', name: 'profile', component: Profile, beforeEnter: requireAuth },
		{ path: '/auth/authenticated', name: 'authenticated', component: Authenticated, beforeEnter: requireAuth },

		{ path: '/auth/user/authenticated', name: 'user-authenticated', component: UserAuthenticated, beforeEnter: requireAuthAndUser },

		{ path: '/auth/admin/events', name: 'admin-events', component: AdminEvents, beforeEnter: requireAuthAndAdmin },
		{ path: '/auth/admin/server-balance', name: 'admin-server-balance', component: AdminServerBalance, beforeEnter: requireAuthAndAdmin },
		{ path: '/auth/admin/accounts', name: 'admin-accounts', component: AdminAccounts, beforeEnter: requireAuthAndAdmin },
		{ path: '/auth/admin/accounts-detail/:publicKeyClient', name: 'admin-accounts-detail', component: AdminAccountsDetail, props: true, beforeEnter: requireAuthAndAdmin },
		{ path: '/auth/admin/user-accounts', name: 'admin-user-accounts', component: AdminUserAccounts, beforeEnter: requireAuthAndAdmin },
		{ path: '/auth/admin/user-accounts-detail/:email', name: 'admin-user-accounts-detail', component: AdminUserAccountsDetail, props: true, beforeEnter: requireAuthAndAdmin },

		{ path: '*', name: 'everyOtherPage', component: Home, beforeEnter: error404 }
	]
});
