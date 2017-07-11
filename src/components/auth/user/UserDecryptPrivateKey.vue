<template>
<div>
	<b-modal id="user-decrypt-private-key" :title="$t('userDecryptPrivateKey.title')"
		size="md" :hide-footer="true" @hidden="modalWasClosed">
		<div>
			<b-form-fieldset :label="$t('userDecryptPrivateKey.passPhrase')">
				<b-form-input type="password" v-model="passPhrase" @input="formIsTouched = false" :class="{ 'form-error': !validPassPhrase && formIsTouched }"></b-form-input>
			</b-form-fieldset>
			<div class="error-description" v-if="formIsTouched && !validPassPhrase">
				<i class="fa fa-warning"></i>
				{{ $t('userDecryptPrivateKey.errorDescription') }}
			</div>
			<b-button variant="primary" class="pull-right" @click.prevent="submit">{{ $t('userDecryptPrivateKey.submit') }}</b-button>
		</div>
	</b-modal>
</div>
</template>

<script>
import CryptoService from '@/services/CryptoService';

export default {
	name: 'user-decrypt-private-key',
	data: function () {
		return {
			passPhrase: '',
			validPassPhrase: false,
			formIsTouched: false
		}
	},
	props: {
		encryptedPrivateKey: String
	},
	methods: {
		submit: function () {
			this.formIsTouched = true;
			try {
				const privateKeyWif = CryptoService.decrypt(this.passPhrase, this.encryptedPrivateKey);
				this.validPassPhrase = true;
				this.$emit('private-key-decrypted', privateKeyWif);
				this.$root.$emit('hide::modal', 'user-decrypt-private-key');
			} catch (e) {
				this.validPassPhrase = false;
			}
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
</style>

<i18n>
{
	"en": {
		"userDecryptPrivateKey": {
			"title": "Decrypt your private key",
			"passPhrase": "Pass Phrase",
			"submit": "Submit",
			"errorDescription": "This pass phrase is incorrect. Please try again."
		}
	},
	"de": {
		"userDecryptPrivateKey": {
			"title": "Pass Phrase benötigt",
			"passPhrase": "Passphrase",
			"submit": "Abschicken",
			"errorDescription": "Diese Pass Phrase ist ungülitg. Bitte versuchen Sie es erneut."
		}
	}
}
</i18n>
