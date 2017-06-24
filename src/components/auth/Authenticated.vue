<template>
<div class="authenticated">
	<div class="compact" v-html="message"></div>
</div>
</template>

<script>
export default {
	name: 'test',
	data: function () {
		return {
			message: 'You have reached a site where you need to be authenticated <b>(USER or ADMIN)</b>.'
		}
	}
};
</script>
