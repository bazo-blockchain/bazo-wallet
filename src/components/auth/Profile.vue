<template>
	<div class="profile">
		<div class="container">
			<h1>{{ $t('profile.title', { user: user.email }) }}</h1>
			<pre>{{ user }}</pre>
			<pre>{{ auth }}</pre>
		</div>
	</div>
</template>

<script>
import Auth from '../../services/Auth';

export default {
	name: 'profile',
	data: () => {
		return {
			auth: Auth.auth
		};
	},
	computed: {
		user: function () {
			return this.$store.state.user;
		}
	},
	i18n: {
		messages: {
			en: {
				profile: {
					title: 'Profile of {user}'
				}
			},
			de: {
				profile: {
					title: 'Profil von {user}'
				}
			}
		}
	}
};
</script>
