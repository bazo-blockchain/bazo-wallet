// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueMoment from 'vue-moment';
import App from '@/App';
import Translation from '@/config/Translation';
import Router from '@/config/Router';
import Store from '@/config/Store';
import Toaster from '@/config/Toaster';
import HttpInterceptor from '@/config/HttpInterceptor';
import ProgressBar from '@/config/ProgressBar';
import Bootstrap from '@/config/Bootstrap';
import '@/config/OnlineOfflineListener';
import 'font-awesome/scss/font-awesome.scss';
import '@/styles/global.scss';

Vue.use(VueResource);
Vue.use(VueMoment);
Vue.config.productionTip = false;
Toaster.toast();
HttpInterceptor.intercept();
Bootstrap.bootstrap();

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store: Store,
	router: Router,
	i18n: Translation,
	nprogress: ProgressBar,
	template: '<App/>',
	components: { App }
});
