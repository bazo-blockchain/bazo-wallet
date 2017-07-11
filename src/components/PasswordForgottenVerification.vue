<template>
<div class="password-forgotten-verification login-registration">
	<div class="compact">
		<div class="form-box bordered-box">
			<div class="main-title display-7">{{ $t('passwordForgottenVerification.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('passwordForgottenVerification.email')">
					<b-form-input v-model="emailInput" type="email" :class="{ 'form-error': !validEmail && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset>
					<label class="col-form-label" for="passwordForgottenVerification-tokenInput">
						{{ $t('passwordForgottenVerification.token') }}
						<b-popover triggers="hover" :content="$t('passwordForgottenVerification.tokenInfo')">
							<i class="fa fa-info-circle increase-focus"></i>
						</b-popover>
					</label>
					<b-form-input v-model="tokenInput" id="passwordForgottenVerification-tokenInput" type="text" :class="{ 'form-error': !validToken && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('passwordForgottenVerification.newPassword')">
					<b-form-input v-model="newPassword" type="password" :class="{ 'form-error': !validNewPassword && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('passwordForgottenVerification.newPasswordRepeat')">
					<b-form-input v-model="newPasswordRepeat" type="password" :class="{ 'form-error': !validNewPasswordRepeat && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="submit" :block="true" variant="primary" :disabled="isLoading">{{ $t('passwordForgottenVerification.submit') }}</b-button>
			</form>
		</div>
	</div>
</div>
</template>

<script>
import Router from '@/config/Router';
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';

export default {
	name: 'password-forgotten-verification',
	data () {
		return {
			isLoading: false,
			emailInput: '',
			tokenInput: '',
			newPassword: '',
			newPasswordRepeat: '',
			formIsTouched: false
		}
	},
	computed: {
		validEmail: function () {
			return UtilService.EMAIL_REGEX.test(this.emailInput);
		},
		validToken: function () {
			if (!this.tokenInput) { return false; }
			return this.tokenInput.length === UtilService.TOKEN_LENGTH;
		},
		validNewPassword: function () {
			if (!this.newPassword) { return false; }
			return !(this.newPassword.length < UtilService.PASSWORD_MIN_LENGTH);
		},
		validNewPasswordRepeat: function () {
			if (!this.validNewPassword) { return false; }
			return this.newPassword === this.newPasswordRepeat;
		},
		validForm: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail && this.validToken && this.validNewPassword && this.validNewPasswordRepeat;
		}
	},
	props: {
		email: String,
		token: String
	},
	watch: {
		// necessary, if somebody changes the URL, and the view is not rerendered completely
		email: function () {
			this.emailInput = this.email;
		},
		token: function () {
			this.tokenInput = this.token;
		}
	},
	mounted: function () {
		this.emailInput = this.email;
		this.tokenInput = this.token;

		this.$emit('toggle-header', false);
		this.$emit('toggle-side-bar-triangle', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestory: function () {
		this.$emit('toggle-header', true);
		this.$emit('toggle-side-bar-triangle', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		submit: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;
				const data = { email: this.emailInput, token: this.tokenInput, newPassword: this.newPassword };

				HttpService.forgotPasswordVerification(data, true).then(() => {
					this.$toasted.global.success(this.$t('passwordForgottenVerification.success'));
					this.isLoading = false;
					Router.push({ path: '/login' });
				}, () => {
					this.$toasted.global.warn(this.$t('passwordForgottenVerification.invalidTokenOrEmail'));
					this.isLoading = false;
				});
			} else {
				this.$toasted.global.warn(this.$t('toasts.validationError'));
			}
		}
	}
};
</script>

<style lang="scss" scoped>
label {
	.fa {
		cursor: help;
		color: rgba(0,0,0,0.5);
	}
	> div {
		display: inline-block;
	}
}
</style>

<i18n>
{
	"en": {
		"passwordForgottenVerification": {
			"title": "Password Forgotten",
			"email": "E-Mail Address",
			"token": "Activation Key",
			"newPassword": "New Password",
			"newPasswordRepeat": "Repeat New Password",
			"submit": "Submit",
			"success": "Your password has been successfully reset. Please log in now.",
			"invalidTokenOrEmail": "The provided activation key or e-mail address is incorrect.",
			"tokenInfo": "The activation key was sent to you by e-mail."
		}
	},
	"de": {
		"passwordForgottenVerification": {
			"title": "Password vergessen",
			"email": "E-Mail Adresse",
			"token": "Aktivierungsschlüssel",
			"newPassword": "Neues Passwort",
			"newPasswordRepeat": "Neues Passwort wiederholen",
			"submit": "Abschicken",
			"success": "Sie haben Ihr Passwort erfolgreich geändert. Bitte loggen Sie sich jetzt ein.",
			"invalidTokenOrEmail": "Der Aktivierungsschlüssel oder die E-Mail Adresse ist inkorrekt.",
			"tokenInfo": "Der Aktivierungsschlüssel wurde Ihnen per E-Mail zugeschickt."
		}
	}
}
</i18n>
