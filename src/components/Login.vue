<template>
  <div class="login login-registration">
    <div class="compact">
      <div class="form-box bordered-box">
        <div class="main-title display-7">{{ $t('login.title') }}</div>
        <hr>
        <form>
          <b-form-fieldset :label="$t('login.bazoaddress')">
            <b-form-input v-model="bazoaddress" type="text"></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset :label="$t('login.bazoname')">
            <b-form-input v-model="bazoname" ></b-form-input>
          </b-form-fieldset>
          <div v-if="configured"
               class="table-responsive">
               <label>{{$t('login.bazoaccounts')}}</label>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">{{$t('login.bazoaccountName')}}</th>
                  <th scope="col">{{$t('login.bazoaccountAddress')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in allAccounts">
                  <td>{{account.bazoname}}</td>
                  <td>{{account.bazoaddress}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-button @click.prevent="login" :block="true" variant="primary" :disabled="isLoading">{{ $t('login.save') }}</b-button>
        </form>
        <!-- <div class="links-below">
          <router-link :to="{ name: 'password-forgotten' }" class="password-forgotten">{{ $t('login.forgotPassword') }}</router-link>
          <router-link :to="{ name: 'registration' }" class="sign-up">{{ $t('login.signUp') }}</router-link>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import HttpService from '@/services/HttpService';

export default {
	name: 'login',
	data: function () {
		return {
			bazoaddress: '',
			bazoname: '',
			isLoading: false
		}
	},
  computed: {
    allAccounts () {
      return this.$store.getters.bazoAccounts;
    },
    configured () {
      return this.$store.getters.accountConfigured;
    }
  },
	mounted: function () {
		this.$emit('toggle-header', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		login: function () {
      const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
			if (!this.isLoading) {
				this.isLoading = true;
        this.$store.dispatch('updateConfig', {
          bazoaddress: this.bazoaddress,
          bazoname: this.bazoname
        }).then(() => {
          this.$router.push({ path: redirect });
        });
				// const credentials = { email: this.email, password: this.password };
				// const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';

				// HttpService.login(credentials, true).then((response) => {
				// 	this.$store.dispatch('updateAuth', response.body.token).then(() => {
				// 		this.$store.dispatch('updateUserBalance');
				// 	});
				// 	this.$store.dispatch('updateUser').then(() => {
				// 		this.$toasted.global.successNoIcon('<i class="fa fa-sign-in"></i>' + this.$t('toasts.signedIn'));
				// 		this.isLoading = false;
				// 		if (redirect) {
				// 			this.$router.push({ path: redirect });
				// 		}
				// 	}, () => {
				// 		this.isLoading = false;
				// 		this.$toasted.global.error(this.$t('toasts.internalError'));
				// 		this.$store.dispatch('logout');
				// 	});
				// }, (response) => {
				// 	if (response.status === 406) {
				// 		this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
				// 	} else if (/^4/.test(response.status.toString())) {
				// 		this.$toasted.global.warn(this.$t('toasts.wrongPassword'));
				// 	}
				// 	this.isLoading = false;
				// });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.login {
  .table-responsive{
    min-height: 130px !important;
    max-height: 200px !important;
    overflow: scroll;
  }
	.sign-up {
		float: left;
	}
	.password-forgotten {
		float: right;
	}
}
</style>

<i18n>
{
	"en": {
		"login": {
			"title": "Sign In",
			"bazoaddress": "Bazo address",
			"bazoname": "Name this account",
			"save": "Add a Bazo address",
      "bazoaccounts": "You have the following Bazo accounts:",
      "bazoaccountName": "Name",
      "bazoaccountAddress": "Address"
		}
	},
	"de": {
		"login": {
			"title": "Anmelden",
			"bazoaddress": "E-Mail Adresse",
			"bazoname": "Name für diesen Account",
			"save": "Bazo Adresse hinzufügen",
      "bazoaccounts": "Folgende Bazo accounts sind gespeichert:",
      "bazoaccountName": "Name",
      "bazoaccountAddress": "Adresse"
		}
	}
}
</i18n>
