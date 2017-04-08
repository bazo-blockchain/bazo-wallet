import Vue from 'vue';
import VueProgressBar from 'vue-top-progress';
import EventBus from '../services/EventBus';

let numberOfActiveHttpCalls = 0;

export default {
	name: 'ProgressBarInterceptor',

	enable: function () {
		Vue.use(VueProgressBar, {
			color: 'rgb(143, 255, 199)',
			failedColor: 'red',
			height: '2px'
		});

		Vue.http.interceptors.push(function (request, next) {
			numberOfActiveHttpCalls++;
			console.log(numberOfActiveHttpCalls);
			EventBus.$emit('globalProgressBar', 'start');

			next(function (response) {
				numberOfActiveHttpCalls--;

				if (/^2/.test(response.status + '')) {
					if (numberOfActiveHttpCalls === 0) {
						EventBus.$emit('globalProgressBar', 'done');
					}
				} else {
					EventBus.$emit('globalProgressBar', 'fail');
				}
			});
		});
	}
};
