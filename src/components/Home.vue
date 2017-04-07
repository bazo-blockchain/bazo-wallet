<template>
<div class="home">
	<div class="main-photo text-center">
		<h1 class="display-1">Coin<i class="fa fa-bitcoin"></i>lesk</h1>
		<div class="buttons" v-if="!user.authenticated">
			<b-button :variant="'secondary'" :to="{ name: 'login' }">
				<i class="fa fa-sign-in"></i> {{ $t('home.login') }}
			</b-button>
		</div>
		<div class="buttons" v-else>
			<b-button :variant="'secondary'" :to="{ name: 'secure' }">
				<i class="fa fa-lock"></i> {{ $t('home.securePage') }}
			</b-button>
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
			user: Auth.user
		}
	},
	i18n: {
		messages: {
			en: {
				home: {
					login: 'Sign In',
					securePage: 'Secure Page'
				}
			},
			de: {
				home: {
					login: 'Anmelden',
					securePage: 'Sichere Seite'
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
	
	.display-1 {
		color: white;
		font-weight: 300;
		text-shadow: 0px 7px 13px rgba(0,0,0,0.4);
	}
	.buttons {
		margin-top: 7vh;
	}
}
</style>
