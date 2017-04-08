import Vue from 'vue';
import Toasted from 'vue-toasted';

const fontAwesomeIcon = (iconName) => {
	return '<i class="fa fa-' + iconName + '"></i>';
};

export default {
	name: 'Toaster',

	toast: function () {
		Vue.use(Toasted, {
			duration: 4000,
			className: 'coinblesk-toast',
			globalToasts: {
				info: function (payload, initiate) {
					return initiate(fontAwesomeIcon('info-circle-o') + payload, 'show');
				},
				infoNoIcon: function (payload, initiate) {
					return initiate(payload, 'show');
				},
				warn: function (payload, initiate) {
					return initiate(fontAwesomeIcon('warning') + payload, {
						className: 'coinblesk-toast warning'
					});
				},
				warnNoIcon: function (payload, initiate) {
					return initiate(payload, {
						className: 'coinblesk-toast warning'
					});
				},
				error: function (payload, initiate) {
					return initiate(fontAwesomeIcon('ban') + payload, 'error');
				},
				errorNoIcon: function (payload, initiate) {
					return initiate(payload, 'error');
				},
				success: function (payload, initiate) {
					return initiate(fontAwesomeIcon('check') + payload, 'success');
				},
				successNoIcon: function (payload, initiate) {
					return initiate(payload, 'success');
				}
			}
		});
	}
};
