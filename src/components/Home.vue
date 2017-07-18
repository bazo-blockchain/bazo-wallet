<template>
<div class="home">
	<div class="main-photo text-center">
		<div class="logos">
			<a href="https://github.com/coinblesk" target="_blank" rel="noopener" title="Open Source, Github"><img src="../assets/about_opensource.png" alt="Open Source"></a>
			<a href="http://www.ifi.uzh.ch" target="_blank" rel="noopener" title="Institute of Informatics, University of Zurich"><img src="../assets/about_ifi.png" alt="IfI"></a>
			<a href="http://www.uzh.ch" target="_blank" rel="noopener" title="University of Zurich"><img src="../assets/about_uzh.png" alt="UZH"></a>
		</div>
	</div>
</div>
</template>

<script>
export default {
	// the home component must be offline available,
	// otherwise the routing breaks (it's the fallback
	// page of every other page, which is not available
	// offline)
	name: 'home',
	offline: true,

	data: function () {
		return {};
	},
	mounted: function () {
		// if redirected from 404, header might not be visible (if before page was login, registration etc.)
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');

		this.$emit('toggle-header-transparent', true);
		this.$emit('toggle-side-bar', true);
		this.$emit('toggle-side-bar-triangle', false);
	},
	beforeDestroy: function () {
		this.$emit('toggle-header-transparent', false);
		this.$emit('toggle-side-bar-triangle', true);
	}
};
</script>

<style lang="scss" scoped>
.home {
	margin-top: 0;
}

.main-photo {
	background-image: url('../assets/001-large.jpg');
	width: 100%;
	height: 100vh;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: 50% 44%;
	position: relative;
	box-shadow: inset 2px 0 16px rgba(0,0,0,0.3);
	
	.main-logo {
		width: 60vmin;
	}
	
	.logos {
		position: absolute;
		bottom: 10px;
		right: 10px;
		img {
			height: 70px;
		}
	}
}
</style>

