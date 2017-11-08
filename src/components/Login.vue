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
               <b-table striped hover responsive :items="this.tableRows" :fields="this.fields">
                 <template slot="table-caption">
                  This is a table caption.
                </template>
               </b-table>
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
			isLoading: false,
		}
	},
  computed: {
    fields () {
      return {
        bazoname: {
          label: this.$t('userAccounts.fields.bazoname'),
          sortable: false
        },
        bazoaddress: {
          label: this.$t('userAccounts.fields.bazoaddress'),
          sortable: false
        }
      }
    },
    allAccounts () {
      return this.$store.getters.bazoAccounts;
    },
    tableRows () {
      return JSON.parse(JSON.stringify(this.allAccounts));
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
