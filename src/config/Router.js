import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home';
import Hello from '../components/Hello';
import Login from '../components/Login';
import Secure from '../components/auth/Secure';
import Profile from '../components/auth/Profile';
import Translation from '../config/Translation';

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

const afterAuth = (_to, from, next) => {
	if (Auth.user.authenticated) {
		next(from.path);
	} else {
		next();
	}
}

const error404 = (_to, from, next) => {
	Vue.toasted.global.error(Translation.t('toasts.pageNotFound'), { duration: 8000 });
	next();
}

export default new VueRouter({
	routes: [
		{ path: '/', name: 'home', component: Home },
		{ path: '/hello', name: 'hello', component: Hello },
		{ path: '/login', name: 'login', component: Login, beforeEnter: afterAuth },
		{ path: '/auth/secure', name: 'secure', component: Secure, beforeEnter: requireAuth },
		{ path: '/auth/profile', name: 'profile', component: Profile, beforeEnter: requireAuth },
		{ path: '*', name: 'everyOtherPage', component: Home, beforeEnter: error404 }
	]
});
