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
				<b-form-fieldset :label="$t('activation.token')">
					<b-form-input v-model="tokenInput" type="text" :class="{ 'form-error': !validToken && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-button @click.prevent="activate" :block="true" variant="primary" :disabled="isLoading">{{ $t('activation.submit') }}</b-button>
			</form>
		</div>
	</div>
</div>
</template>

<script>
import Router from '@/config/Router';
import Http from '@/services/Http';
import Util from '@/services/Util';

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
			return Util.EMAIL_REGEX.test(this.emailInput);
		},
		validToken: function () {
			if (!this.tokenInput) { return false; }
			return this.tokenInput.length === Util.TOKEN_LENGTH;
		},
		validForm: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail && this.validToken;
		}
	},
	props: [
		'email',
		'token'
	],
	mounted: function () {
		this.emailInput = this.email;
		this.tokenInput = this.token;

		this.$emit('toggle-header', false);
		if (this.emailInput && this.tokenInput) {
			this.activate();
		}
	},
	beforeDestory: function () {
		this.$emit('toggle-header', true);
	},
	methods: {
		activate: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;
				Http.activate({ email: this.emailInput, token: this.tokenInput }, true).then(() => {
					this.$toasted.global.success(this.$t('activation.success'));
					this.isLoading = false;
					Router.push({ path: '/login' });
				}, () => {
					this.$toasted.global.warn(this.$t('activation.invalidToken'));
					this.isLoading = false;
				});
			} else {
				this.$toasted.global.warn(this.$t('toasts.validationError'))
			}
		}
	},
	i18n: {
		messages: {
			en: {
				activation: {
					title: 'Account Activation',
					email: 'E-Mail',
					token: 'Activation Key',
					submit: 'Activate',
					success: 'You have been successfully activated. Please log in now.',
					invalidToken: 'The provided activation key is incorrect.'
				}
			},
			de: {
				activation: {
					title: 'Kontoaktivierung',
					email: 'E-Mail Adresse',
					token: 'Aktivierungsschlüssel',
					submit: 'Aktivieren',
					success: 'Sie haben Ihr Konto erfolgreich aktiviert. Bitte loggen Sie sich jetzt ein.',
					invalidToken: 'Der Aktivierungsschlüssel ist inkorrekt.'
				}
			}
		}
	}
};
</script>
