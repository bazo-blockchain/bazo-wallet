<template>
<div class="footer">
	{{ test }}
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
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #333;
	color: white;
}
</style>
