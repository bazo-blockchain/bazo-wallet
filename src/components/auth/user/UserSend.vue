<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('userSend.title') }}</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>
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
								<b-form-fieldset :label="$t('userSend.maxAmount')">
									<div class="form-control disabled mono" :class="{ 'form-error': formIsTouched && maximumAmountExceeded }">
										{{ convertSatoshiToBitcoin(totalBalance) }} BTC
									</div>
								</b-form-fieldset>
							</div>
						</div>
						<div class="description-forex-rate" v-html="$t('userSend.descriptionForexRate', { forex: forexRates[selectedCurrency].rate, currency: selectedCurrency })" v-if="selectedCurrency !== 'BTC'"></div>
						<b-button class="submit-button" :block="true" variant="primary" @click.prevent="submit" :disabled="formIsTouched && !validForm">{{ $t('userSend.button', { amount: btcAmount }) }}</b-button>
					</form>
				</div>
	
				<user-transfer @private-key-decrypted="signDTO" :encrypted-private-key="paymentRequirements.encryptedClientPrivateKey" :amount="btcAmount"></user-transfer>
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
			formIsTouched: false
		}
	},
	components: {
		Spinner,
		UserTransfer
	},
	computed: {
		totalBalance: function () {
			let totalBalance = 0;
			if (this.$store.state.userBalance && this.$store.state.userBalance.totalBalance) {
				totalBalance = this.$store.state.userBalance.totalBalance;
			}
			return totalBalance;
		},
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
		maximumAmountExceeded: function () {
			if (!this.$store.state.userBalance) {
				return true;
			}
			return this.$store.state.userBalance.totalBalance * UtilService.SATOSHI_PER_BITCOIN < this.btcAmount;
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
		signDTO: function (privateKeyWif) {
			this.isLoading = true;
			const dto = { receiver: this.address, amount: this.btcAmount };
			const signedDto = CryptoService.signDTO(privateKeyWif, dto);

			console.log(signedDto);
			// TODO create and submit a meaningful signed DTO

			this.$toasted.global.success(this.$t('userSend.transactionSuccessful'));
			this.$router.push({ name: 'home' });
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
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/{currency} beträgt <span class='mono'>{forex}</span>&nbsp;&nbsp;(Quelle: Bitstamp).",
			"button": "{amount} BTC versenden",
			"transactionSuccessful": "Die Transaktion wurde erfolgreich durchgeführt."
		}
	}
}
</i18n>
