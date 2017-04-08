<template>
<div class="footer" v-if="shown">
	<div class="container">
		<hr>
		<span class="message">Coin<i class="fa fa-bitcoin"><span>&#3647;</span></i>lesk 2017</span>
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
	},
	props: {
		shown: Boolean
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
