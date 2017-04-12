<template>
<div class="login">
	<div class="container">
		<div class="main-title">Coin<i class="fa fa-bitcoin"><span>&#3647;</span></i>lesk</div>
		<div class="login-box bordered-box col-md-4">
			<form>
				<b-form-fieldset :label="$t('login.username')">
					<b-form-input v-model="username" type="text"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('login.password')">
					<b-form-input v-model="password" type="password"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="login" :block="true" variant="primary" :disabled="isLoading">{{ $t('login.submit') }}</b-button>
			</form>
			<div class="forgot-password-sign-up">
				<a class="forgot-password" href @click.prevent="forgotPassword">{{ $t('login.forgotPassword') }}</a>
				<a class="sign-up" href @click.prevent="signUp">{{ $t('login.signUp') }}</a>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import Auth from '../services/Auth';

export default {
	name: 'test',
	data: function () {
		return {
			username: '',
			password: '',
			isLoading: false
		}
	},
	mounted: function () {
		this.$emit('toggle-header', false);
		this.$emit('toggle-footer', false);
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
		this.$emit('toggle-footer', true);
	},
	methods: {
		login: function () {
			if (!this.isLoading) {
				this.isLoading = true;
				const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
				const credentials = { username: this.username, password: this.password };
				Auth.login(credentials, redirect).then(() => {
					this.isLoading = false;
				});
			}
		},
		signUp: function () {
			console.log('sign up');
		},
		forgotPassword: function () {
			console.log('forgot password');
		}
	},
	i18n: {
		messages: {
			en: {
				login: {
					title: 'Sign In',
					username: 'User Name',
					password: 'Password',
					submit: 'Sign in',
					signUp: 'Sign up now!',
					forgotPassword: 'Forgot your password?'
				}
			},
			de: {
				login: {
					title: 'Anmelden',
					username: 'Benutzername',
					password: 'Passwort',
					submit: 'Anmelden',
					signUp: 'Jetzt registrieren!',
					forgotPassword: 'Passwort vergessen?'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';
.main-title {
	font-size: 3em;
	color: white;
	text-shadow: 0 0 1em rgba(0,0,0,0.4);
	text-align: center;
	margin-bottom: 1em;
}
.login {
	margin: 0;
	width: 100%;
	background: #4e4e4e;
	padding-top: 20vh;
	height: 100vh;
	/* height with navbar: 
	height: calc(100vh - #{$navbarHeight}); */
}
.login-box {
	padding: 20px;
	background: #efefef;
	margin: 0 auto;
	border-radius: 5px;
	box-shadow: 0 0 5em rgba(0,0,0,0.4);
}
.btn.btn-primary {
	margin-top: 25px;
	cursor: pointer;
}
.form-group {
	margin-bottom: 5px;
}
.forgot-password-sign-up {
	text-align: right;
	margin-top: 20px;
	font-size: 85%;
	&:after {
		content: "";
		display: block;
		clear: both;
	}
	
	.sign-up {
		float: left;
	}
	.forgot-password {
		float: right;
	}
}
</style>
