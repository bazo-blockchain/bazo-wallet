import Vue from 'vue';
import Toasted from 'vue-toasted';

const fontAwesomeIcon = (iconName) => {
	return '<i class="fa fa-' + iconName + '"></i>';
};
const encapsulate = (payload) => {
	return '<span class="payload">' + payload + '</span>';
}

export default {
	name: 'Toaster',

	toast: function () {
		Vue.use(Toasted, {
			duration: 4000,
			className: 'coinblesk-toast',
			globalToasts: {
				info: function (payload, initiate) {
					return initiate(fontAwesomeIcon('info-circle-o') + encapsulate(payload), 'show');
				},
				warn: function (payload, initiate) {
					return initiate(fontAwesomeIcon('warning') + encapsulate(payload), {
						className: 'coinblesk-toast warning'
					});
				},
				error: function (payload, initiate) {
					return initiate(fontAwesomeIcon('ban') + encapsulate(payload), 'error');
				},
				success: function (payload, initiate) {
					return initiate(fontAwesomeIcon('check') + encapsulate(payload), 'success');
				}
			}
		});
	}
};
