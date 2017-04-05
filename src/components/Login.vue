<template>
<div class="login">
	text {{ test123 }}
	<button @click="authenticate">Login</button>
</div>
</template>

<script>
import Auth from '../services/Auth';

export default {
	name: 'test',
	data: function () {
		return {
			test123: 'test321'
		}
	},
	methods: {
		authenticate: function () {
			const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
			Auth.authenticate(this, { username: 'contact@schrepfer.io', password: 'test123' }, redirect);
		}
	}
};
</script>

<style>
</style>
