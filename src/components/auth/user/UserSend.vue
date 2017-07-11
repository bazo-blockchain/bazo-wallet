<template>
<div class="user-send">
	<div class="compact">
		<h1 class="display-4">{{ $t('send.title') }}</h1>
		<hr>
		<div class="box-wrapper">
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
											<b-dropdown-item v-for="currency in ['BTC', 'USD']" @click="selectedCurrency = currency" :key="currency">
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
					<b-form-fieldset :label="$t('send.note')">
						<b-form-input :placeholder="$t('send.notePlaceholder')"></b-form-input>
					</b-form-fieldset>
					<b-button class="submit-button" :block="true" variant="primary">{{ $t('send.button', { amount: formatSatoshi(amount) }) }}</b-button>
				</form>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import UtilService from '@/services/UtilService';

export default {
	name: 'user-send',
	data: function () {
		return {
			selectedCurrency: 'BTC',
			amount: 0,
			address: ''
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
		}
	},
	methods: {
		openSearch: function () {
			console.log('search');
		},
		formatSatoshi: UtilService.formatSatoshi
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
		margin-top: 30px;
	}
	.form-group {
		margin-bottom: 10px;
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
			"note": "Note",
			"notePlaceholder": "Add a message (optional)",
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
			"note": "Notiz",
			"notePlaceholder": "Nachricht schreiben (optional)",
			"button": "{amount} BTC versenden"
		}
	}
}
</i18n>
