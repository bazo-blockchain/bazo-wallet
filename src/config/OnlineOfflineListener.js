import Vue from 'vue';
import Store from '@/config/Store';
import Router from '@/config/Router';
import Translation from '@/config/Translation';

window.addEventListener('online', () => {
	console.log('went online');
	Store.dispatch('setOffline', false);
}, false);

window.addEventListener('offline', () => {
	console.log('went offline');
	Store.dispatch('setOffline', true);

	// redirect to home, if current route is not offline viewable (component's offline flag)
	let currentRoute = Router.currentRoute && Router.currentRoute.name ? Router.currentRoute.name : null;
	let routes = [];
	if (Router.options && Router.options.routes && Router.options.routes.length > 0) {
		routes = Router.options.routes;
	}
	if (currentRoute) {
		for (let i = 0; i < routes.length; i++) {
			let route = routes[i];
			if (route.name === currentRoute) {
				if (!route.component || !route.component.offline) {
					// current route is not offline viewable
					Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineModeRedirect'), { duration: 6000 });
					Router.push({ path: '/' });
				}
				break;
			}
		}
	} else {
		console.warn('There was a problem with the Router injection in the OfflineListener');
	}
}, false);
