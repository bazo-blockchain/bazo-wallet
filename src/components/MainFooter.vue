<template>
<div class="footer">
	<div class="container">
		<hr>
		<span class="message">Coin<i class="fa fa-bitcoin"></i>lesk 2017</span>
	</div>
</div>
</template>

<script>
export default {
	name: 'main-footer',
	data: function () {
		return {
			test: 'footer'
		}
	}
};
</script>

<style lang="scss" scoped>
.footer {
	.message {
		font-weight: 500;
	}
}
</style>
