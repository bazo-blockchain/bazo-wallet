<template>
<div class="user-funds">
	<div class="compact">
		<h1 class="display-4">{{ this.$t('userAccounts.title') }}
			<small v-if="!isLoading && !loadingError" class="pull-right">
				<span class="total-funds-small">{{ this.$t('userAccounts.total') }}</span>
				<i class="fa fa-bitcoin"></i>
				<!-- {{ convertSatoshiToBitcoin(funds.totalBalance) }} -->
        1
			</small>
		</h1>
		<hr>
		<div class="pos-rel user-funds-content">
			<spinner :is-loading="isLoading"></spinner>

			<div class="table-wrapper" v-if="!isLoading && !loadingError">
        <div v-if="configured"
             class="table-responsive">
             <label>{{$t('userAccounts.description')}}</label>
             <b-table striped hover :items="this.tableRows" :fields="this.fields">
               <template slot="table-caption">
                This is a table caption.
              </template>
             </b-table>
             <div class="reload-page">
              <span class="btn btn-secondary" @click.prevent="">
                <i class="fa fa-refresh"></i>
                {{ this.$t('userAccounts.reload') }}
              </span>
            </div>
             <hr>
        </div>
        <div class="" v-else>
          <b-alert show variant="info">{{$t('userAccounts.notConfigured')}}</b-alert>
        </div>

        <form>
          <b-form-fieldset :label="$t('userAccounts.bazoaddress')">
            <b-form-input v-model="bazoaddress" type="text"></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset :label="$t('userAccounts.bazoname')">
            <b-form-input v-model="bazoname" ></b-form-input>
          </b-form-fieldset>
          <b-button @click.prevent="saveAccount" :block="true" variant="primary" :disabled="isLoading">{{ $t('userAccounts.save') }}</b-button>
        </form>
				<div class="justify-content-center row my-1" v-show="this.tableRows.length > perPage">
					<b-pagination size="md" :total-rows="this.tableRows.length" :per-page="perPage" v-model="currentPage" />
				</div>

			</div>
		</div>

		<!-- <user-transfer @private-key-decrypted="moveFunds" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :amount="convertSatoshiToBitcoin(currentTransfer.amountSatoshi)"></user-transfer>
		<user-transfer @private-key-decrypted="createNewAddress" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true"></user-transfer>
		<user-transfer @private-key-decrypted="payout" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true" separate="payout"></user-transfer> -->
	</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
// import HttpService from '@/services/HttpService';
// import UtilService from '@/services/UtilService';
import QrCode from '@/components/QrCode';
import UserTransfer from '@/components/auth/user/UserTransfer';
// import TransactionService from '@/services/TransactionService';

export default {
	name: 'user-funds',
	data: function () {
		return {
			blubb: false,
			isLoading: true,
			loadingError: false,
			currentPage: 1,
			perPage: 15,
      bazoaddress: '',
      bazoname: '',
			alerts: {
				success: {
					moveFunds: false,
					createNewAddress: false,
					payout: false
				},
				error: {
					moveFunds: false,
					createNewAddress: false,
					payout: false
				}
			}
		}
	},
	components: {
		Spinner,
		QrCode,
		UserTransfer
	},
	computed: {
		fields: function () {
			return {
				bitcoinAddress: {
					label: this.$t('userFunds.fields.bitcoinAddress'),
					sortable: false
				},
				createdAt: {
					label: this.$t('userFunds.fields.createdAt'),
					sortable: true
				},
				lockedUntil: {
					label: this.$t('userFunds.fields.lockedUntil'),
					sortable: true
				},
				locked: {
					label: this.$t('userFunds.fields.locked'),
					sortable: false
				},
				balance: {
					label: this.$t('userFunds.fields.balance'),
					sortable: true
				},
				qr: {
					label: this.$t('userFunds.fields.qr'),
					sortable: false
				},
				actions: {
					label: this.$t('userFunds.fields.actions'),
					sortable: false
				}
			};
		},
		dateFormat: function () {
			return UtilService.DATE_FORMAT
		},
		tableItems: function () {
			if (this.funds && this.funds.timeLockedAddresses) {
				// creates a deep copy
				const table = JSON.parse(JSON.stringify(this.funds.timeLockedAddresses));

				table.forEach((item) => {
					if (!item.locked && item.balance === 0) {
						item.state = 'default';
					}
				});

				table.push({
					virtualBalance: true,
					balance: this.funds.virtualBalance
				});

				table.push({
					channelTransactionAmount: true,
					balance: this.funds.channelTransactionAmount
				});

				return table;
			} else {
				return [];
			}
		},
		user: function () {
			return this.$store.state.user;
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			return Promise.all([
				HttpService.Auth.User.getFunds(),
				HttpService.Auth.User.getLockedAddress()
			]).then(responses => {
				this.funds = responses[0].body;
				this.lockedAddress = responses[1].body;
				this.loadingError = false;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
				this.loadingError = true;
			})
		},
		hideAlerts: function () {
			const successKeys = Object.keys(this.alerts.success);
			const errorKeys = Object.keys(this.alerts.error);

			successKeys.forEach((item) => {
				this.alerts.success[item] = false;
			});
			errorKeys.forEach((item) => {
				this.alerts.error[item] = false;
			});
		},
		moveFundsPreparation: function (fromAddress, redeemScript, amountSatoshi) {
			this.isLoading = true;
			this.hideAlerts();
			this.currentTransfer = {};

			Promise.all([
				HttpService.Auth.User.getEncryptedPrivateKey(),
				HttpService.Auth.User.getFees(),
				HttpService.Auth.User.getUTXO(fromAddress)
			]).then(responses => {
				this.currentTransfer = {
					redeemScript: redeemScript,
					amountSatoshi: amountSatoshi,
					output: this.lockedAddress.bitcoinAddress,
					encryptedPrivateKey: responses[0].body.encryptedClientPrivateKey,
					feePerByte: responses[1].body.fee,
					inputs: responses[2].body
				};
				this.isLoading = false;
				this.$nextTick(() => {
					this.$root.$emit('show::modal', 'user-transfer');
				});
			}, () => {
				this.$toasted.global.warn(this.$t('userFunds.paymentError'));
				this.isLoading = false;
			});
		},
		moveFunds: function (decryptedPrivateKey) {
			this.isLoading = true;
			this.hideAlerts();

			try {
				const transaction = TransactionService.buildTransaction({
					privateKeyWif: decryptedPrivateKey,
					inputs: this.currentTransfer.inputs,
					output: this.currentTransfer.output,
					changeOutput: null,
					amount: this.currentTransfer.amountSatoshi,
					feePerByte: this.currentTransfer.feePerByte,
					feesIncluded: true,
					redeemScript: this.currentTransfer.redeemScript
				});

				HttpService.Auth.User.externalPayment(transaction, true).then(() => {
					this.isLoading = false;
					this.currentTransfer = {};
					this.alerts.success.moveFunds = true;
				}, () => {
					this.isLoading = false;
					this.currentTransfer = {};
					this.alerts.error.moveFunds = true;
				});
			} catch (error) {
				this.isLoading = false;
				this.currentTransfer = {};
				this.alerts.error.moveFunds = true;
			}
		},
		createNewAddressPreparation: function () {
			this.isLoading = true;
			this.currentTransfer = {};
			this.hideAlerts();

			HttpService.Auth.User.getEncryptedPrivateKey().then(response => {
				this.currentTransfer = {
					encryptedPrivateKey: response.body.encryptedClientPrivateKey
				};
				this.isLoading = false;
				this.$nextTick(() => {
					this.$root.$emit('show::modal', 'user-transfer-unlock');
				});
			});
		},
		createNewAddress: function (decryptedPrivateKey) {
			this.isLoading = true;
			this.hideAlerts();

			const innerDTO = {
				lockTime: Math.floor(new Date() / 1000) + 3600 * 24 * 100,
				publicKey: CryptoService.convertPrivateKeyWifToPublicKeyHex(decryptedPrivateKey)
			};
			const signedInnerDTO = CryptoService.signDTO(decryptedPrivateKey, innerDTO);

			HttpService.createTimeLockedAddress(signedInnerDTO, true).then(() => {
				this.isLoading = false;
				this.currentTransfer = {};
				this.loadData();
				this.alerts.success.createNewAddress = true;
			}, () => {
				this.isLoading = false;
				this.currentTransfer = {};
				this.alerts.error.createNewAddress = true;
			});
		},
		payoutPreparation: function () {
			this.isLoading = true;
			this.currentTransfer = {};
			this.hideAlerts();

			HttpService.Auth.User.getEncryptedPrivateKey().then(response => {
				this.currentTransfer = {
					encryptedPrivateKey: response.body.encryptedClientPrivateKey
				};
				this.isLoading = false;
				this.$nextTick(() => {
					this.$root.$emit('show::modal', 'user-transfer-unlock-payout');
				});
			});
		},
		payout: function (decryptedPrivateKey) {
			this.isLoading = true;
			this.hideAlerts();

			const innerDTO = {
				publicKey: CryptoService.convertPrivateKeyWifToPublicKeyHex(decryptedPrivateKey),
				ToAddress: this.lockedAddress.bitcoinAddress
			};
			const signedInnerDTO = CryptoService.signDTO(decryptedPrivateKey, innerDTO);

			HttpService.payout(signedInnerDTO, true).then(() => {
				this.isLoading = false;
				this.currentTransfer = {};
				this.loadData();
				this.alerts.success.payout = true;
			}, () => {
				this.isLoading = false;
				this.currentTransfer = {};
				this.alerts.error.payout = true;
			});
		},
		encodeBIP21: function (address) {
			return BitcoinBIP21.encode(address);
		},
		convertSatoshiToBitcoin: UtilService.convertSatoshiToBitcoin
	},
	mounted: function () {
		this.loadData();
	}
};
</script>

<i18n>
{
	"en": {
		"userFunds": {
			"title": "Funds",
			"totalFunds": "Total",
			"locked": "Locked",
			"unlocked": "Unlocked",
			"moveFunds": "Move Funds",
			"moveFundsDescription": "You can easily transfer your funds from previous Bazo addresses to your current, for Coinblesk used Bazo address",
			"noActionsPossible": "No action possible.",
			"virtualBalance": "Virtual Balance",
			"virtualBalanceDescription": "To provide a fast, reliable service, a certain amount of Bitcoins is kept at the server as a virtual balance for a direct Coinblesk user exchange.",
			"channelTransactionAmount": "Open payment",
			"channelTransactionAmountDescription": "To save transaction fees, there is the open payment. This means, that pending transaction are not directly sent out into the Bazo network, but kept back to summarize all the payments (up to a certain amount). The recepient immediately receives the payment in form of a virtual balance.",
			"createNewAddress": "Create new address",
			"createNewAddressDescription": "Create a new address!",
			"paymentError": "An error occurred. Please try it again later on.",
			"payoutButton": "Pay Out",
			"payoutDescription": "The virtual balance can only be used for payment within Coinblesk. If you want to make payments to any Bazo address, you need to pay out the virtual balance to your locked address.",
			"reload": "Reload",
			"fields": {
				"bitcoinAddress": "Bazo Address",
				"createdAt": "Created At",
				"lockedUntil": "Locked until",
				"locked": "Locked?",
				"balance": "Balance",
				"qr": "QR Code",
				"actions": "Actions"
			},
			"alerts": {
				"success": {
					"moveFunds": "The amount was successfully transferred to the locked account. This transaction may be pending for up to an hour.",
					"createNewAddress": "Your new address was successfully created. Transfer your funds to this address to make payments in Coinblesk. You can directly move your funds from previous addresses to your new address on this page.",
					"payout": "Your virtual balance was transferred successfully to your locked address. The transaction may be pending for up to an hour."
				},
				"error": {
					"moveFunds": "An error occurred during the transaction of the funds. Please try it again later.",
					"createNewAddress": "An error occurred during the creation of a new address. Please try it again later.",
					"payout": "An error occurred during the pay out. Please try it again later."
				}
			}
		}
	},
	"de": {
		"userFunds": {
			"title": "Guthaben",
			"totalFunds": "Total",
			"locked": "Gesperrt",
			"unlocked": "Nicht gesperrt",
			"moveFunds": "Betrag verschieben",
			"moveFundsDescription": "Sie können die Beträge älterer Bitcoin-Adressen bequem auf Ihre aktuelle, in Coinblesk verwendete Bitcoin-Adresse übertragen.",
			"noActionsPossible": "Keine Aktion möglich.",
			"virtualBalance": "Virtuelles Saldo",
			"virtualBalanceDescription": "Um einen möglichst reibungslosen und schnellen Dienst anbieten zu können, wird jeweils eine beschränkte Summe Bitcoins auf dem Server für einen direkten Austausch zwischen Coinblesk Benutzern zurückbehalten.",
			"channelTransactionAmount": "Offene Zahlung",
			"channelTransactionAmountDescription": "Um Transaktionskosten zu sparen, gibt es die offene Zahlung. Das bedeutet, alle Transaktionen bis zu einem Schwellenwert werden zurückgehalten. Der Empfänger erhält den Betrag jedoch sofort in Form eines virtuellen Saldos.",
			"createNewAddress": "Neue Adresse anlegen",
			"createNewAddressDescription": "Create a new address!",
			"paymentError": "Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.",
			"payoutButton": "Auszahlen",
			"payoutDescription": "Das virtuelle Saldo kann nur für Zahlungen innerhalb von Coinblesk verwendet werden. Möchten Sie Zahlungen nach ausserhalb machen, müssen Sie sich das virtuelle Saldo auf Ihre gesperrte Adresse auszahlen lassen.",
			"reload": "Aktualisieren",
			"fields": {
				"bitcoinAddress": "Bazo Adresse",
				"createdAt": "Erstellt am",
				"lockedUntil": "Gesperrt bis",
				"locked": "Gesperrt?",
				"balance": "Betrag",
				"qr": "QR Code",
				"actions": "Aktionen"
			},
			"alerts": {
				"success": {
					"moveFunds": "Der Betrag ist erfolgreich auf das gesperrte Konto überwiesen worden. Die Transaktion kann bis zu einer Stunde dauern.",
					"createNewAddress": "Ihre neue Adresse wurde erfolgreich erstellt. Überweisen Sie Guthaben auf diese Adresse, um Zahlungen zu tätigen. Sie können das Guthaben von vorherigen Adressen hier direkt auf Ihre neue Adresse überweisen.",
					"payout": "Ihr virtuelles Saldo wurde erfolgreich auf Ihre gesperrte Adresse überwiesen. Die Transaktion kann bis zu einer Stunde dauern."
				},
				"error": {
					"moveFunds": "Es ist ein Fehler beim Überweisen aufgetreten. Bitte versuchen Sie es später erneut.",
					"createNewAddress": "Es ist ein Fehler beim Erstellen einer neuen Adresse aufgetreten. Bitte versuchen Sie es später erneut.",
					"payout": "Es ist ein Fehler beim Auszahlen aufgetreten. Bitte versuchen Sie es später erneut."
				}
			}
		}
	}
}
</i18n>

<style lang="scss" scoped>
@import '../../../styles/variables';

.user-funds-content {
	min-height: 300px;
}
h1 small {
	margin-top: 6px;
	font-size: 70%;
	font-weight: 300;
}
@media (max-width: 650px) {
	h1 small {
		margin-top: 15px;
		display: block;
		float: none;
	}
}
@media (max-width: 1050px) {
	.table-wrapper {
		overflow-x: auto;
		overflow-y: visible;
		width: 100%;
		max-width: 100%;

		@include light-scrollbar();

		/deep/ table {
			min-width: 1050px;
		}
		/deep/ .qr-image {
			position: fixed;
			bottom: auto;
			left: auto;
			top: 30px;
			right: 40px;
			transform: initial;
			&:after {
				display: none;
			}
		}
	}
}

.fa.green {
	color: $green-color;
}
.fa.red {
	color: $red-color;
}
.fa-qrcode {
	font-size: 120%;
}

.popover-element {
	color: #999;
	display: inline-block;
	vertical-align: middle;
	margin-left: 3px;
	cursor: help;
}

.create-new-address-button {
	.popover-element {
		margin-top: 3px;
		margin-left: 5px;
	}
}

.table /deep/ thead th {
	border-top: 0;
}
.total-funds-small {
	font-size: 60%;
	text-transform: uppercase;
}

/* default is added to uninteresting rows */
.table /deep/ .table-default td {
	padding: 0.3rem 0.75rem;
	opacity: 0.4;
	font-style: italic;
}
.no-action-possible {
	font-style: italic;
	font-size: 90%;
}

.reload-page {
	margin-top: 20px;
	text-align: center;
}
</style>
