<template>
  <div>
    <b-modal :id="'user-transfer'" :title="$t('userTransfer.title') + formatTransactionHash(this.transactionHash)"
    size="md" :hide-footer="true" @hidden="modalWasClosed">
    <div>
      <div class="alert alert-info" v-html="$t('userTransfer.description', { amount })"></div>
      <b-form-fieldset :label="$t('userTransfer.passPhrase')">
        <b-form-input type="password" autocomplete="current-password" v-model="privateKey" @input="formIsTouched = false" @keyup.enter="submit"
                      :class="{ 'form-error': !validPassPhrase && formIsTouched }" ></b-form-input>
      </b-form-fieldset>
      <div class="error-description" v-if="formIsTouched && !validPassPhrase">
        <i class="fa fa-warning"></i>
        {{ $t('userTransfer.errorDescription') }}
      </div>
      <b-button variant="primary" class="pull-right" :disabled="!validKey" @click.prevent="submit">{{ $t('userTransfer.submit') }}</b-button>
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
  computed: {
    usingCustomHost: function () {
      return this.$store.getters.useCustomHost === 'true';
    },
    customURLUsed: function () {
      if (this.usingCustomHost) {
        return this.$store.getters.customURL;
      } return null;
    },
    validKey: function () {
      return this.privateKey.length >= 63 && this.privateKey.length < 65
    }
  },
	methods: {
		submit: function () {
      let that = this;
			this.formIsTouched = true;
			try {
				this.validPassPhrase = true;

        let key = this.ec.keyFromPrivate(this.privateKey)
        let signature = key.sign(this.transactionHash);
        let signatureHexString = '';
        signatureHexString = signature.r.toJSON() + signature.s.toJSON();

        HttpService.sendSignedFundsTx(
          this.transactionHash,
          signatureHexString,
          that.customURLUsed
        ).then(() => {
          that.$toasted.global.success(this.$t('userTransfer.sendSuccess'));
          that.hideModal();
          that.deleteTransactionData();
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
		},
    deleteTransactionData: function () {
      this.$emit('remove-transaction-data', null);
    },
    formatTransactionHash: function () {
      if (this.transactionHash) {
        let transactionHashSnippet = this.transactionHash.slice(0, 10);
        return ` (${transactionHashSnippet}..)`;
      } return '';
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
			"title": "Confirm pearl transfer",
			"passPhrase": "Private Key",
			"submit": "Transfer",
			"cancel": "Cancel",
			"errorDescription": "This pass phrase is incorrect. Please try again.",
			"description": "You are about to transfer <b>{amount} Bazo pearls</b>. Please enter your private key to sign the transaction and finish the transaction process. We will <b>not</b> send your key over the network.",
      "sendError": "The transaction could not be sent to the Bazo network.",
      "sendSuccess": "The transaction was successfully sent to the Bazo network."
    }
	},
	"de": {
		"userTransfer": {
			"title": "Perlen Versand bestätigen",
			"passPhrase": "Privater Schlüssel",
			"submit": "Überweisen",
			"cancel": "Abbrechen",
			"errorDescription": "Diese Pass Phrase ist ungültig. Bitte versuchen Sie es erneut.",
			"description": "Sie sind im Begriff <b>{amount} Bazo Perlen</b> zu überweisen. Geben Sie bitte Ihren privaten Schlüssel ein, um die Transaktion zu signieren und abzuschliessen. Wir versenden deinen Schlüssel nicht übers Netzwerk.",
      "sendError": "Die Transaktion konnte nicht ins Bazo Netzwerk gesendet werden.",
      "sendSuccess": "Die Transaktion wurde erfolgreich <b>versendet</b>."
		}
	}
}
</i18n>
