import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-persistedstate'
import HttpService from '@/services/HttpService';
import Translation from '@/config/Translation';
import Sha3 from 'js-sha3';

Vue.use(Vuex);

const helpers = {
  findAccountByAddress: (accounts, address) => {
    return accounts.find((candidate) => {
      return candidate.bazoaddress === address
    });
  },
  formatDateAndTime: (date) => {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let time = date.toLocaleTimeString();

    return `${day} ${monthNames[monthIndex]} ${year}, ${time}`;
  }
};

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
    findAccountByAddress: function (state, address) {
      return helpers.findAccountByAddress(state.config.accounts, address)
    },
    customURL: function (state) {
      return state.settings.customURL;
    },
    configured: function (state) {
      return state.config.configured;
    },
    lastBalanceUpdated: function (state) {
      if (state.config.updatedBalances) {
        let formattedDate = helpers.formatDateAndTime(new Date(state.config.updatedBalances))
        return formattedDate;
      } return null;
    },
    totalBalance: function (state) {
      let visited = []
      return state.config.accounts.reduce(function (acc, val) {
        if (val && val.balance && Number(val.balance) && (visited.indexOf(val.bazoaddress) === -1)) {
          visited.push(val.bazoaddress);
          return acc + val.balance;
        } else {
          return acc;
        }
      }, 0);
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
      const makeFirstAccountPrimary = () => {
        if (state.config.accounts.length > 0) {
          state.config.accounts[0].isPrime = true;
        } else {
          state.config.configured = false;
        }
      }

      let accountToBeDeleted = helpers.findAccountByAddress(state.config.accounts, account.bazoaddress);
      let needToUpdatePrimary = accountToBeDeleted.isPrime;
      let indexToBeDeleted = state.config.accounts.indexOf(accountToBeDeleted);

      state.config.accounts.splice(indexToBeDeleted, 1);

      if (needToUpdatePrimary) {
        makeFirstAccountPrimary();
      }
    },
    updateConfig: function (state, account) {
      if (account.bazoaddress && account.bazoname) {
        if (account.isPrime) {
          state.config.accounts.forEach(function (existingAccount) {
            existingAccount.isPrime = false
          })
        }
        let addressHash = '';
        try {
          addressHash = Sha3.sha3_256(account.bazoaddress);
        } catch (e) {
          addressHash = '';
        }
        let newAccount = {
          bazoaddress: account.bazoaddress,
          bazoname: account.bazoname,
          isPrime: account.isPrime || false,
          hash: addressHash
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

		},
		updateUserBalance: function (context, host) {
      let addresses = context.state.config.accounts.map(account => account.bazoaddress);
      HttpService.queryAccountInfo(addresses, host).then((responses) => {
        let errorsFound = false;
        let accountsFound = false;
        responses.forEach((res) => {
          if (res.body.address) {
            let accountToUpdateBalance = helpers.findAccountByAddress(
              context.state.config.accounts, res.body.address
            );
            accountToUpdateBalance.balance = res.body.balance
            accountsFound = true;
          } else {
            errorsFound = true;
          }
        })
        if (errorsFound & accountsFound) {
          Vue.toasted.global.warnNoIcon(Translation.t('userAccounts.alerts.incompleteQuery'));
        } else if (errorsFound & !accountsFound) {
          Vue.toasted.global.error(Translation.t('userAccounts.alerts.failedQuery'));
        } else if (!errorsFound & accountsFound) {
          Vue.toasted.global.success(Translation.t('userAccounts.alerts.completeQuery'));
          context.state.config.updatedBalances = new Date();
        }
      }).catch(() => {
         Vue.toasted.global.error(Translation.t('userAccounts.alerts.failedConnection'));
      });
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
