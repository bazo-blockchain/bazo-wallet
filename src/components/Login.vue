<template>
<div class="login">
	<h1>Login</h1>
	<label>
		<span>Username</span>
		<input v-model="username" type="text" placeholder="Username">
	</label>
	<label>
		<span>Password</span>
		<input v-model="password" type="password" placeholder="Password">
	</label>
	<button @click="authenticate">Login</button>
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
	}
};
</script>

<style lang="scss" scoped>
label {
	display: block;
	> span {
		display: inline-block;
		width: 100px;
	}
}
</style>
