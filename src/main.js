// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router';
import Toaster from './config/Toaster';
import Interceptor from './config/Interceptor';
import 'font-awesome/scss/font-awesome.scss';

Vue.use(VueResource);
Vue.config.productionTip = false;
Toaster.toast(Vue);
Interceptor.intercept(Vue);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
});
