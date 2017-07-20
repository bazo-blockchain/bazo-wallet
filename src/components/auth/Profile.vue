<template>
	<div class="profile">
		<div class="compact">
			<h1 class="display-4">{{ $t('profile.title') }}
				<small class="text-muted">{{ user.email }}</small>
				<span class="user-role badge badge-primary" v-if="auth.role === 'ROLE_ADMIN'">ADMIN</span>
			</h1>
			<hr>
			
			<div class="alert alert-warning" v-if="user.balance > 0">
				<h2 class="display-7">
					<i class="fa fa-warning"></i>
					{{ $t('profile.balanceOverZero.title') }} ({{ convertSatoshiToBitcoin(user.balance) }} BTC)
				</h2>
				{{ $t('profile.balanceOverZero.description') }}
			</div>
			
			<div class="box change-password">
				<spinner :is-loading="passwordChangeIsLoading"></spinner>
				<h2 class="display-7">{{ $t('profile.changePasswordTitle') }}</h2>
				<hr>
				<b-form-fieldset :label="$t('profile.newPassword')">
					<b-form-input type="password" v-model="newPassword" :class="{ 'form-error': !validNewPassword && passwordChangeFormIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('profile.newPasswordRepeat')">
					<b-form-input type="password" v-model="newPasswordRepeat" :class="{ 'form-error': !validNewPasswordRepeat && passwordChangeFormIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="changePassword" variant="primary" class="pull-right">{{ $t('profile.passwordChangeSubmit') }}</b-button>
			</div>
			
			<div class="box switch-language">
				<h2 class="display-7">{{ $t('profile.switchLanguage') }}</h2>
				<hr>
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
			</div>
		
		</div>
	</div>
</template>

<script>
import UtilService from '@/services/UtilService';
import HttpService from '@/services/HttpService';
import Spinner from '@/components/Spinner';

export default {
	name: 'profile',

	data: () => {
		return {
			newPassword: '',
			newPasswordRepeat: '',
			passwordChangeFormIsTouched: false,
			incorrectOldPassword: false,
			passwordChangeIsLoading: false
		};
	},
	components: {
		Spinner
	},
	computed: {
		user: function () {
			return this.$store.state.user;
		},
		auth: function () {
			return this.$store.state.auth;
		},
		currentLanguage: function () {
			return this.$locale.current();
		},
		validNewPassword: function () {
			return !(this.newPassword.length < UtilService.PASSWORD_MIN_LENGTH);
		},
		validNewPasswordRepeat: function () {
			return this.validNewPassword && this.newPassword === this.newPasswordRepeat;
		},
		validPasswordChangeForm: function () {
			if (!this.passwordChangeFormIsTouched) {
				return true;
			}
			return this.validNewPassword && this.validNewPasswordRepeat;
		}
	},
	methods: {
		setLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
			this.$toasted.global.success(this.$t('toasts.languageSwitched', { language: this.$t('language.' + this.currentLanguage) }));
		},
		changePassword: function () {
			this.passwordChangeFormIsTouched = true;
			if (this.validPasswordChangeForm) {
				this.passwordChangeIsLoading = true;
				HttpService.Auth.changePassword({ newPassword: this.newPassword }).then(() => {
					this.$toasted.global.success(this.$t('profile.passwordChangeSuccess'));

					this.passwordChangeFormIsTouched = false;
					this.newPassword = '';
					this.newPasswordRepeat = '';

					this.passwordChangeIsLoading = false;
				}, () => {
					this.passwordChangeIsLoading = false;
				});
			}
		},
		convertSatoshiToBitcoin: UtilService.convertSatoshiToBitcoin
	}
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

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
.alert.alert-warning {
	margin-top: 25px;
}
.box {
	position: relative;
	overflow: hidden;
	box-shadow: 0 0 3px rgba(0,0,0,0.2);
	border-radius: 3px;
	display: inline-block;
	vertical-align: top;
	padding: 20px;
	margin-right: 20px;
	margin-top: 20px;
}
@media (max-width: $breakpoint-hide-header) {
	.box {
		width: 100%;
	}
}
.change-password {
	.form-group {
		margin-bottom: 10px;
	}
	.btn {
		margin-top: 20px;
	}
}
</style>

<i18n>
{
	"en": {
		"profile": {
			"title": "Profile",
			"switchLanguage": "Select Language",
			"changePasswordTitle": "Change your password",
			"newPassword": "New Password",
			"newPasswordRepeat": "Repeat New Password",
			"passwordChangeSubmit": "Change Password",
			"passwordChangeSuccess": "The password has been changed sucessfully.",
			"balanceOverZero": {
				"title": "You have coins left from an old version of Coinblesk",
				"description": "This feature is not supported anymore. Please contact the support to withdraw the remaining coins."
			}
		}
	},
	"de": {
		"profile": {
			"title": "Profil",
			"switchLanguage": "Sprache wechseln",
			"changePasswordTitle": "Passwort ändern",
			"newPassword": "Neues Passwort",
			"newPasswordRepeat": "Neues Passwort wiederholen",
			"passwordChangeSubmit": "Passwort ändern",
			"passwordChangeSuccess": "Das Passwort wurde erfolgreich geändert.",
			"balanceOverZero": {
				"title": "Sie haben verbleibende Bitcoins von einer veralteten Version von Coinblesk",
				"description": "Diese Funktion wird nicht mehr unterstützt. Bitte wenden Sie sich an den Support für eine Auszahlung."
			}
		}
	}
}
</i18n>
