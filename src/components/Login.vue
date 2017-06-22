<template>
<div class="login login-registration">
	<div class="container">
		<div class="col-md-4 offset-md-4">
			<img class="logo" src="../assets/about_cb_2.png">
		</div>
		<div class="form-box bordered-box col-md-4 offset-md-4">
			<div class="main-title display-7">{{ $t('login.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('login.email')">
					<b-form-input v-model="email" type="text"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('login.password')">
					<b-form-input v-model="password" type="password"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="login" :block="true" variant="primary" :disabled="isLoading">{{ $t('login.submit') }}</b-button>
			</form>
			<div class="links-below">
				<router-link :to="{ name: 'password-forgotten' }" class="password-forgotten">{{ $t('login.forgotPassword') }}</router-link>
				<router-link :to="{ name: 'registration' }" class="sign-up">{{ $t('login.signUp') }}</router-link>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '@/services/Http';

export default {
	name: 'test',
	data: function () {
		return {
			email: '',
			password: '',
			isLoading: false
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
			if (!this.isLoading) {
				this.isLoading = true;

				const credentials = { email: this.email, password: this.password };
				const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';

				Http.login(credentials).then((response) => {
					return this.$store.dispatch('updateAuth', response.body.token);
				}, (response) => {
					if (response.status === 406) {
						this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
					} else if (/^4/.test(response.status.toString())) {
						this.$toasted.global.warn(this.$t('toasts.wrongPassword'));
					}
					this.isLoading = false;
					return Promise.reject();
				}).then(() => {
					return this.$store.dispatch('updateUser');
				}).then(() => {
					this.$toasted.global.successNoIcon('<i class="fa fa-sign-in"></i>' + this.$t('toasts.signedIn'));
					if (redirect) {
						this.$router.push({ path: redirect });
					}
				}, () => {
					this.isLoading = false;
					this.$toasted.global.error(this.$t('toasts.internalError'));
					this.$store.dispatch('logout');
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import '../styles/variables';

.login-registration {
	margin: 0;
	width: 100%;
	padding-top: 10vh;
	height: 100vh;
	/* height with navbar: 
	height: calc(100vh - #{$navbarHeight}); */
	
	.logo {
		width: 70%;
		margin: 0 auto 8vmin;
		display: block;
	}
	
	.form-box {
		padding: 20px;
		background: #efefef;
		border-radius: 5px;
		box-shadow: 0 0 5em rgba(0,0,0,0.4);
		margin-bottom: 20px;
	}
	
	.main-title {
		text-align: center;
		margin-bottom: 20px;
	}
	
	.form-group {
		margin-bottom: 5px;
	}
	
	.btn.btn-primary {
		margin-top: 25px;
		cursor: pointer;
	}
	.links-below {
		text-align: right;
		margin-top: 20px;
		font-size: 85%;
		&:after {
			content: "";
			display: block;
			clear: both;
		}
		:first-child {
			float: left;
		}
		:last-child {
			float: right;
		}
	}
}
</style>

<style lang="scss" scoped>
@import '../styles/variables';

.login {
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
			"email": "E-Mail",
			"password": "Password",
			"submit": "Sign in",
			"signUp": "Sign up now!",
			"forgotPassword": "Forgot your password?"
		}
	},
	"de": {
		"login": {
			"title": "Anmelden",
			"email": "E-Mail Adresse",
			"password": "Passwort",
			"submit": "Anmelden",
			"signUp": "Jetzt registrieren!",
			"forgotPassword": "Passwort vergessen?"
		}
	}
}
</i18n>
