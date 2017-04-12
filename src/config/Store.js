import Vue from 'vue';
import Vuex from 'vuex';
import Http from '../services/Http';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null
	},
	mutations: {
		updateUser: function (state, payload) {
			state.user = payload;
		}
	},
	actions: {
		updateUser: function (context) {
			Http.getUser().then(response => {
				context.commit('updateUser', response.body);
			});
		},
		updateUserNoIntercept: function (context) {
			Http.getUser(true).then(response => {
				context.commit('updateUser', response.body);
			});
		}
	}
});

export default store;
