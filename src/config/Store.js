import Vue from 'vue';
import Vuex from 'vuex';
import PersistedState from 'vuex-persistedstate'
import HttpService from '@/services/HttpService';
import Translation from '@/config/Translation';

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
      sumOfBalances: 0,
      updatedBalances: null
    },
    settings: {
      showAdvancedOptions: 'hidden',
      useCustomHost: 'false',
      customURL: 'https://oysyone.westeurope.cloudapp.azure.com/'
    },
    surpriseRequests: [],
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
    surpriseRequests: function (state) {
      return state.surpriseRequests;
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
    sumOfBalances: function (state) {
      let sum = 0
      for (var i = 0; i < state.config.accounts.length; i++) {
        let candidate = state.config.accounts[i].balance;
        if (!isNaN(candidate)) {
          sum += Number(candidate)
        }
      }
      return sum;
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

        let newAccount = {
          bazoaddress: account.bazoaddress,
          balance: 'unconfirmed',
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
		},
    setAccountBalance: function (state, accountData) {
      // eslint-disable-next-line
      var accountToUpdateBalance = helpers.findAccountByAddress(
        state.config.accounts, accountData.address
      );
      // Overwrite the existing completely in order to make sure that the
      // reactivity system works as expected
      accountToUpdateBalance = {...accountToUpdateBalance, balance: accountData.balance}
    },
    setFundingRequestState: function (state, opts) {
      state.surpriseRequests.forEach((funding) => {
        if (funding.ticketid === opts.ticketid) {
          funding.state = opts.newstate
        }
      })
    },
    updateTimeStamp: function (state) {
      state.config.updatedBalances = new Date();
    },
    addAccountRequest: function (state, request) {
      state.surpriseRequests.push(request);
    }
	},
	// should be public:
	actions: {
		initialize: function (context) {

		},
    updateFundingStates: function (context, options) {
      let ids = context.state.surpriseRequests.map(ticket => ticket.ticketid);
      if (ids.length > 0) {
        HttpService.queryFundingRequestStates(ids, options.silent)
        .then((responses) => {
          window.dbg = responses
          // TODO: Save the updated values
          // for (var i = 0; i < context.state.surpriseRequests.length; i++) {
          //   if (context.state.surpriseRequests[i].ticketid === responses[0]) {
          //
          //   }
          // }
        })
        .catch(() => {
          // TODO move this to the success handler and remove pseudoanswer!
          let pseudoanswer = {
            'status': 'OK',
            'response': {
              'id': 2,
              'user_id': 11,
              'public_key': context.state.config.accounts[0].bazoaddress,
              'amount': '-304.39',
              'status': 'processed',
              'created_at': '2018-01-19T15:15:30.000+01:00',
              'updated_at': '2018-01-19T15:15:30.000+01:00'
            }
          }
          context.commit('setFundingRequestState', {
            ticketid: ids[0],
            newstate: pseudoanswer.response.status
          })
        })
      }
    },
		updateUserBalance: function (context, options) {
      let addresses = context.state.config.accounts.map(account => account.bazoaddress);
      if (addresses.length > 0) {
        HttpService.queryAccountInfo(addresses, options.url, options.silent).then((responses) => {
          let accountMutationsFound = false;
          responses.forEach((res) => {
            if (res.body.content.address) {
              let accountToUpdateBalance = helpers.findAccountByAddress(
                context.state.config.accounts, res.body.content.address
              );
              if (accountToUpdateBalance.balance !== res.body.content.balance) {
                accountMutationsFound = true;
              }
              accountToUpdateBalance.balance = res.body.content.balance
              context.commit('setAccountBalance', {balance: res.body.content.balance, address: res.body.content.address})
            }
          })
            context.commit('updateTimeStamp');
            if (!options.silent) {
              Vue.toasted.global.success(Translation.t('userAccounts.alerts.completeQuery'));
            }
            try {
              if (Notification && Notification.permission === 'granted' && (document.visibilityState !== 'visible' || !location.href.match(/accounts/))) {
                  if (accountMutationsFound) {
                    let notification = new Notification('OySy Wallet', {
                        icon: '/static/img/icons/android-chrome-192x192.png',
                        body: Translation.t('userAccounts.alerts.accountMutationDetected')
                    })
                    notification.onclick = function (event) {
                      event.preventDefault();
                      window.open(location.href.split('#')[0] + '#/accounts', '_blank')
                    }
                  }
              }
            } catch (e) {
              if (!options.silent && accountMutationsFound) {
                Vue.toasted.global.success(Translation.t('userAccounts.alerts.accountMutationDetected'));
              }
            }
        }).catch((err) => {
          console.log(err);
          if (!options.silent) {
            Vue.toasted.global.error(Translation.t('userAccounts.alerts.failedConnection'));
          }
        });
      }
		},
    addAccountRequest: function (context, request) {
      return context.commit('addAccountRequest', request)
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
			key: 'oysy_vuex_store',
			paths: [ 'auth', 'user', 'language', 'userBalance', 'config', 'settings', 'surpriseRequests' ]
		})
	]
});

export default store;
