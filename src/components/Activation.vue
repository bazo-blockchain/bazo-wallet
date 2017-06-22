<template>
<div class="activation login-registration">
	<div class="container">
		<div class="col-md-4 offset-md-4">
			<img class="logo" src="../assets/about_cb_2.png">
		</div>
		<div class="form-box bordered-box col-md-4 offset-md-4">
			<div class="main-title display-7">{{ $t('activation.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('activation.email')">
					<b-form-input v-model="emailInput" type="email" :class="{ 'form-error': !validEmail && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset>
					<label class="col-form-label" for="activation-tokenInput">
						{{ $t('activation.token') }}
						<b-popover triggers="hover" :content="$t('activation.tokenInfo')">
							<i class="fa fa-info-circle increase-focus"></i>
						</b-popover>
					</label>
					<b-form-input v-model="tokenInput" id="activation-tokenInput" type="text" :class="{ 'form-error': !validToken && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="activate" :block="true" variant="primary" :disabled="isLoading">{{ $t('activation.submit') }}</b-button>
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
	name: 'activation',
	data () {
		return {
			isLoading: false,
			emailInput: '',
			tokenInput: '',
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
		validForm: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail && this.validToken;
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
		this.$emit('set-body-background', 'dark');
		if (this.emailInput && this.tokenInput) {
			this.activate();
		}
	},
	beforeDestory: function () {
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		activate: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;
				HttpService.activate({ email: this.emailInput, token: this.tokenInput }, true).then(() => {
					this.$toasted.global.success(this.$t('activation.success'));
					this.isLoading = false;
					Router.push({ path: '/login' });
				}, () => {
					this.$toasted.global.warn(this.$t('activation.invalidTokenOrEmail'));
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
		"activation": {
			"title": "Account Activation",
			"email": "E-Mail",
			"token": "Activation Key",
			"submit": "Activate",
			"success": "You have been successfully activated. Please log in now.",
			"invalidTokenOrEmail": "The provided activation key or e-mail address is incorrect.",
			"tokenInfo": "The activation key was sent to you by e-mail."
		}
	},
	"de": {
		"activation": {
			"title": "Kontoaktivierung",
			"email": "E-Mail Adresse",
			"token": "Aktivierungsschlüssel",
			"submit": "Aktivieren",
			"success": "Sie haben Ihr Konto erfolgreich aktiviert. Bitte loggen Sie sich jetzt ein.",
			"invalidTokenOrEmail": "Der Aktivierungsschlüssel oder die E-Mail Adresse ist inkorrekt.",
			"tokenInfo": "Der Aktivierungsschlüssel wurde Ihnen per E-Mail zugeschickt."
		}
	}
}
</i18n>
