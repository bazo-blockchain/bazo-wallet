<template>
<div class="registration">
	<div class="container">
		<div class="main-title">Registration</div>
		<div class="login-box bordered-box col-md-4">
			test!
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'registration',
	data: function () {
		return {
			test: ''
		}
	},
	mounted: function () {
		this.$emit('toggle-header', false);
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
	}
};
</script>

<style lang="scss" scoped>
</style>
