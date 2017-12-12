import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-persistedstate'
import HttpService from '@/services/HttpService';
import Translation from '@/config/Translation';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		language: null,
    config: {
      configured: false,
      accounts: [],
      updatedBalances: null
    },
    settings: {
      showAdvancedOptions: 'shown',
      useCustomHost: 'false',
      customURL: 'http://192.41.136.199:8001'
    },
		offline: !(typeof window.navigator.onLine === 'undefined' ||
				window.navigator.onLine === null ||
				window.navigator.onLine)
	},
  getters: {
    bazoAccounts: function (state) {
      return state.config.accounts;
    },
    accountConfigured: function (state) {
      if (state.config.accounts.length > 0) {
        return true;
      }
      return false;
    },
    showAdvancedOptions: function (state) {
      return state.settings.showAdvancedOptions;
    },
    useCustomHost: function (state) {
      return state.settings.useCustomHost;
    },
    customURL: function (state) {
      return state.settings.customURL;
    },
    configured: function (state) {
      return state.config.configured;
    },
    lastBalanceUpdated: function (state) {
      if (state.config.updatedBalances) {
        return new Date(state.config.updatedBalances).toUTCString();
      } return null;
    }
  },
	// should be private:
	mutations: {
		updateLanguage: function (state, language) {
			state.language = language;
		},
    updatePrimaryAccount: function (state, account) {
      state.config.accounts.forEach(function (existingAccount) {
        if (existingAccount.bazoaddress === account.bazoaddress) {
          existingAccount.isPrime = true;
        } else {
          existingAccount.isPrime = false;
        }
      });
    },
    deleteAccount: function (state, account) {
      let accountToBeDeleted = state.config.accounts.find((candidate) => {
        return candidate.bazoaddress === account.bazoaddress
      });
      let indexToBeDeleted = state.config.accounts.indexOf(accountToBeDeleted);
      state.config.accounts.splice(indexToBeDeleted, 1);
    },
    updateConfig: function (state, account) {
      if (account.bazoaddress && account.bazoname) {
        if (account.isPrime) {
          state.config.accounts.forEach(function (existingAccount) {
            existingAccount.isPrime = false
          })
        }
        let newAccount = {
          bazoaddress: account.bazoaddress,
          bazoname: account.bazoname,
          isPrime: account.isPrime || false
        };
        state.config.accounts.push(newAccount);
        state.config.configured = true;
      } else {
        console.log('invalid config');
      }
    },
    setAdvancedOptionsShown: function (state, shown) {
      state.settings.showAdvancedOptions = shown;
    },
    setCustomHostUsed: function (state, shown) {
      state.settings.useCustomHost = shown;
    },
    setCustomURL: function (state, url) {
      state.settings.customURL = url;
    },
		setOffline: function (state, offline) {
			state.offline = offline;
		}
	},
	// should be public:
	actions: {
		initialize: function (context) {
			// if (!context.state.offline) {
			// 	if (context.state.auth.authenticated) {
			// 		return context.dispatch('updateUser').then(() => {
			// 			return context.dispatch('updateUserBalance');
			// 		});
			// 	} else {
			// 		context.commit('clearUser');
			// 		context.commit('clearUserBalance');
			// 		return Promise.resolve();
			// 	}
			// }
		},
		updateUserBalance: function (context, host) {
      let addresses = context.state.config.accounts.map(account => account.bazoaddress);
      HttpService.queryAccountInfo(addresses, host).then((responses) => {
        context.state.config.updatedBalances = new Date();
        responses.forEach((res) => {
          if (res.body.address) {
            let accountToUpdateBalance = context.state.config.accounts.find((candidate) => {
              return candidate.bazoaddress === res.body.address
            });
            accountToUpdateBalance.balance = res.body.balance
          }
        })
      }).catch(() => {
        Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineError'));
      });
      // context.state.config.accounts.forEach(function (account) {
      //   HttpService.queryAccountInfo(account.bazoaddress, host).then((res) => {
      //     context.state.config.updatedBalances = new Date();
      //     account.balance = res.body.balance;
      //   }).catch(() => {
      //     account.balance = '?';
      //     // Vue.toasted.global.warnNoIcon(Translation.t('toasts.offlineError'));
      //   })
      // })
		},
		updateLanguage: function (context, language) {
			return context.commit('updateLanguage', language);
		},
    updateConfig: function (context, config) {
      return context.commit('updateConfig', config);
    },
    setAdvancedOptionsShown: function (context, shown) {
      return context.commit('setAdvancedOptionsShown', shown);
    },
    setCustomHostUsed: function (context, used) {
      return context.commit('setCustomHostUsed', used);
    },
    setCustomURL: function (context, url) {
      return context.commit('setCustomURL', url);
    },
    updatePrimaryAccount: function (context, account) {
      return context.commit('updatePrimaryAccount', account);
    },
    deleteAccount: function (context, account) {
      return context.commit('deleteAccount', account);
    },
		setOffline: function (context, offline) {
			context.commit('setOffline', !!offline);
		}
	},
	plugins: [
		// persists vuex state to localstorage (only the given paths)
		PersistedState({
			key: 'coinblesk_vuex_store',
			paths: [ 'auth', 'user', 'language', 'userBalance', 'config', 'settings' ]
		})
	]
});

export default store;
