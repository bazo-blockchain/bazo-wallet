<template>
<div>
	<b-modal :id="'user-transfer' + (onlyUnlock ? '-unlock' : '') + (separate ? '-' + separate : '')" :title="!onlyUnlock ? $t('userTransfer.title') : $t('userTransfer.titleUnlock')"
		size="md" :hide-footer="true" @hidden="modalWasClosed">
		<div>
			<div class="alert alert-info" v-html="$t('userTransfer.description', { amount })" v-if="!onlyUnlock"></div>
			<b-form-fieldset :label="$t('userTransfer.passPhrase')">
				<b-form-input type="password" v-model="passPhrase" @input="formIsTouched = false" @keyup.enter="submit" :class="{ 'form-error': !validPassPhrase && formIsTouched }"></b-form-input>
			</b-form-fieldset>
			<div class="error-description" v-if="formIsTouched && !validPassPhrase">
				<i class="fa fa-warning"></i>
				{{ $t('userTransfer.errorDescription') }}
			</div>
			<b-button variant="primary" class="pull-right" @click.prevent="submit">{{ !onlyUnlock ? $t('userTransfer.submit') : $t('userTransfer.submitUnlock') }}</b-button>
			<b-button variant="default" class="pull-right" @click.prevent="hideModal">{{ $t('userTransfer.cancel') }}</b-button>
		</div>
	</b-modal>
</div>
</template>

<script>
import CryptoService from '@/services/CryptoService';

export default {
	name: 'user-transfer',
	data: function () {
		return {
			passPhrase: '',
			validPassPhrase: false,
			formIsTouched: false
		}
	},
	props: {
		encryptedPrivateKey: String,
		amount: Number,
		onlyUnlock: Boolean,
		separate: String
	},
	methods: {
		submit: function () {
			this.formIsTouched = true;
			try {
				const privateKeyWif = CryptoService.decrypt(this.passPhrase, this.encryptedPrivateKey);
				this.validPassPhrase = true;
				this.$emit('private-key-decrypted', privateKeyWif);
				this.hideModal();
			} catch (e) {
				this.validPassPhrase = false;
			}
		},
		hideModal: function () {
			this.$root.$emit('hide::modal', 'user-transfer' + (this.onlyUnlock ? '-unlock' : '') + (this.separate ? '-' + this.separate : ''));
		},
		modalWasClosed: function () {
			this.passPhrase = '';
			this.formIsTouched = false;
			this.validPassPhrase = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.error-description {
	font-size: 14px;
	margin-bottom: 15px;
	color: #db0000;
	padding-left: 3px;
}
.btn-primary,
.btn-default {
	margin-top: 15px;
}
.btn-primary {
	margin-left: 10px;
}
</style>

<i18n>
{
	"en": {
		"userTransfer": {
			"title": "Confirm your payment",
			"titleUnlock": "Unlock your passphrase",
			"passPhrase": "Pass Phrase",
			"submit": "Transfer",
			"submitUnlock": "Submit",
			"cancel": "Cancel",
			"errorDescription": "This pass phrase is incorrect. Please try again.",
			"description": "You are about to transfer <b>{amount} BTC</b>. Please enter your pass phrase to finish the transaction process."
		}
	},
	"de": {
		"userTransfer": {
			"title": "Zahlung bestätigen",
			"titleUnlock": "Passphrase entsperren",
			"passPhrase": "Passphrase",
			"submit": "Überweisen",
			"submitUnlock": "Abschicken",
			"cancel": "Abbrechen",
			"errorDescription": "Diese Pass Phrase ist ungültig. Bitte versuchen Sie es erneut.",
			"description": "Sie sind im Begriff <b>{amount} BTC</b> zu überweisen. Geben Sie bitte Ihre Passphrase ein, um die Transaktion abzuschliessen."
		}
	}
}
</i18n>
