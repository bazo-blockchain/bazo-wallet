import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Hello from '@/components/Hello';
import Login from '@/components/Login';
import Secure from '@/components/auth/Secure';

import Auth from '@/services/Auth';

Vue.use(Router);

const requireAuth = (to, _from, next) => {
	if (!Auth.user.authenticated) {
		Vue.toasted.global.warn('You are trying to access a protected resource. Please authenticate yourself first.', { duration: 6000 });
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

export default new Router({
	routes: [
		{ path: '/', name: 'home', component: Home },
		{ path: '/hello', name: 'hello', component: Hello },
		{ path: '/auth/secure', name: 'secure', component: Secure, beforeEnter: requireAuth },
		{ path: '/login', name: 'login', component: Login, beforeEnter: afterAuth },
		{ path: '*', redirect: '/' }
	]
});
