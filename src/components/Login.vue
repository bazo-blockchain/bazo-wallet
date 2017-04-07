<template>
<div class="login container">
	<h1>{{ $t('login.title') }}</h1>
	<label>
		<span>{{ $t('login.username') }}</span>
		<input v-model="username" type="text" :placeholder="$t('login.username')">
	</label>
	<label>
		<span>{{ $t('login.password') }}</span>
		<input v-model="password" type="password" :placeholder="$t('login.password')">
	</label>
	<button @click="authenticate">{{ $t('login.submit') }}</button>
</div>
</template>

<script>
import Auth from '../services/Auth';

export default {
	name: 'test',
	data: function () {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		authenticate: function () {
			const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
			const credentials = { username: this.username, password: this.password };
			Auth.authenticate(this, credentials, redirect);
		}
	},
	i18n: {
		messages: {
			en: {
				login: {
					title: 'Sign In',
					username: 'User Name',
					password: 'Password',
					submit: 'Sign in'
				}
			},
			de: {
				login: {
					title: 'Anmelden',
					username: 'Benutzername',
					password: 'Passwort',
					submit: 'Anmelden'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
label {
	display: block;
	> span {
		display: inline-block;
		width: 110px;
	}
}
</style>
