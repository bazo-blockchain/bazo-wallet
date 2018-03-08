import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home';
import UserSend from '@/components/auth/user/UserSend';
import UserRequest from '@/components/auth/user/UserRequest';
import Accounts from '@/components/Accounts';
import Funds from '@/components/auth/user/Funds';
import Transactions from '@/components/Transactions'
import Settings from '@/components/auth/user/Settings';
import Translation from '@/config/Translation';
import ProgressBar from '@/config/ProgressBar.js';
import Store from '@/config/Store';

Vue.use(VueRouter);

// returns a boolean, if page is unaccessible
const isUnavailableBecauseOffline = (to) => {
	// if online: always accesible
	if (!Store.state.offline) {
		return false;
	}

	let routeComponent = null;
	for (let i = 0; i < routes.length; i++) {
		let route = routes[i];
		if (route.name === to.name) {
			routeComponent = route.component;
			break;
		}
	}

	// if the "to"-component has a flag offline,
	// and it is set to true, the page is accesible
	// even though the page is offline
	if (routeComponent) {
		return !routeComponent.offline;
	} else {
		return true;
	}
};
// if a user is offline and routes to an unavailable route, it blocks
// the request if the "from" variable is set or redirects to the home
// screen (from is not set when route is directly accessed by URL)
const redirectBecauseUnavailable = (from, next) => {
	if (from && from.path) {
		next(from.path);
	} else {
		next({ path: '/' });
	}
	Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineModeRedirect'), { duration: 6000 });
	hideProgressBar();
};

const noAuth = (to, _from, next) => {
	if (isUnavailableBecauseOffline(to)) {
		redirectBecauseUnavailable(_from, next);
	} else {
		next();
	}
};

const requireAuth = (to, _from, next) => {
	if (isUnavailableBecauseOffline(to)) {
		redirectBecauseUnavailable(_from, next);
	} else {
		if (!Store.state.config.configured) {
			Vue.toasted.global.warn(Translation.t('toasts.accountrequired'), { duration: 6000 });
			next({
				path: '/accounts',
				query: {
          redirect: to.fullPath
        }
			});
		} else {
			next();
		}
	}
};

const requireBazoAccount = (to, _from, next) => {
  if (!Store.state.config.configured) {
    requireAuth(to, _from, next);
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

// ALWAYS USE a name: the offline routing decision works with the name and the component's offline flag
// ALWAYS USE the beforeEnter property: if no authentication is required, use "noAuth". this is necessary
// because noAuth checks the offline state of the application and denies access, if the components offline
// flag is not set.
const routes = [
	{ path: '/', name: 'home', component: Home, beforeEnter: noAuth, meta: { showProgressBar: false } },
	{ path: '/accounts', name: 'accounts', component: Accounts, props: true, beforeEnter: noAuth },
  { path: '/funds', name: 'funds', component: Funds, beforeEnter: noAuth },
  { path: '/transactions', name: 'transactions', component: Transactions, props: true, beforeEnter: noAuth },

  { path: '/auth/user/settings', name: 'settings', component: Settings, beforeEnter: requireBazoAccount },
	{ path: '/auth/user/send', name: 'user-send', component: UserSend, props: true, beforeEnter: requireBazoAccount },
  { path: '/auth/user/request', name: 'user-request', component: UserRequest, beforeEnter: requireBazoAccount },

	{ path: '*', name: 'everyOtherPage', component: Home, beforeEnter: error404 }
]

// add a method $offlineRoutes to every Router object: the resulting array contains a list of routing names
VueRouter.prototype.$offlineRoutes = function () {
	const Router = this;
	const offlineRoutes = ['settings', 'user-request'];
	const warn = () => { console.warn('A problem occured while reading the Router options.'); };

	if (Router && Router.options && Router.options.routes && Router.options.routes.length > 0) {
		for (let i = 0; i < Router.options.routes.length; i++) {
			let route = Router.options.routes[i];
			if (route && route.component && route.name) {
				if (route.component.offline) {
					offlineRoutes.push(route.name);
				}
			} else {
				warn();
			}
		}
	} else {
		warn();
	}
	return offlineRoutes;
};

export default new VueRouter({ routes });
