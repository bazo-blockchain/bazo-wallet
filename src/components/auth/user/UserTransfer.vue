<template>
<div>
	<b-modal :id="'user-transfer'" :title="$t('userTransfer.title')"
		size="md" :hide-footer="true" @hidden="modalWasClosed">
		<div>
			<div class="alert alert-info" v-html="$t('userTransfer.description', { amount })"></div>
			<b-form-fieldset :label="$t('userTransfer.passPhrase')">
				<b-form-input type="password" v-model="privateKey" @input="formIsTouched = false" @keyup.enter="submit" :class="{ 'form-error': !validPassPhrase && formIsTouched }"></b-form-input>
			</b-form-fieldset>
			<div class="error-description" v-if="formIsTouched && !validPassPhrase">
				<i class="fa fa-warning"></i>
				{{ $t('userTransfer.errorDescription') }}
			</div>
      hash: {{this.transactionHash}}
			<b-button variant="primary" class="pull-right" @click.prevent="submit">{{ $t('userTransfer.submit') }}</b-button>
			<b-button variant="default" class="pull-right" @click.prevent="hideModal">{{ $t('userTransfer.cancel') }}</b-button>
		</div>
	</b-modal>
</div>
</template>

<script>
import elliptic from 'elliptic';
import HttpService from '@/services/HttpService';

export default {
	name: 'user-transfer',
	data: function () {
		return {
			privateKey: '',
			validPassPhrase: false,
			formIsTouched: false,
      // eslint-disable-next-line
      ec: new elliptic.ec('p256')
		}
	},
	props: {
		transactionHash: String,
		amount: Number
	},
	methods: {
		submit: function () {
      let that = this;
			this.formIsTouched = true;
			try {
				this.validPassPhrase = true;
				// this.$emit('private-key-decrypted', privateKeyWif);
        let key = this.ec.keyFromPrivate(this.privateKey)
        let sig = key.sign(this.transactionHash);
        let result = '';
        result = sig.r.toJSON() + sig.s.toJSON();

        HttpService.sendSignedFundsTx(this.transactionHash, result).then(() => {
          that.$toasted.global.success(this.$t('userTransfer.sendSuccess'));
          that.hideModal();
        }).catch(() => {
          that.$toasted.global.warn(this.$t('userTransfer.sendError'));
          that.hideModal();
        });
			} catch (e) {
				this.validPassPhrase = false;
			}
		},
		hideModal: function () {
			this.$root.$emit('hide::modal', 'user-transfer');
		},
		modalWasClosed: function () {
			this.privateKey = '';
			// this.validPassPhrase = false;
		}
	}
  // mounted: function () {
  //   console.log('mounted', this.transactionHash, this.amount);
  // }
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
			"passPhrase": "Private Key",
			"submit": "Transfer",
			"cancel": "Cancel",
			"errorDescription": "This pass phrase is incorrect. Please try again.",
			"description": "You are about to transfer <b>{amount} Bazo coins</b>. Please enter your private to sign the transaction and finish the transaction process. Your private key will <b>not</b> get sent over the network.",
      "sendError": "The transaction could not be sent to the Bazo network.",
      "sendSuccess": "The transaction was successfully sent to the Bazo network."
    }
	},
	"de": {
		"userTransfer": {
			"title": "Zahlung bestätigen",
			"passPhrase": "Privater Schlüssel",
			"submit": "Überweisen",
			"cancel": "Abbrechen",
			"errorDescription": "Diese Pass Phrase ist ungültig. Bitte versuchen Sie es erneut.",
			"description": "Sie sind im Begriff <b>{amount} Bazo coins</b> zu überweisen. Geben Sie bitte Ihren privaten Schlüssel ein, um die Transaktion zu signieren und abzuschliessen. Der Schlüssel wird dabei nicht versandt.",
      "sendError": "Die Transaktion konnte nicht ins Bazo Netzwerk gesendet werden.",
      "sendSuccess": "Die Transaktion wurde erfolgreich <b>versendet</b>."
		}
	}
}
</i18n>
