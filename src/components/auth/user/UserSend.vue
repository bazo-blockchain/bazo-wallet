<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('userSend.title') }}</h1>
		<hr>
		<div class="box-wrapper" v-if="!isLoading">
			<div class="box">
				<div class="main-title display-7">{{ $t('userSend.boxTitle') }}</div>
				<hr>
				<form>
					<b-form-fieldset :label="$t('userSend.receiver')">
						<b-input-group>
							<b-form-input v-model="address" type="text" class="address-input" :placeholder="$t('userSend.receiverPlaceholder')" :class="{ 'form-error': formIsTouched && !validAddress }"></b-form-input>
							<b-input-group-button slot="right">
								<b-button @click.prevent="openSearch">
									<i class="fa fa-search"></i>
									{{ $t('userSend.lookup') }}
								</b-button>
							</b-input-group-button>
						</b-input-group>
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
								<div class="form-control disabled mono">{{ convertSatoshiToBitcoin(totalBalance) }} BTC</div>
							</b-form-fieldset>
						</div>
					</div>
					<div class="description-forex-rate" v-html="$t('userSend.descriptionForexRate', { forex: forexRate.rate })" v-if="selectedCurrency === 'USD'"></div>
					<b-button class="submit-button" :block="true" variant="primary" @click.prevent="submit" :disabled="formIsTouched && !validForm">{{ $t('userSend.button', { amount: btcAmount }) }}</b-button>
				</form>
			</div>

			<user-decrypt-private-key @private-key-decrypted="signDTO" :encrypted-private-key="encryptedPrivateKey"></user-decrypt-private-key>
		</div>
	</div>
</div>
</template>

<script>
import UtilService from '@/services/UtilService';
import HttpService from '@/services/HttpService';
import CryptoService from '@/services/CryptoService';
import UserDecryptPrivateKey from '@/components/auth/user/UserDecryptPrivateKey';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			selectedCurrency: 'BTC',
			allowedCurrencies: ['BTC', 'USD'],
			amount: 0,
			address: '',
			forexRate: {},
			encryptedPrivateKey: '',
			formIsTouched: false
		}
	},
	components: {
		UserDecryptPrivateKey
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
			if (this.selectedCurrency === 'USD') {
				return this.amount / this.forexRate.rate;
			} else {
				return this.amount;
			}
		},
		validAmount: function () {
			if (this.amount <= 0) {
				return false;
			}
			// TODO validation if btcAmount exceeds balance
			return true;
		},
		validAddress: function () {
			if (this.address === '') {
				return false;
			}
			// TODO address validation
			return true;
		},
		validForm: function () {
			return this.validAmount && this.validAddress;
		}
	},
	methods: {
		loadInitialData: function () {
			return Promise.all([
				HttpService.getForexCurrent('BITSTAMP', 'USD'),
				HttpService.Auth.User.getEncryptedPrivateKey()
			]).then(responses => {
				this.forexRate = responses[0].body;
				this.encryptedPrivateKey = responses[1].body.encryptedClientPrivateKey;
				return Promise.resolve();
			}, () => {
				return Promise.reject();
			});
		},
		openSearch: function () {
			console.log('search');
			// TODO create a search modal
		},
		submit: function () {
			this.formIsTouched = true;
			if (this.validForm) {
				this.$root.$emit('show::modal', 'user-decrypt-private-key');
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
			"receiver": "Receiver (Bitcoin address)",
			"receiverPlaceholder": "Enter a bitcoin address or select a user",
			"lookup": "Lookup",
			"amount": "Amount",
			"maxAmount": "Maximal amount",
			"descriptionForexRate": "The current forex rate BTC/USD is <span class='mono'>{forex}</span>.",
			"button": "Send {amount} BTC",
			"transactionSuccessful": "The transaction was successfully executed."
		}
	},
	"de": {
		"userSend": {
			"title": "Bitcoins versenden",
			"boxTitle": "Empfänger und Betrag auswählen",
			"receiver": "Empfänger (Bitcoin Adresse)",
			"receiverPlaceholder": "Bitcoin Adresse eingeben oder Benutzer auswählen",
			"lookup": "Suchen",
			"amount": "Betrag",
			"maxAmount": "Maximalbetrag",
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/USD beträgt <span class='mono'>{forex}</span>.",
			"button": "{amount} BTC versenden",
			"transactionSuccessful": "Die Transaktion wurde erfolgreich durchgeführt."
		}
	}
}
</i18n>
