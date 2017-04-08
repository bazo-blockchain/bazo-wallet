import Vue from 'vue';
import VueProgressBar from 'vue-top-progress';
import EventBus from '../services/EventBus';

let numberOfActiveHttpCalls = 0;
let oneCallFailed = false;

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

				if (/^[^2]/.test(response.status + '')) {
					oneCallFailed = true;
				}
				if (numberOfActiveHttpCalls === 0) {
					if (oneCallFailed) {
						EventBus.$emit('globalProgressBar', 'fail');
						oneCallFailed = false;
					} else {
						EventBus.$emit('globalProgressBar', 'done');
					}
				}
			});
		});
	}
};
