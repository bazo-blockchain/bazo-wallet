<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('userSend.title') }}</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>
			<div v-if="successfulTransaction">
				<div class="alert alert-success">{{ $t('userSend.transactionSuccessful') }}</div>
			</div>
			<div v-else>
				<div class="box-wrapper" v-if="!isLoading">
					<div class="box">
						<div class="main-title display-7">{{ $t('userSend.boxTitle') }}</div>
						<hr>
						<form>
							<b-form-fieldset>
								<label class="col-form-label" for="send-receiver">
									{{ $t('userSend.receiver') }}
									<b-popover triggers="hover" :content="$t('userSend.receiverDescription')" class="popover-element">
										<i class="fa fa-info-circle increase-focus"></i>
									</b-popover>
								</label>
								<b-form-input id="send-receiver" v-model="address" type="text" class="address-input" :placeholder="$t('userSend.receiverPlaceholder')" :class="{ 'form-error': formIsTouched && !validAddress }"></b-form-input>
							</b-form-fieldset>
							
							<div class="row">
								<div class="col-md-8">
									<b-form-fieldset :label="$t('userSend.amount')">
										<b-input-group>
											<b-form-input v-model="amount" class="mono amount-input" type="number" min="0" :class="{ 'form-error': formIsTouched && !validAmount }"></b-form-input>
											<b-input-group-button slot="right">
												<b-dropdown :text="selectedCurrency" variant="default" right>
													<b-dropdown-item v-for="currency in allowedCurrencies" @click="selectedCurrency = currency" :key="currency">
													<span class="currency">{{ currency }}</span>
													<i class="fa fa-check" v-if="currency === selectedCurrency"></i>
													</b-dropdown-item>
												</b-dropdown>
											</b-input-group-button>
										</b-input-group>
									</b-form-fieldset>
								</div>
								<div class="col-md-4">
									<b-form-fieldset>
										<label class="col-form-label">{{ $t('userSend.maxAmount') }}
											<b-popover triggers="hover" :content="$t('userSend.maxAmountDescription')" class="popover-element">
												<i class="fa fa-info-circle increase-focus"></i>
											</b-popover>
										</label>
										<div class="form-control disabled mono" :class="{ 'form-error': formIsTouched && maximumAmountExceeded }">
											{{ convertSatoshiToBitcoin(paymentRequirements.totalLockedAndVirtualBalance) }} BTC
										</div>
									</b-form-fieldset>
								</div>
							</div>
							<div class="description-forex-rate" v-html="$t('userSend.descriptionForexRate', { forex: forexRates[selectedCurrency].rate, currency: selectedCurrency })" v-if="selectedCurrency !== 'BTC'"></div>
							<b-button class="submit-button" :block="true" variant="primary" @click.prevent="submit" :disabled="formIsTouched && !validForm">{{ $t('userSend.button', { amount: btcAmount }) }}</b-button>
						</form>
					</div>
	
					<user-transfer @private-key-decrypted="createAndSubmitTransaction" :encrypted-private-key="paymentRequirements.encryptedClientPrivateKey" :amount="btcAmount"></user-transfer>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import UtilService from '@/services/UtilService';
import HttpService from '@/services/HttpService';
import CryptoService from '@/services/CryptoService';
import UserTransfer from '@/components/auth/user/UserTransfer';
import Spinner from '@/components/Spinner';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			selectedCurrency: 'BTC',
			allowedCurrencies: ['BTC', 'USD', 'EUR', 'CHF'],
			amount: 0,
			address: '',
			forexRates: {
				USD: {},
				EUR: {},
				CHF: {}
			},
			paymentRequirements: {},
			formIsTouched: false,
			successfulTransaction: false
		}
	},
	components: {
		Spinner,
		UserTransfer
	},
	computed: {
		btcAmount: function () {
			if (this.isLoading) {
				return 0;
			}
			let value = 0;
			if (this.selectedCurrency !== 'BTC') {
				value = (this.amount / this.forexRates[this.selectedCurrency].rate);
			} else {
				value = this.amount;
			}
			return Math.round(value * UtilService.SATOSHI_PER_BITCOIN) / UtilService.SATOSHI_PER_BITCOIN;
		},
		validAmount: function () {
			if (this.amount <= 0) {
				return false;
			}
			if (this.maximumAmountExceeded) {
				return false;
			}
			return true;
		},
		maximumAmount: function () {
			if (!this.paymentRequirements.totalLockedAndVirtualBalance) {
				return 0;
			}
			return this.paymentRequirements.totalLockedAndVirtualBalance;
		},
		maximumAmountExceeded: function () {
			return this.maximumAmount * UtilService.SATOSHI_PER_BITCOIN < this.btcAmount;
		},
		validAddress: function () {
			if (this.address === '') {
				return false;
			}
			return UtilService.EMAIL_REGEX.test(this.address) || UtilService.BTC_ADDRESS_REGEX.test(this.address);
		},
		validForm: function () {
			return true;
			// TODO
			// return this.validAmount && this.validAddress;
		}
	},
	methods: {
		loadInitialData: function () {
			return Promise.all([
				HttpService.getForexCurrent('BITSTAMP', 'USD'),
				HttpService.getForexCurrent('BITSTAMP', 'EUR'),
				HttpService.getForexCurrent('BITSTAMP', 'CHF'),
				HttpService.Auth.User.getPaymentRequirements()
			]).then(responses => {
				this.forexRates.USD = responses[0].body;
				this.forexRates.EUR = responses[1].body;
				this.forexRates.CHF = responses[2].body;
				this.paymentRequirements = responses[3].body;
				return Promise.resolve();
			}, () => {
				return Promise.reject();
			});
		},
		submit: function () {
			this.formIsTouched = true;
			if (this.validForm) {
				this.$root.$emit('show::modal', 'user-transfer');
			}
		},
		createAndSubmitTransaction: function (privateKeyWif) {
			this.isLoading = true;

			// TODO
			const receiverAddress = '15hZo812Lx266Dot6T52krxpnhrNiaqHya';
			const amountSatoshi = 15000;
			const inputs = [
				'40696e606a348cbd9e08085f9f4d92dcaef041672798af129fcda28c8a91b259'
			];

			const txBuilder = new window.bitcoin.TransactionBuilder();
			for (let i = 0; i < inputs.length; i++) {
				txBuilder.addInput(inputs[i], i);
			}
			txBuilder.addOutput(receiverAddress, amountSatoshi);

			// signs the first input with the key
			txBuilder.sign(0, window.bitcoin.ECPair.fromWIF(privateKeyWif));

			const tx = txBuilder.build().toHex();
			console.log('transaction: ', tx);

			const signedDto = CryptoService.signDTO(privateKeyWif, tx);
			console.log('signedDTO: ', signedDto);

			// TODO
			// submit transaction to server

			this.successfulTransaction = true;
			this.isLoading = false;
		},
		convertSatoshiToBitcoin: UtilService.convertSatoshiToBitcoin
	},
	mounted: function () {
		this.isLoading = true;
		this.loadInitialData().then(() => {
			this.isLoading = false;
		});
	}
};
</script>

<style lang="scss" scoped>
.user-send {
	.box-wrapper {
		max-width: 650px;
		padding-top: 20px;
		.box {
			width: 100%;
			background: #f8f8f8;
			border: 1px solid #ccc;
			border-radius: 10px;
			padding: 20px;
			.main-title {
				text-align: center;
			}
		}
	}
	.fa.fa-info-circle {
		cursor: help;
	}
	.popover-element {
		display: inline-block;
		vertical-align: middle;
		margin-left: 5px;
	}
	.form-control.mono {
		font-size: 15px;
	}
	.submit-button {
		margin-top: 20px;
	}
	.form-group {
		margin-bottom: 10px;
	}
	.address-input,
	.amount-input {
		position: relative;
		z-index: 10;
	}
	.description-forex-rate {
		margin-top: 10px;
		margin-left: 5px;
		padding-left: 10px;
		border-left: 2px solid #888;
		font-size: 14px;
		padding-bottom: 3px;
		padding-top: 3px;
		font-style: italic;
	}
	/deep/ {
		.dropdown-item {
			cursor: pointer;
			
			.currency + .fa-check {
				font-size: 60%;
				display: inline-block;
				vertical-align: middle;
				margin-left: 5px;
				margin-top: -1px;
			}
		}
		.input-group-btn .btn {
			background: white;
			border: 1px solid rgba(0,0,0,0.15);
			color: inherit;
			font-size: 15px;
			
			.fa {
				font-size: 85%;
				margin-top: -1px;
			}
		}
	}
}
</style>

<i18n>
{
	"en": {
		"userSend": {
			"title": "Send Bitcoins",
			"boxTitle": "Select receiver and amount",
			"receiver": "Receiver (Bitcoin/E-Mail address)",
			"receiverPlaceholder": "Enter a bitcoin or e-mail address",
			"receiverDescription": "If you enter an e-mail address, the recepient obtains a message with a unique token. This token can then be used to claim the funds.",
			"lookup": "Lookup",
			"amount": "Amount",
			"maxAmount": "Maximal amount",
			"maxAmountDescription": "The maximal amount relates to the sum the locked account and the virtual balance. If you except a higher value here, make sure to have your funds on the current locked Coinblesk address (see Funds).",
			"descriptionForexRate": "The current forex rate BTC/{currency} is <span class='mono'>{forex}</span>&nbsp;&nbsp;(Source: Bitstamp).",
			"button": "Send {amount} BTC",
			"transactionSuccessful": "The transaction was successfully executed."
		}
	},
	"de": {
		"userSend": {
			"title": "Bitcoins versenden",
			"boxTitle": "Empfänger und Betrag auswählen",
			"receiver": "Empfänger (Bitcoin/E-Mail Adresse)",
			"receiverPlaceholder": "Bitcoin oder E-Mail Adresse eingeben",
			"receiverDescription": "Falls Sie eine E-Mail Adresse eingeben wird der Empfänger eine Nachricht mit einem Schlüssel erhalten. Mit diesem Schlüssel hat er Zugriff auf die erhaltenen Beträge.",
			"lookup": "Suchen",
			"amount": "Betrag",
			"maxAmount": "Maximalbetrag",
			"maxAmountDescription": "Der Maximalbetrag stellt die Summe aus virtuellem Saldo und dem gesperrten Konto dar. Falls Sie hier einen höheren Wert erwarten, überweisen Sie bitte die Funds der bisherigen Addressen auf die aktuelle, gesperrte Coinblesk Adresse (siehe Guthaben).",
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/{currency} beträgt <span class='mono'>{forex}</span>&nbsp;&nbsp;(Quelle: Bitstamp).",
			"button": "{amount} BTC versenden",
			"transactionSuccessful": "Die Transaktion wurde erfolgreich durchgeführt."
		}
	}
}
</i18n>
