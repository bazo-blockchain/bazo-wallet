<template>
<div class="registration login-registration">
	<div class="container">
		<div class="col-md-4 offset-md-4">
			<img class="logo" src="../assets/about_cb_2.png">
		</div>
		<div class="form-box bordered-box" :class="{ 'col-md-4': stepNumber===1, 'offset-md-4': stepNumber===1, 'col-md-6': stepNumber===2, 'offset-md-3': stepNumber===2 }">
			<div class="main-title display-7">{{ $t('registration.title') }}
				<small>&ndash; {{ $t('registration.titleStep', { step: stepNumber }) }}</small>
			</div>
			<hr>
			<form v-if="stepNumber === 1">
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
				<b-button @click.prevent="submitToSecondStep" :block="true" variant="primary" :disabled="isLoading">
					{{ $t('registration.submitToNextStep') }}
				</b-button>
			</form>
			<form v-if="stepNumber === 2" @submit.prevent>
				<div class="alert alert-info" v-html="$t('registration.accountCreationInfo')"></div>
				<div class="row private-public-keys">
					<div class="col-md-6">
						<label class="col-form-label">{{ $t('registration.privateKey') }}</label>
						<div class="form-control short-key-extended">
							<i class="fa fa-spin fa-cog" v-if="privateKey === ''"></i>
							<span v-else>{{ privateKey }}</span>
						</div>
					</div>
					<div class="col-md-6">
						<label class="col-form-label">{{ $t('registration.publicKey') }}</label>
						<div class="form-control short-key-extended">
							<i class="fa fa-spin fa-cog" v-if="publicKey === ''"></i>
							<span v-else>{{ publicKey }}</span>
						</div>
					</div>
				</div>
				<b-form-fieldset :label="$t('registration.passPhrase')">
					<b-form-input v-model="passPhrase" type="password" name="passPhrase" :class="{ 'form-error': !validPassPhrase && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset :label="$t('registration.passPhraseRepeat')">
					<b-form-input v-model="passPhraseRepeat" type="password" name="passPhraseRepeat" :class="{ 'form-error': !validPassPhraseRepeat && formIsTouched }"></b-form-input>
				</b-form-fieldset>
				<hr>
				<div class="row buttons">
					<div class="col-md-6">
						<b-button type="button" @click.prevent="stepNumber = 1" :block="true" variant="default" :disabled="isLoading">
							<i class="fa fa-arrow-left"></i>
							{{ $t('registration.goBack') }}
						</b-button>
					</div>
					<div class="col-md-6">
						<b-button type="submit" @click.prevent="register" :block="true" variant="primary" :disabled="isLoading">
							{{ $t('registration.submit') }}
						</b-button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
</template>

<script>
import Router from '@/config/Router';
import Http from '@/services/Http';
import Util from '@/services/Util';
import Crypto from '@/services/Crypto';

export default {
	name: 'registration',
	data: function () {
		return {
			isLoading: false,
			email: '',
			password: '',
			passwordRepeat: '',
			acceptTerms: false,
			formIsTouched: false,
			stepNumber: 1,
			privateKey: '',
			publicKey: '',
			passPhrase: '',
			passPhraseRepeat: ''
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
		validPassPhrase: function () {
			if (!this.passPhrase) { return false; }
			return !(this.password.length < Util.PASSWORD_MIN_LENGTH);
		},
		validPassPhraseRepeat: function () {
			if (!this.validPassPhrase) { return false; }
			return this.passPhrase === this.passPhraseRepeat;
		},
		validStep1: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validEmail && this.validPassword && this.validPasswordRepeat && this.validAcceptTerms;
		},
		validStep2: function () {
			if (!this.formIsTouched) {
				return true;
			}
			return this.validPassPhrase && this.validPassPhraseRepeat;
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
		submitToSecondStep: function () {
			this.formIsTouched = true;

			if (this.validStep1) {
				this.stepNumber = 2;
				this.formIsTouched = false;

				if (this.privateKey === '' || this.publicKey === '') {
					// wait a few milliseconds to show the keys
					window.setTimeout(() => {
						var key = Crypto.createKey();
						this.publicKey = key.publicKey;
						this.privateKey = key.privateKey;
					}, 1000);
				}
			} else {
				this.$toasted.global.warn(this.$t('toasts.validationError'));
			}
		},
		register: function () {
			this.formIsTouched = true;

			if (this.validStep2) {
				this.isLoading = true;

				const data = {
					email: this.email,
					password: this.password,
					clientPrivateKeyEncrypted: Crypto.encrypt(this.passPhrase, this.privateKey),
					clientPublicKey: this.publicKey
				};

				Http.register(data, true).then((response) => {
					this.isLoading = false;
					this.$toasted.global.success(this.$t('registration.success'), { duration: 10000 });
					Router.push({ name: 'home' });
				}, (response) => {
					// user already exists on 403
					if (response.status === 403) {
						this.$toasted.global.warn(this.$t('registration.userAlreadyExistsError'));
						this.stepNumber = 1;
					// user exists but was deleted on 406
					} else if (response.status === 406) {
						this.$toasted.global.error(this.$t('toasts.userIsDeletedError'));
						this.stepNumber = 1;
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
	.btn.btn-primary,
	.btn.btn-default {
		margin-top: 10px;
	}
	.display-7 small {
		font-weight: 300;
		font-size: 70%;
	}
	.short-key-extended {
		width: 100%;
		cursor: not-allowed;
		background-color: #eceeef;
		text-align: center;
		
		span {
			font-size: 14px;
		}
	}
	.private-public-keys,
	.buttons {
		.col-md-6:first-child {
			padding-right: 7px;
			& + .col-md-6 {
				padding-left: 7px;
			}
		}
	}
}
</style>

<i18n>
{
	"en": {
		"registration": {
			"title": "Registration",
			"titleStep": "Step {step}/2",
			"email": "E-Mail",
			"password": "Password",
			"passwordRepeat": "Repeat Password",
			"acceptTerms1": "I accept the",
			"acceptTerms2": "terms and conditions",
			"submitToNextStep": "Next Step",
			"success": "<b>Please check your e-mails for the activation key.</b>",
			"userAlreadyExistsError": "A user with this e-mail address already exists.",
			"privateKey": "Private Key",
			"publicKey": "Public Key",
			"passPhrase": "Pass Phrase",
			"passPhraseRepeat": "Repeat Pass Phrase",
			"submit": "Submit",
			"accountCreationInfo": "We've created a Bitcoin account for you. The private key will be stored in encrypted form on the server. Please enter a secret pass phrase to encrypt the private key. <b>Attention: Afterwards, you cannot change the pass phrase anymore.</b>",
			"goBack": "Go back to step 1"
		}
	},
	"de": {
		"registration": {
			"title": "Registrierung",
			"titleStep": "Schritt {step}/2",
			"email": "E-Mail Adresse",
			"password": "Passwort",
			"passwordRepeat": "Passwort wiederholen",
			"acceptTerms1": "Ich akzeptiere die",
			"acceptTerms2": "AGBs",
			"submitToNextStep": "Weiter zum nächsten Schritt",
			"success": "<b>Bitte entnehmen Sie den Aktivierungsschlüssel Ihren E-Mails.</b>",
			"userAlreadyExistsError": "Diese E-Mail-Adresse wird bereits verwendet.",
			"privateKey": "Privater Schlüssel",
			"publicKey": "Öffentlicher Schlüssel",
			"passPhrase": "Pass-Phrase",
			"passPhraseRepeat": "Pass-Phrase wiederholen",
			"submit": "Abschicken",
			"accountCreationInfo": "Wir haben für Sie ein Bitcoin-Konto angelegt. Der private Schlüssel wird verschlüsselt auf dem Server gespeichert. Geben Sie eine geheime Pass-Phrase ein, um den Schlüssel zu verschlüsseln. <b>Achtung: Sie können diese Pass-Phrase nicht mehr ändern.</b>",
			"goBack": "Zurück zu Schritt 1"
		}
	}
}
</i18n>
