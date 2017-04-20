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
import Http from '@/services/Http';
import Router from '@/config/Router';

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
			return /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(this.email);
		},
		validPassword: function () {
			if (this.password) {
				return !(this.password.length < 6);
			} else {
				return false;
			}
		},
		validPasswordRepeat: function () {
			if (!this.validPassword) {
				return false;
			}
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
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
	},
	methods: {
		register: function () {
			this.formIsTouched = true;

			if (this.validForm) {
				this.isLoading = true;
				Http.register({ email: this.email, password: this.password }).then((response) => {
					this.isLoading = false;
					this.$toasted.global.success(this.$t('registration.success'), { duration: 6000 });
					Router.push({ name: 'activation', params: { email: this.email } });
				}, () => {
					this.isLoading = false;
				});
			}
		}
	},
	i18n: {
		messages: {
			en: {
				registration: {
					title: 'Registration',
					email: 'E-Mail',
					password: 'Password',
					passwordRepeat: 'Repeat Password',
					acceptTerms1: 'I accept the',
					acceptTerms2: 'terms and conditions',
					submit: 'Register',
					success: 'You have been registered successfully. Please check your e-mails for the activation key.'
				}
			},
			de: {
				registration: {
					title: 'Registrierung',
					email: 'E-Mail Adresse',
					password: 'Passwort',
					passwordRepeat: 'Passwort wiederholen',
					acceptTerms1: 'Ich akzeptiere die',
					acceptTerms2: 'AGBs',
					submit: 'Registrieren',
					success: 'Sie haben sich erfolgreich registriert. Bitte entnehmen Sie den Aktivierungsschlüssel Ihren E-Mails.'
				}
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
