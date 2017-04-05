<template>
<div class="header">
	{{ test }}
	<pre>{{ user }}</pre>
	<hr>
</div>
</template>

<script>
import Auth from '../services/Auth.js';

export default {
	name: 'main-header',
	data: function () {
		return {
			test: 'header',
			user: Auth.user
		}
	}
};
</script>

<style>
</style>
