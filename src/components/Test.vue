<template>
<div class="test">
	text {{ test123 }}
	<button @click="authenticate">Authenticate</button>
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
			Auth.login(this, { username: 'contact@schrepfer.io', password: 'test123' }, false);
		}
	}
};
</script>

<style>
</style>
