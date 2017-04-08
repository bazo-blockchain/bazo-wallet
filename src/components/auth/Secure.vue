<template>
<div class="secure">
	<div class="container">
		{{ message }}
	</div>
</div>
</template>

<script>
export default {
	name: 'test',
	data: function () {
		return {
			message: 'You have reached a very secure website!'
		}
	}
};
</script>
