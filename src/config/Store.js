import Vue from 'vue';
import Vuex from 'vuex';
import Auth from '../services/Auth';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		updateUser: function (state, user) {
			state.user = user;
		}
	},
	actions: {
		initialize: function (context) {
			return context.dispatch('updateUser');
		},
		updateUser: function (context) {
			return Auth.refreshUser();
		}
	}
});

export default store;
