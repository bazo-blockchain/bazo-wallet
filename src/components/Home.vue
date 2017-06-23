<template>
<div class="home">
	<div class="main-photo text-center">
		<img src="../assets/about_cb_2.png" class="main-logo" alt="Coinblesk">
		<div class="sub-pictures">
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
	height: calc(100vh - 56px);
	background-size: cover;
	background-repeat: no-repeat;
	background-position: 50% 44%;
	padding: 12vh;
	
	.main-logo {
		width: 60vmin;
	}
	
	.sub-pictures {
		margin-top: 6vmin;
		img {
			height: 7vmin;
		}
	}
}
</style>

<i18n>
{
	"en": {
		"home": {
			"login": "Sign In",
			"authenticatedPage": "Auth Page"
		}
	},
	"de": {
		"home": {
			"login": "Anmelden",
			"authenticatedPage": "Auth Seite"
		}
	}
}
</i18n>
