<template>
	<div class="profile">
		<div class="container">
			<h1>{{ $t('profile.title', { user: user.data.email }) }}</h1>
			<pre>{{ user }}</pre>
		</div>
	</div>
</template>

<script>
import Auth from '../../services/Auth';

export default {
	name: 'profile',
	data: () => {
		return {
			user: Auth.user
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
