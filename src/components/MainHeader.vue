<template>
<div class="header">
	{{ test }}
	<pre>{{ user }}</pre>
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

<style lang="scss" scoped>
.header {
	background: #eee;
}
</style>
