import Toasted from 'vue-toasted';

export default {
	name: 'Toaster',

	toast: function (Vue) {
		Vue.use(Toasted, {
			duration: 4000
		});
	}
};
