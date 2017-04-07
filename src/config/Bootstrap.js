import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'; // es6 module for treeshaking
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
	name: 'Bootstrap',

	bootstrap: function () {
		Vue.use(BootstrapVue);
	}
};
