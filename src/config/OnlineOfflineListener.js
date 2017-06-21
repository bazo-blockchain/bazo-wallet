import Store from '@/config/Store';

window.addEventListener('online', () => {
	console.log('went online');
	Store.dispatch('setOffline', false);
}, false);
window.addEventListener('offline', () => {
	console.log('went offline');
	Store.dispatch('setOffline', true);
}, false);
