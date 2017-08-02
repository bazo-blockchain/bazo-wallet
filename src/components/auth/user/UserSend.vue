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
									<b-popover :triggers="['click', 'hover']" :content="$t('userSend.receiverDescription')" class="popover-element">
										<i class="fa fa-info-circle increase-focus"></i>
									</b-popover>
								</label>
								<div class="pos-rel">
									<b-form-input id="send-receiver" v-model="address" type="text" class="address-input" :placeholder="$t('userSend.receiverPlaceholder')" :class="{ 'form-error': formIsTouched && !validAddress }"></b-form-input>
									<span class="camera" @click="openCamera" :title="$t('userSend.openCameraTitle')">
										<i class="fa fa-camera"></i>
									</span>
									<div class="camera-screen" :class="{'shown':cameraShown}" @click="closeCamera">
										<div class="close" @click="closeCamera">&times;</div>
										<div class="camera-notice">{{ $t('userSend.cameraNotice') }}</div>
										<div class="video-wrapper" @click.stop>
											<video></video>
										</div>
									</div>
								</div>
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
											<b-popover :triggers="['click', 'hover']" :content="(addressIsBitcoin || addressIsEmail) ? $t('userSend.maxAmountDescription') : '<b>'+$t('userSend.maxAmountDescriptionIntro')+'</b><hr>' + $t('userSend.maxAmountDescription')" class="popover-element">
												<i class="fa fa-info-circle increase-focus"></i>
											</b-popover>
										</label>
										<div class="form-control disabled mono" :class="{ 'form-error': formIsTouched && maximumAmountExceeded }">
											<span v-if="addressIsBitcoin || addressIsEmail">
												{{ convertSatoshiToBitcoin(maximumAmount) }} BTC
											</span>
											<span v-else>
												<i class="fa fa-minus"></i>
											</span>
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
											<b-popover :triggers="['click', 'hover']" :content="$t('userSend.feesIncludedDescription')" class="popover-element">
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
import Instascan from 'instascan';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			qrScanner: null,
			cameraShown: false,
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
			if (this.addressIsEmail) {
				// if the receiver is an e-mail address, either the virtual amount or the actual amount is transferable
				const fundsOnLockedAddress = this.$store.state.userBalance.timeLockedAddresses[this.lockedAddress.bitcoinAddress] - this.$store.state.userBalance.channelTransactionAmount;
				const fundsOnVirtualAddress = this.$store.state.userBalance.virtualBalance;
				return Math.max(fundsOnLockedAddress, fundsOnVirtualAddress);
			} else if (this.addressIsBitcoin) {
				// if the receiver is a bitcoin address, the amount transferable only includes funds from the locked address minus the channel transaction amount
				return this.$store.state.userBalance.timeLockedAddresses[this.lockedAddress.bitcoinAddress] - this.$store.state.userBalance.channelTransactionAmount;
			} else {
				return 0;
			}
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
			return this.validAmount && this.validAddress;
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
		openCamera: function () {
			this.qrScanner = new Instascan.Scanner({
				video: this.$el.querySelector('.camera-screen video')
			});
			this.qrScanner.addListener('scan', (content) => {
				this.address = content;
				this.closeCamera();
			});
			Instascan.Camera.getCameras().then((cameras) => {
				if (cameras.length > 0) {
					if (cameras.length > 1) {
						// back camera is often index 1
						this.qrScanner.start(cameras[1]);
						this.cameraShown = true;
					} else {
						// only one camera
						this.qrScanner.start(cameras[0]);
						this.cameraShown = true;
					}
				} else {
					this.$toasted.global.warn(this.$t('userSend.cameraError'));
					this.closeCamera();
					console.warn('no cameras found');
				}
			}, (error) => {
				this.$toasted.global.warn(this.$t('userSend.cameraError'));
				this.closeCamera();
				console.warn('error occurred:', error);
			});
		},
		closeCamera: function () {
			if (this.qrScanner !== null) {
				this.qrScanner.stop();
				this.qrScanner = null;
			}
			this.cameraShown = false;
		},
		submitPreparation: function () {
			this.formIsTouched = true;
			if (this.validForm) {
				this.isLoading = true;

				Promise.all([
					HttpService.Auth.User.getEncryptedPrivateKey(),
					HttpService.Auth.User.getFees(),
					HttpService.Auth.User.getUTXO(this.lockedAddress.bitcoinAddress),
					HttpService.Auth.User.getChannelTransaction(),
					HttpService.Auth.User.getServerPotAddress()
				]).then((responses) => {
					this.currentTransaction = {
						encryptedPrivateKey: responses[0].body.encryptedClientPrivateKey,
						feePerByte: responses[1].body.fee,
						inputs: responses[2].body,
						channelTransaction: responses[3].body.channelTransaction,
						serverPotAddress: responses[4].body.serverPotAddress
					};
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
			const errorOccurred = (e) => {
				this.isLoading = false;
				this.currentTransaction = {};
				this.$toasted.global.warn(this.$t('userSend.paymentError'));
				console.warn(e);
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
						errorOccurred('server denied');
					});
				} catch (e) {
					errorOccurred(e);
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
						errorOccurred('server denied');
					});
				} else {
					// micro payment
					try {
						let totalAmount = satoshiAmount;
						if (this.currentTransaction.channelTransaction !== null) {
							const channelTransaction = window.bitcoin.Transaction.fromHex(this.currentTransaction.channelTransaction);
							let channelTransactionAmount = channelTransaction.outs[0].value;
							totalAmount += channelTransactionAmount;
						}
						const transaction = TransactionService.buildTransaction({
							privateKeyWif: decryptedPrivateKeyWif,
							inputs: this.currentTransaction.inputs,
							output: this.currentTransaction.serverPotAddress,
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
							errorOccurred('server denied');
						});
					} catch (e) {
						errorOccurred(e);
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
		.fa-info-circle {
			color: #999;
		}
	}
	.camera {
		font-size: 16px;
		position: absolute;
		right: 0;
		z-index: 99;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
		padding: 7px 10px;
	}
	.camera-screen {
		position: fixed;
		padding: 20px;
		background: rgba(0,0,0,0.9);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999999;
		opacity: 0;
		visibility: hidden;
		transition: 0.25s ease all;
		&.shown {
			opacity: 1;
			visibility: visible;
		}
		
		.camera-notice {
			color: white;
			font-size: 18px;
			font-weight: 300;
			text-align: center;
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70vmin;
			max-height: calc(100vh - 40px);
			overflow: hidden;
		}
		.close {
			color: rgba(255, 255, 255, 0.91);
			font-size: 70px;
			z-index: 9999999;
			position: absolute;
			font-weight: 400;
			top: 10px;
			right: 15px;
			text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.63);
			opacity: 1;
		}
		
		.video-wrapper {
			transform: translate(-50%, -50%);
			position: absolute;
			top: 50%;
			left: 50%;
			padding: 25px;
			video {
				width: calc(100vw - 50px);
				height: calc(100vh - 50px);
			}
		}
	}
	.form-control.mono {
		font-size: 15px;
	}
	.form-group {
		margin-bottom: 10px;
	}
	.address-input,
	.amount-input {
		position: relative;
		z-index: 10;
	}
	.address-input {
		padding-right: 35px;
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
			"maxAmountDescription": "The maximal amount relates to the currently maximal amount which can be transferred to another account. If you have a virtual balance (see <i>Funds</i>), you can pay out these funds to transfer it to another Bitcoin address. E-mail addresses as recipients can either receive funds from virtual balances or from time locked address, which are currently locked.",
			"maxAmountDescriptionIntro": "Please enter an address first, before you can see the maximal amount.",
			"descriptionForexRate": "The current forex rate BTC/{currency} is <span class='mono'>{forex}</span>&nbsp;&nbsp;(Source: Bitstamp).",
			"descriptionFees": "The fees of your Bitcoin transfer are not yet included in the amount and are added to the value. Please make sure, that you have enough funds to create this transaction. Otherwise we have to reject it.",
			"lowAmountFeeDescription": "The amount you are trying to transfer is very small and needs to contain possible transaction fees. It is possible, that the transaction is rejected because the fees might be higher than the remaining transfer amount.",
			"button": "Send {amount} BTC",
			"transactionSuccessful": "The transaction was successfully executed.",
			"paymentError": "An error occurred during the payment process. Please verify the amount (Attention: fees) or try it again later on.",
			"openCameraTitle": "Scan a QR Code of a Bitcoin or e-mail address",
			"cameraError": "The camera could not be accessed.",
			"cameraNotice": "If the camera does not show up here within 5s, you probably did not grant the camera the required permission."
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
			"maxAmountDescription": "Der Maximalbetrag stellt den aktuell höchst möglichen Zahlungsbetrag dar. Falls Sie virtuelles Guthaben haben (siehe <i>Guthaben</i>) können Sie sich dieses Guthaben zunächst auzahlen lassen um an eine Bitcoin-Adresse zu zahlen. E-Mail Adressen können entweder Guthaben aus virtuellem Guthaben oder aber Guthaben auf zeitlich gesperrten Adressen beinhalten.",
			"maxAmountDescriptionIntro": "Geben Sie zunächst eine Adresse ein, um den Maximalbetrag zu sehen.",
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/{currency} beträgt <span class='mono'>{forex}</span>&nbsp;&nbsp;(Quelle: Bitstamp).",
			"descriptionFees": "Bei Ihrer Zahlung entstehen voraussichtlich Spesen, welche auf den dargestellten Betrag aufaddiert werden. Vergewissern Sie sich, dass Sie über genügend BTC verfügen, um die Zahlung auszuführen. Andernfalls müssen wir die Zahlung ablehnen.",
			"lowAmountFeeDescription": "Der Betrag, den Sie überweisen möchten ist klein und beinhaltet bereits allfällige Spesen. Womöglich wird diese Transaktion abgelehnt, da die Spesen höher sein könnten als der verbleibende Überweisungsbetrag.",
			"button": "{amount} BTC versenden",
			"transactionSuccessful": "Die Transaktion wurde erfolgreich durchgeführt.",
			"paymentError": "Bei der Zahlung ist ein Fehler aufgetreten. Überprüfen Sie Ihren Betrag (Achtung: Spesen) oder probieren Sie es später erneut.",
			"openCameraTitle": "QR Code einer Bitcoin oder E-Mail Adresse scannen",
			"cameraError": "Die Kamera kann nicht angezeigt werden.",
			"camereNotice": "Falls die Kamera nicht in 5s angezeigt wird, haben Sie vermutlich keine Berechtigung für die Kamera vergeben."
		}
	}
}
</i18n>
