<template>
<div class="registration login-registration">
	<div class="container">
		<div class="col-md-4 offset-md-4">
			<img class="logo" src="../assets/about_cb_2.png">
		</div>
		<div class="form-box bordered-box col-md-4 offset-md-4">
			<div class="main-title display-7">{{ $t('registration.title') }}</div>
			<hr>
			<form>
				<b-form-fieldset :label="$t('registration.email')">
					<b-form-input v-model="email" type="email" :class="{ 'form-error': !validEmail && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('registration.password')">
					<b-form-input v-model="password" type="password" :class="{ 'form-error': !validPassword && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('registration.passwordRepeat')">
					<b-form-input v-model="passwordRepeat" type="password" :class="{ 'form-error': !validPasswordRepeat && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<hr>
				<div class="text-center">
					<b-form-checkbox v-model="acceptTerms" :class="{'form-error': !validAcceptTerms && formIsTouched }">
						{{ $t('registration.acceptTerms1') }}
						<a href="/terms" target="_blank">{{ $t('registration.acceptTerms2') }}</a>.
					</b-form-checkbox>
				</div>
				<b-button @click.prevent="register" :block="true" variant="primary" :disabled="isLoading">
					{{ $t('registration.submit') }}
				</b-button>
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
	name: 'registration',
	data: function () {
		return {
			isLoading: false,
			email: '',
			password: '',
			passwordRepeat: '',
			acceptTerms: false,
			formIsTouched: false
		}
	},
	computed: {
		validEmail: function () {
			return Util.EMAIL_REGEX.test(this.email);
		},
		validPassword: function () {
			if (!this.password) { return false; }
			return !(this.password.length < Util.PASSWORD_MIN_LENGTH);
		},
		validPasswordRepeat: function () {
			if (!this.validPassword) { return false; }
			return this.password === this.passwordRepeat;
		},
		validAcceptTerms: function () {
			return !!this.acceptTerms;
		},
		validForm: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail && this.validPassword && this.validPasswordRepeat && this.validAcceptTerms;
		}
	},
	mounted: function () {
		this.$emit('toggle-header', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
		this.$emit('set-body-background', 'white');
	},
	methods: {
		register: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;
				Http.register({ email: this.email, password: this.password }, true).then((response) => {
					this.isLoading = false;
					this.$toasted.global.success(this.$t('registration.success'), { duration: 10000 });
					Router.push({ name: 'home' });
				}, (response) => {
					// user already exists on 403
					if (response.status === 403) {
						this.$toasted.global.warn(this.$t('registration.userAlreadyExistsError'));
					// user exists but was deleted on 406
					} else if (response.status === 406) {
						this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
					} else {
						this.$toasted.global.warn(this.$t('toasts.validationError'));
					}
					this.isLoading = false;
				});
			} else {
				this.$toasted.global.warn(this.$t('toasts.validationError'));
			}
		}
	}
};
</script>

<!-- login-registration styles are in Login.vue -->
<style lang="scss" scoped>
.registration {
	.btn.btn-primary {
		margin-top: 10px;
	}
}
</style>

<i18n>
{
	"en": {
		"registration": {
			"title": "Registration",
			"email": "E-Mail",
			"password": "Password",
			"passwordRepeat": "Repeat Password",
			"acceptTerms1": "I accept the",
			"acceptTerms2": "terms and conditions",
			"submit": "Register",
			"success": "<b>Please check your e-mails for the activation key.</b>",
			"userAlreadyExistsError": "A user with this e-mail address already exists."
		}
	},
	"de": {
		"registration": {
			"title": "Registrierung",
			"email": "E-Mail Adresse",
			"password": "Passwort",
			"passwordRepeat": "Passwort wiederholen",
			"acceptTerms1": "Ich akzeptiere die",
			"acceptTerms2": "AGBs",
			"submit": "Registrieren",
			"success": "<b>Bitte entnehmen Sie den Aktivierungsschlüssel Ihren E-Mails.</b>",
			"userAlreadyExistsError": "Diese E-Mail-Adresse wird bereits verwendet."
		}
	}
}
</i18n>
