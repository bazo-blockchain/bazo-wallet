import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Login from '@/components/Login';

import Auth from '@/services/Auth';

Vue.use(Router);

const requireAuth = (to, _from, next) => {
	console.log(Auth.user);
	if (!Auth.user.authenticated) {
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
		{ path: '/', name: 'home', component: Hello, beforeEnter: requireAuth },
		{ path: '/login', name: 'login', component: Login, beforeEnter: afterAuth },
		{ path: '*', redirect: '/' }
	]
});
