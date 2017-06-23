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
	const currentRoute = Router.currentRoute && Router.currentRoute.name ? Router.currentRoute.name : null;
	const offlineRoutes = Router.$offlineRoutes();

	if (offlineRoutes.indexOf(currentRoute) === -1) {
		// current route is not offline viewable
		Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineModeRedirect'), { duration: 6000 });
		Router.push({ path: '/' });
	}
}, false);
