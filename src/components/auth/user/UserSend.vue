<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('send.title') }}</h1>
		<hr>
		<div class="box-wrapper" v-if="!isLoading">
			<div class="box">
				<div class="main-title display-7">{{ $t('send.boxTitle') }}</div>
				<hr>
				<form>
					<b-form-fieldset :label="$t('send.receiver')">
						<b-input-group>
							<b-form-input v-model="address" type="text" :placeholder="$t('send.receiverPlaceholder')"></b-form-input>
							<b-input-group-button slot="right">
								<b-button @click.prevent="openSearch">
									<i class="fa fa-search"></i>
									{{ $t('send.lookup') }}
								</b-button>
							</b-input-group-button>
						</b-input-group>
					</b-form-fieldset>
					<div class="row">
						<div class="col-md-8">
							<b-form-fieldset :label="$t('send.amount')">
								<b-input-group>
									<b-form-input v-model="amount" class="mono"></b-form-input>
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
							<b-form-fieldset :label="$t('send.maxAmount')">
								<div class="form-control disabled mono">{{ totalBalanceFormatted }} BTC</div>
							</b-form-fieldset>
						</div>
					</div>
					<div class="description-forex-rate" v-html="$t('send.descriptionForexRate', { forex: forexRate.rate })" v-if="selectedCurrency === 'USD'"></div>
					<b-button class="submit-button" :block="true" variant="primary">{{ $t('send.button', { amount: formatSatoshi(btcAmount) }) }}</b-button>
				</form>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import UtilService from '@/services/UtilService';
import HttpService from '@/services/HttpService';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			selectedCurrency: 'BTC',
			allowedCurrencies: ['BTC', 'USD'],
			amount: 0,
			address: '',
			forexRate: {}
		}
	},
	computed: {
		totalBalance: function () {
			let totalBalance = 0;
			if (this.$store.state.userBalance && this.$store.state.userBalance.totalBalance) {
				totalBalance = this.$store.state.userBalance.totalBalance;
			}
			return totalBalance;
		},
		totalBalanceFormatted: function () {
			return UtilService.formatSatoshi(this.totalBalance);
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
		}
	},
	methods: {
		loadForexRate: function () {
			return HttpService.getForexCurrent('BITSTAMP', 'USD').then(response => {
				this.forexRate = response.body;
				return Promise.resolve();
			});
		},
		openSearch: function () {
			console.log('search');
		},
		formatSatoshi: UtilService.formatSatoshi
	},
	mounted: function () {
		this.isLoading = true;
		this.loadForexRate().then(() => {
			this.isLoading = false;
			window.setInterval(this.loadForexRate, 60000);
		});
	},
	beforeDestory: function () {
		window.clearInterval(this.loadForexRate);
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
		font-size: 85%;
	}
	.submit-button {
		margin-top: 20px;
	}
	.form-group {
		margin-bottom: 10px;
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
		}
	}
}
</style>

<i18n>
{
	"en": {
		"send": {
			"title": "Send Bitcoins",
			"boxTitle": "Select receiver and sum",
			"receiver": "Receiver (Bitcoin address)",
			"receiverPlaceholder": "Enter a bitcoin address or select a user",
			"lookup": "Lookup",
			"amount": "Amount",
			"maxAmount": "Maximal amount",
			"descriptionForexRate": "The current forex rate BTC/USD is <span class='mono'>{forex}</span>.",
			"button": "Send {amount} BTC"
		}
	},
	"de": {
		"send": {
			"title": "Bitcoins versenden",
			"boxTitle": "Empfänger und Summe auswählen",
			"receiver": "Empfänger (Bitcoin Adresse)",
			"receiverPlaceholder": "Bitcoin Adresse eingeben oder Benutzer auswählen",
			"lookup": "Suchen",
			"amount": "Betrag",
			"maxAmount": "Maximalbetrag",
			"descriptionForexRate": "Der aktuelle Wechselkurs BTC/USD beträgt <span class='mono'>{forex}</span>.",
			"button": "{amount} BTC versenden"
		}
	}
}
</i18n>
