<template>
<div class="spinner" :class="{ 'shown': isLoading }">
	<div class="spinner-element" :class="size"></div>
</div>
</template>

<script>
export default {
	name: 'spinner',
	data: function () {
		return { }
	},
	props: {
		size: {
			default: 'sm',
			type: String
		},
		isLoading: {
			default: true,
			type: Boolean
		}
	}
};
</script>

<style lang="scss" scoped>
.spinner {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 50;
	opacity: 0;
	visibility: hidden;
	transition: 0.3s ease all;
	min-height: 300px;

	&.shown {
		opacity: 1;
		visibility: visible;
	}

	.spinner-element {
		$border-color-bright: #f2f2f2;
		$border-color-dark: black;

		&.md {
			width: 120px;
			height: 120px;
			border: 16px solid $border-color-bright;
			border-top: 16px solid $border-color-dark;
			margin: -60px 0 0 -60px;
		}
		&.sm {
			width: 60px;
			height: 60px;
			border: 6px solid $border-color-bright;
			border-top: 6px solid $border-color-dark;
			margin: -30px 0 0 -30px;
		}

		position: absolute;
		border-radius: 50%;
		left: 50%;
		top: 50%;
		animation: spin 1s linear infinite;
	}
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
