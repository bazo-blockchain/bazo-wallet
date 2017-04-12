import Vue from 'vue';
import Vuex from 'vuex';
import Auth from '../services/Auth';
import Http from '../services/Http';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		updateUser: function (state, user) {
			state.user = user;
		},
		clearUser: function (state) {
			state.user = null;
		}
	},
	actions: {
		initialize: function (context) {
			return context.dispatch('updateUser');
		},
		updateUser: function (context) {
			if (Auth.auth.authenticated) {
				return Http.getUser(true)
					.then(response => {
						context.commit('updateUser', response.body);
					}, response => {
						Auth.sessionExpired();
					});
			} else {
				context.commit('updateUser', null);
				return Promise.resolve();
			}
		}
	}
});

export default store;
