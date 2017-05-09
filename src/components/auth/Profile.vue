<template>
	<div class="profile">
		<div class="container">
			<h1 class="display-4">{{ $t('profile.title', { user: user.email }) }}</h1>
			<hr>
			<h2 class="display-7">{{ $t('profile.switchLanguage') }}</h2>
			<a class="btn btn-link" @click="setLanguage('de')">
				<i class="flag-icon flag-icon-de"></i>
				{{ $t('language.de') }}
			</a>
			<a class="btn btn-link" @click="setLanguage('en')">
				<i class="flag-icon flag-icon-en"></i>
				{{ $t('language.en') }}
			</a>
			<hr>
			<h2 class="display-7">{{ $t('profile.information.title') }}</h2>
			<div class="row">
				<div class="col-md-6">
					<pre><code>{{ user }}</code></pre>
				</div>
				<div class="col-md-6">
					<pre><code>{{ auth }}</code></pre>
				</div>
			</div>
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
					switchLanguage: 'Change to your preferred language',
					information: {
						title: 'Information about your profile'
					}
				}
			},
			de: {
				profile: {
					title: 'Profil von {user}',
					switchLanguage: 'Sprache wechseln',
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
