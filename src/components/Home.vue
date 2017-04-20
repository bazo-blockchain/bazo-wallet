<template>
<div class="home">
	<div class="main-photo text-center">
		<img src="../assets/about_cb_2.png" class="main-logo">
		<div class="sub-pictures">
			<a href="https://github.com/coinblesk" target="_blank" title="Open Source, Github"><img src="../assets/about_opensource.png"></a>
			<a href="http://www.ifi.uzh.ch" target="_blank" title="Institute of Informatics, University of Zurich"><img src="../assets/about_ifi.png"></a>
			<a href="http://www.uzh.ch" target="_blank" title="University of Zurich"><img src="../assets/about_uzh.png"></a>
		</div>
	</div>
</div>
</template>

<script>
import Auth from '../services/Auth';

export default {
	name: 'home',

	data: function () {
		return {
			auth: Auth.auth
		}
	},
	i18n: {
		messages: {
			en: {
				home: {
					login: 'Sign In',
					authenticatedPage: 'Auth Page'
				}
			},
			de: {
				home: {
					login: 'Anmelden',
					authenticatedPage: 'Auth Seite'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.home {
	margin-top: 0;
}

.main-photo {
	background-image: url('../assets/001-large.png');
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
