<template>
<div class="user-authenticated">
	<div class="container" v-html="message"></div>
</div>
</template>

<script>
export default {
	name: 'test',
	data: function () {
		return {
			message: 'You have reached a site where you need to be authenticated <b>as a USER</b>.'
		}
	}
};
</script>
