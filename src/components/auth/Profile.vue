<template>
	<div class="profile">
		<div class="container">
			<h1 class="display-4">{{ $t('profile.title') }}
				<small class="text-muted">{{ user.email }}</small>
				<span class="user-role badge badge-primary" v-if="auth.role === 'ROLE_ADMIN'">ADMIN</span>
			</h1>
			<hr>
			<span class="display-7 language-title">{{ $t('profile.switchLanguage') }}:</span>
			<span class="language-buttons">
				<a class="btn btn-link" @click="setLanguage('de')">
					<i class="flag-icon flag-icon-de"></i>
					{{ $t('language.de') }}
				</a>
				<a class="btn btn-link" @click="setLanguage('en')">
					<i class="flag-icon flag-icon-en"></i>
					{{ $t('language.en') }}
				</a>
			</span>
			<div v-if="user.balance == 0">
				<hr>
				<h2 class="display-7">
					<i class="fa fa-warning"></i>
					{{ $t('profile.balanceOverZero.title') }} ({{ user.balance }} satoshi):
				</h2>
				<p>{{ $t('profile.balanceOverZero.description') }}</p>
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
					title: 'Profile',
					switchLanguage: 'Change to your preferred language',
					balanceOverZero: {
						title: 'You have coins left on this platform',
						description: 'This feature is not supported anymore. Please contact the support to withdraw the remaining coins.'
					}
				}
			},
			de: {
				profile: {
					title: 'Profil',
					switchLanguage: 'Sprache wechseln',
					balanceOverZero: {
						title: 'Sie haben verbleibende Bitcoins auf dieser Platform',
						description: 'Diese Funktion ist nicht mehr unterstützt. Bitte wenden Sie sich an den Support für eine Auszahlung.'
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
.user-role {
	position: absolute;
	top: 0;
	font-size: 16px;
	margin-left: 10px;
}
.language-title {
	display: inline-block;
	vertical-align: middle;
	margin-right: 10px;
}
.language-buttons {
	display: inline-block;
	vertical-align: middle;
}
</style>
