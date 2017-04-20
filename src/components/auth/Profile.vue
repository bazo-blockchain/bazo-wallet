<template>
	<div class="profile">
		<div class="container">
			<h1 class="display-4">{{ $t('profile.title', { user: user.email }) }}</h1>
			<hr>
			<h2 class="display-7">{{ $t('profile.information.title') }}</h2>
			<pre><code>{{ user }}</code></pre>
			<pre><code>{{ auth }}</code></pre>
			<hr>
			<h2 class="display-7">Switch your language</h2>
			<a class="btn btn-link" @click="setLanguage('de')">
				<i class="flag-icon flag-icon-de"></i>
				{{ $t('language.de') }}
			</a>
			<a class="btn btn-link" @click="setLanguage('en')">
				<i class="flag-icon flag-icon-en"></i>
				{{ $t('language.en') }}
			</a>
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
		},
		currentLanguage: function () {
			return this.$locale.current();
		}
	},
	methods: {
		setLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
			this.$toasted.global.success(this.$t('toasts.languageSwitched', { language: this.$t('language.' + this.currentLanguage) }));
		}
	},
	i18n: {
		messages: {
			en: {
				profile: {
					title: 'Profile of {user}',
					information: {
						title: 'Information about your profile'
					}
				}
			},
			de: {
				profile: {
					title: 'Profil von {user}',
					information: {
						title: 'Informationen über Ihr Profil'
					}
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.btn.btn-link {
	cursor: pointer;
}
pre {
	background-color: #f7f7f9;
	border-radius: 0.25rem;
	padding: 15px 15px;
}
</style>
