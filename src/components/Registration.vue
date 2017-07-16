<template>
<div class="registration login-registration">
	<div class="compact">
		<div class="form-box bordered-box" :class="{ 'large': stepNumber === 2 }">
			<div class="main-title display-7">{{ $t('registration.title') }}
				<small>&ndash; {{ $t('registration.titleStep', { step: stepNumber }) }}</small>
			</div>
			<hr>
			<form v-if="stepNumber === 1">
				<b-form-fieldset :label="$t('registration.email')">
					<b-form-input v-model="email" type="email" :class="{ 'form-error': !validEmail && formIsTouched }" :disabled="emailGiven"></b-form-input>
				</b-form-fieldset>
				<b-form-fieldset v-if="tokenGiven">
					<label class="col-form-label" for="registration-token">
						{{ $t('registration.token') }}
						<b-popover triggers="hover" :content="$t('registration.tokenDescription')" class="popover-element">
							<i class="fa fa-info-circle increase-focus"></i>
						</b-popover>
					</label>
					<b-form-input id="registration-token" v-model="token" type="text" :disabled="true"></b-form-input>
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
						<a href="/terms" target="_blank" rel="noopener">{{ $t('registration.acceptTerms2') }}</a>.
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
					<div class="passphrase-strength">
						<div class="bar" :class="passPhraseStrengthClasses.size">
							<div class="text">
								{{ $t('registration.size') }}
							</div>
						</div>
						<div class="bar" :class="passPhraseStrengthClasses.letters">
							<div class="text">A-Z, a-z</div>
						</div>
						<div class="bar" :class="passPhraseStrengthClasses.numbers">
							<div class="text">012345...</div>
						</div>
						<div class="bar" :class="passPhraseStrengthClasses.special">
							<div class="text">$@!</div>
						</div>
					</div>
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
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import CryptoService from '@/services/CryptoService';

export default {
	name: 'registration',
	data: function () {
		return {
			isLoading: false,
			email: '',
			token: '',
			emailGiven: false,
			tokenGiven: false,
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
	props: {
		emailArg: String,
		tokenArg: String
	},
	computed: {
		validEmail: function () {
			return UtilService.EMAIL_REGEX.test(this.email);
		},
		validPassword: function () {
			if (!this.password) { return false; }
			return !(this.password.length < UtilService.PASSWORD_MIN_LENGTH);
		},
		validPasswordRepeat: function () {
			if (!this.validPassword) { return false; }
			return this.password === this.passwordRepeat;
		},
		validAcceptTerms: function () {
			return !!this.acceptTerms;
		},
		passPhraseStrengthClasses: function () {
			const passPhraseStrength = CryptoService.passwordStrength(this.passPhrase);

			const classes = {
				size: this.passPhrase.length > 0 ? {
					'red': !passPhraseStrength.okay.size && !passPhraseStrength.good.size,
					'orange': passPhraseStrength.okay.size && !passPhraseStrength.good.size,
					'green': passPhraseStrength.okay.size && passPhraseStrength.good.size } : {},
				letters: this.passPhrase.length > 0 ? {
					'red': !passPhraseStrength.okay.letters && !passPhraseStrength.good.letters,
					'orange': passPhraseStrength.okay.letters && !passPhraseStrength.good.letters,
					'green': passPhraseStrength.okay.letters && passPhraseStrength.good.letters } : {},
				numbers: this.passPhrase.length > 0 ? {
					'red': !passPhraseStrength.okay.numbers && !passPhraseStrength.good.numbers,
					'orange': passPhraseStrength.okay.numbers && !passPhraseStrength.good.numbers,
					'green': passPhraseStrength.okay.numbers && passPhraseStrength.good.numbers } : {},
				special: this.passPhrase.length > 0 ? {
					'red': !passPhraseStrength.okay.special && !passPhraseStrength.good.special,
					'orange': passPhraseStrength.okay.special && !passPhraseStrength.good.special,
					'green': passPhraseStrength.okay.special && passPhraseStrength.good.special } : {}
			};
			return classes;
		},
		validPassPhrase: function () {
			if (!this.passPhrase) { return false; }
			const passPhraseStrength = CryptoService.passwordStrength(this.passPhrase);
			return (passPhraseStrength.okay.size && passPhraseStrength.okay.letters && passPhraseStrength.okay.numbers && passPhraseStrength.okay.special)
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
		this.emailGiven = !!this.emailArg;
		this.tokenGiven = !!this.tokenArg;
		this.email = this.emailArg;
		this.token = this.tokenArg;
		this.$emit('toggle-header', false);
		this.$emit('toggle-side-bar-triangle', false);
		this.$emit('set-body-background', 'dark');
	},
	beforeDestroy: function () {
		this.$emit('toggle-header', true);
		this.$emit('toggle-side-bar-triangle', true);
		this.$emit('set-body-background', 'white');
	},
	watch: {
		emailArg: function () {
			this.stepNumber = 1;
			this.emailGiven = !!this.emailArg;
			this.email = this.emailArg;
		},
		tokenArg: function () {
			this.stepNumber = 1;
			this.tokenGiven = !!this.tokenArg;
			this.token = this.tokenArg;
		}
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
						var key = CryptoService.createKey();
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
					clientPrivateKeyEncrypted: CryptoService.encrypt(this.passPhrase, this.privateKey),
					clientPublicKey: this.publicKey,
					lockTime: Math.floor(new Date() / 1000) + 3600 * 24 * 100
				};

				// if special registration with token
				if (this.token) {
					data['unregisteredToken'] = this.token;

					HttpService.registerWithToken(data, true).then((response) => {
						this.isLoading = false;
						this.$toasted.global.success(this.$t('registration.successWithToken'), { duration: 6000 });
						Router.push({ name: 'login' });
					}, (response) => {
						this.$toasted.global.warn(this.$t('toasts.validationError'));
						this.isLoading = false;
					});
				} else {
					HttpService.register(data, true).then((response) => {
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
				}
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
	.fa-info-circle {
		cursor: help;
	}
	.popover-element {
		display: inline-block;
		vertical-align: middle;
		margin-left: 3px;
	}
	.passphrase-strength {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		width: 100%;
		border-spacing: 10px 10px;
		padding-top: 5px;
		padding-bottom: 18px;
		
		.bar {
			height: 4px;
			background: #ddd;
			position: relative;
			width: auto;
			margin-right: 7px;
			flex: 1;
			position: relative;
			transition: 0.2s ease background-color;
			border-radius: 2px;
			
			&:first-child {
				margin-left: 2px;
			}
			&:last-child {
				margin-right: 2px;
			}
			
			&.red {
				background-color: #ff6e6e;
			}
			&.orange {
				background-color: #fbbf51;
			}
			&.green {
				background-color: #74c274;
			}
			
			.text {
				display: block;
				text-align: center;
				white-space: nowrap;
				font-size: 11px;
				padding-top: 6px;
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
			"token": "Registration Token",
			"tokenDescription": "This token, together with your e-mail address, gives you access to your received funds after the registration.",
			"password": "Password",
			"passwordRepeat": "Repeat Password",
			"acceptTerms1": "I accept the",
			"acceptTerms2": "terms and conditions",
			"submitToNextStep": "Next Step",
			"success": "<b>Please check your e-mails for the activation key.</b>",
			"successWithToken": "You have successfully been registered. Please log in now.",
			"userAlreadyExistsError": "A user with this e-mail address already exists.",
			"privateKey": "Private Key",
			"publicKey": "Public Key",
			"passPhrase": "Pass Phrase",
			"passPhraseRepeat": "Repeat Pass Phrase",
			"submit": "Submit",
			"accountCreationInfo": "We've created a Bitcoin account for you. The private key will be stored in encrypted form on the server. Please enter a secret pass phrase to encrypt the private key. <b>Attention: Afterwards, you cannot change the pass phrase anymore.</b>",
			"goBack": "Go back to step 1",
			"size": "Length"
		}
	},
	"de": {
		"registration": {
			"title": "Registrierung",
			"titleStep": "Schritt {step}/2",
			"email": "E-Mail Adresse",
			"token": "Registrierungsschlüssel",
			"tokenDescription": "Mit der Kombination aus Ihrer E-Mail Adresse und diesem Schlüssel haben Sie Zugriff auf die erhaltenen Geld-Beträge nach der Registrierung.",
			"password": "Passwort",
			"passwordRepeat": "Passwort wiederholen",
			"acceptTerms1": "Ich akzeptiere die",
			"acceptTerms2": "AGBs",
			"submitToNextStep": "Weiter zum nächsten Schritt",
			"success": "<b>Bitte entnehmen Sie den Aktivierungsschlüssel Ihren E-Mails.</b>",
			"successWithToken": "Sie haben sich erfolgreich registriert. Bitte loggen Sie sich jetzt ein.",
			"userAlreadyExistsError": "Diese E-Mail-Adresse wird bereits verwendet.",
			"privateKey": "Privater Schlüssel",
			"publicKey": "Öffentlicher Schlüssel",
			"passPhrase": "Pass-Phrase",
			"passPhraseRepeat": "Pass-Phrase wiederholen",
			"submit": "Abschicken",
			"accountCreationInfo": "Wir haben für Sie ein Bitcoin-Konto angelegt. Der private Schlüssel wird verschlüsselt auf dem Server gespeichert. Geben Sie eine geheime Pass-Phrase ein, um den Schlüssel zu verschlüsseln. <b>Achtung: Sie können diese Pass-Phrase nicht mehr ändern.</b>",
			"goBack": "Zurück zu Schritt 1",
			"size": "Länge"
		}
	}
}
</i18n>
