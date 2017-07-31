<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('userSend.title') }}</h1>
		<hr>
		<div class="pos-rel user-send-content">
			<spinner :is-loading="isLoading"></spinner>
			<div v-if="successfulTransaction">
				<div class="alert alert-success">{{ $t('userSend.transactionSuccessful') }}</div>
			</div>
			<div v-else>
				<div class="box-wrapper" v-if="!isLoading && !loadingError">
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
											{{ convertSatoshiToBitcoin(maximumAmount) }} BTC
										</div>
									</b-form-fieldset>
								</div>
								<div class="col-12">
									<div class="description-forex-rate" v-html="$t('userSend.descriptionForexRate', { forex: forexRates[selectedCurrency].rate, currency: selectedCurrency })" v-if="selectedCurrency !== 'BTC'"></div>
									<hr>
								</div>
								<div class="fees-included">
									<label>
										<b-form-checkbox v-model="feesIncluded">{{ $t('userSend.feesIncluded') }}
											<b-popover triggers="hover" :content="$t('userSend.feesIncludedDescription')" class="popover-element">
												<i class="fa fa-info-circle increase-focus"></i>
											</b-popover>
										</b-form-checkbox>
									</label>
								</div>
								<div class="col-12">
									<!-- warning threshold is 0.01 BTC fees per transaction, if above: crazy world -->
									<div class="description-fees alert alert-info" v-if="feesIncluded && btcAmount != 0 && btcAmount < 0.01">{{ $t('userSend.lowAmountFeeDescription') }}</div>
									<div class="description-fees alert alert-info" v-if="!feesIncluded && btcAmount != 0 && btcMaximumAmount - btcAmount - 0.01 < 0">{{ $t('userSend.descriptionFees') }}</div>
									<b-button class="submit-button" :block="true" variant="primary" @click.prevent="submitPreparation" :disabled="formIsTouched && !validForm">{{ $t('userSend.button', { amount: btcAmount }) }}</b-button>
								</div>
							</div>
						</form>
					</div>
	
					<user-transfer @private-key-decrypted="submit" :encrypted-private-key="currentTransaction.encryptedPrivateKey" :amount="btcAmount"></user-transfer>
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
import TransactionService from '@/services/TransactionService';
import moment from 'moment';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			selectedCurrency: 'BTC',
			allowedCurrencies: ['BTC', 'USD', 'EUR', 'CHF'],
			amount: 0,
			feesIncluded: true,
			address: '',
			forexRates: {
				USD: {},
				EUR: {},
				CHF: {}
			},
			formIsTouched: false,
			successfulTransaction: false,
			lockedAddress: {},
			currentTransaction: {}
		}
	},
	components: {
		Spinner,
		UserTransfer
	},
	computed: {
		btcAmount: function () {
			if (!this.amount) {
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
			if (!this.$store.state.userBalance ||
					!this.$store.state.userBalance.timeLockedAddresses ||
					typeof this.$store.state.userBalance.timeLockedAddresses[this.lockedAddress.bitcoinAddress] === 'undefined') {
				return 0;
			}
			return this.$store.state.userBalance.timeLockedAddresses[this.lockedAddress.bitcoinAddress] + this.$store.state.userBalance.virtualBalance - this.$store.state.userBalance.channelTransactionAmount;
		},
		btcMaximumAmount: function () {
			return this.maximumAmount * UtilService.SATOSHI_PER_BITCOIN;
		},
		maximumAmountExceeded: function () {
			return this.btcMaximumAmount < this.btcAmount;
		},
		addressIsEmail: function () {
			if (this.address === '') {
				return false;
			}
			return UtilService.EMAIL_REGEX.test(this.address);
		},
		addressIsBitcoin: function () {
			if (this.address === '') {
				return false;
			}
			let result = false;
			try {
				window.bitcoin.address.fromBase58Check(this.address);
				result = true;
			} catch (e) {
				result = false;
			}
			return result;
		},
		validAddress: function () {
			return this.addressIsEmail || this.addressIsBitcoin;
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
				HttpService.Auth.User.getLockedAddress()
			]).then(responses => {
				this.forexRates.USD = responses[0].body;
				this.forexRates.EUR = responses[1].body;
				this.forexRates.CHF = responses[2].body;
				this.lockedAddress = responses[3].body;
				this.loadingError = false;
				this.isLoading = false;
			}, () => {
				this.loadingError = true;
				this.isLoading = false;
			});
		},
		submitPreparation: function () {
			this.formIsTouched = true;
			if (this.validForm) {
				this.isLoading = true;

				Promise.all([
					HttpService.Auth.User.getEncryptedPrivateKey(),
					HttpService.Auth.User.getFees(),
					HttpService.Auth.User.getUTXO(this.lockedAddress.bitcoinAddress),
					HttpService.Auth.User.getChannelTransaction()
				]).then((responses) => {
					this.currentTransaction = {
						encryptedPrivateKey: responses[0].body.encryptedClientPrivateKey,
						feePerByte: responses[1].body.fee,
						inputs: responses[2].body,
						channelTransaction: responses[3].channelTransaction
					}
					this.isLoading = false;
					this.$nextTick(() => {
						this.$root.$emit('show::modal', 'user-transfer');
					});
				}, () => {
					this.isLoading = false;
					this.$toasted.global.warn(this.$t('userSend.paymentError'));
				});
			}
		},
		submit: function (decryptedPrivateKeyWif) {
			this.isLoading = true;
			const errorOccurred = () => {
				this.isLoading = false;
				this.currentTransaction = {};
				this.$toasted.global.warn(this.$t('userSend.paymentError'));
			};
			const success = () => {
				this.isLoading = false;
				this.currentTransaction = {};
				this.successfulTransaction = true;
			};
			const satoshiAmount = this.btcAmount * UtilService.SATOSHI_PER_BITCOIN;

			if (this.addressIsBitcoin) {
				// address is bitcoin address
				try {
					const transaction = TransactionService.buildTransaction({
						privateKeyWif: decryptedPrivateKeyWif,
						inputs: this.currentTransaction.inputs,
						output: this.address,
						amount: satoshiAmount,
						changeOutput: this.lockedAddress.bitcoinAddress,
						feePerByte: this.currentTransaction.feePerByte,
						feesIncluded: this.feesIncluded,
						redeemScript: this.lockedAddress.redeemScript
					});

					// toPublicKey: '' && amount: 0 => external payment
					const dto = {
						tx: transaction,
						fromPublicKey: CryptoService.convertPrivateKeyWifToPublicKeyHex(decryptedPrivateKeyWif),
						toPublicKey: '',
						amount: 0,
						nonce: moment().format('x')
					};
					const signedDTO = CryptoService.signDTO(decryptedPrivateKeyWif, dto);

					HttpService.microPayment(signedDTO, true).then(() => {
						success();
					}, () => {
						errorOccurred();
					});
				} catch (e) {
					errorOccurred();
				}
			} else {
				// address is e-mail address
				if (this.$store.state.userBalance.virtualBalance >= satoshiAmount) {
					// virtual payment
					const dto = {
						receiverEmail: this.address,
						amount: satoshiAmount
					};
					HttpService.Auth.User.virtualPaymentViaEmail(dto, true).then(() => {
						success();
					}, () => {
						errorOccurred();
					});
				} else {
					// micro payment
					try {
						let totalAmount = satoshiAmount;
						if (this.currentTransaction.channelTransaction !== null) {
							const channelTransaction = window.bitcoin.Transaction.fromHex(this.currentTransaction.channelTransaction);
							// TODO evaluate
							let channelTransactionAmount = channelTransaction.outs[0].value;
							totalAmount += channelTransactionAmount;
						}
						const transaction = TransactionService.buildTransaction({
							privateKeyWif: decryptedPrivateKeyWif,
							inputs: this.currentTransaction.inputs,
							output: this.address,
							changeOutput: this.lockedAddress.bitcoinAddress,
							amount: totalAmount,
							feePerByte: this.currentTransaction.feePerByte,
							feesIncluded: this.feesIncluded,
							redeemScript: this.lockedAddress.redeemScript
						});
						const dto = {
							receiverEmail: this.address,
							amount: satoshiAmount,
							transaction: transaction
						};
						HttpService.Auth.User.microPaymentViaEmail(dto, true).then(() => {
							success();
						}, () => {
							errorOccurred();
						})
					} catch (e) {
						errorOccurred();
					}
				}
			}
		},
		convertSatoshiToBitcoin: UtilService.convertSatoshiToBitcoin
	},
	mounted: function () {
		this.isLoading = true;
		this.loadInitialData();
	}
};
</script>

<style lang="scss" scoped>
.user-send {
	.user-send-content {
		min-height: 300px;
	}
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
		margin-top: 6px;
		margin-left: 5px;
		padding-left: 10px;
		border-left: 2px solid #888;
		font-size: 14px;
		padding-bottom: 3px;
		padding-top: 3px;
		font-style: italic;
	}
	.description-fees {
		font-size: 90%;
	}
	.fees-included {
		text-align: center;
		width: 100%;
		
		label {
			display: inline-block;
		}
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
			"title": "Transfer Bitcoins",
			"boxTitle": "Transfer to an E-Mail or Bitcoin address",
			"receiver": "Receiver (Bitcoin/E-Mail address)",
			"receiverPlaceholder": "Enter a bitcoin or e-mail address",
			"receiverDescription": "If you enter an e-mail address, the recepient obtains a message with a unique token. This token can then be used to claim the funds.",
			"lookup": "Lookup",
			"amount": "Amount",
			"feesIncluded": "Fees are included in the amount",
			"feesIncludedDescription": "If the checkbox is checked the fees are subtracted from the transfer amount. The recepient receives an amount which is reduced by the extend of the fees. Alternatively, you are charged by the amount plus fees, the recepient, however, receives the exact amount.",
			"maxAmount": "Maximal amount",
			"maxAmountDescription": "The maximal amount relates to the sum the locked account and the virtual balance. If you except a higher value here, make sure to have your funds on the current locked Coinblesk address (see Funds).",
			"descriptionForexRate": "The current forex rate BTC/{currency} is <span class='mono'>{forex}</span>&nbsp;&nbsp;(Source: Bitstamp).",
			"descriptionFees": "The fees of your Bitcoin transfer are not yet included in the amount and are added to the value. Please make sure, that you have enough funds to create this transaction. Otherwise we have to reject it.",
			"lowAmountFeeDescription": "The amount you are trying to transfer is very small and needs to contain possible transaction fees. It is possible, that the transaction is rejected because the fees might be higher than the remaining transfer amount.",
			"button": "Send {amount} BTC",
			"transactionSuccessful": "The transaction was successfully executed.",
			"paymentError": "An error occurred during the payment process. Please verify the amount (Attention: fees) or try it again later on."
		}
	},
	"de": {
		"userSend": {
			"title": "Bitcoins überweisen",
			"boxTitle": "An eine E-Mail oder Bitcoin Adresse überweisen",
			"receiver": "Empfänger (Bitcoin/E-Mail Adresse)",
			"receiverPlaceholder": "Bitcoin oder E-Mail Adresse eingeben",
			"receiverDescription": "Falls Sie eine E-Mail Adresse eingeben wird der Empfänger eine Nachricht mit einem Schlüssel erhalten. Mit diesem Schlüssel hat er Zugriff auf die erhaltenen Beträge.",
			"lookup": "Suchen",
			"amount": "Betrag",
			"feesIncluded": "Spesen in Betrag einschliessen",
			"feesIncludedDescription": "Wenn die Auswahlbox ausgewählt ist, werden die Spesen vom Betrag abgezogen. Der Empfänger erhält einen um die Spesen verminderten Betrag. Andernfalls wird Ihnen der Betrag plus Spesen berechnet, der Empfänger erhält jedoch den genauen Betrag.",
			"maxAmount": "Maximalbetrag",
			"maxAmountDescription": "Der Maximalbetrag stellt die Summe aus virtuellem Saldo und dem gesperrten Konto dar. Falls Sie hier einen höheren Wert erwarten, überweisen Sie bitte die Guthaben der bisherigen Addressen auf die aktuelle, gesperrte Coinblesk Adresse (siehe Guthaben).",
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/{currency} beträgt <span class='mono'>{forex}</span>&nbsp;&nbsp;(Quelle: Bitstamp).",
			"descriptionFees": "Bei Ihrer Zahlung entstehen voraussichtlich Spesen, welche auf den dargestellten Betrag aufaddiert werden. Vergewissern Sie sich, dass Sie über genügend BTC verfügen, um die Zahlung auszuführen. Andernfalls müssen wir die Zahlung ablehnen.",
			"lowAmountFeeDescription": "Der Betrag, den Sie überweisen möchten ist klein und beinhaltet bereits allfällige Spesen. Womöglich wird diese Transaktion abgelehnt, da die Spesen höher sein könnten als der verbleibende Überweisungsbetrag.",
			"button": "{amount} BTC versenden",
			"transactionSuccessful": "Die Transaktion wurde erfolgreich durchgeführt.",
			"paymentError": "Bei der Zahlung ist ein Fehler aufgetreten. Überprüfen Sie Ihren Betrag (Achtung: Spesen) oder probieren Sie es später erneut."
		}
	}
}
</i18n>
