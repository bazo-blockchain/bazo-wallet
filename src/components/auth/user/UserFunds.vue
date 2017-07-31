<template>
<div class="user-funds">
	<div class="compact">
		<h1 class="display-4">{{ $t('userFunds.title') }}
			<small v-if="totalBalance !== ''" class="pull-right">
				<i class="fa fa-bitcoin"></i>
				{{ convertSatoshiToBitcoin(totalBalance) }}
			</small>
		</h1>
		<hr>
		<div class="pos-rel user-funds-content">
			<spinner :is-loading="isLoading"></spinner>
			
			<div class="table-wrapper" v-if="!isLoading && !loadingError">
				<div class="alert alert-success" v-if="moveFundsSuccessful">
					{{ $t('userFunds.moveFundsSuccessful') }}
				</div>
				<b-table striped hover :items="tableItems" :fields="fields" :current-page="currentPage" :per-page="perPage">
					<template slot="bitcoinAddress" scope="item">
						<div class="no-wrap">
							<div v-if="item.item.virtualBalance">
								<i>{{ $t('userFunds.virtualBalance') }}</i>
								<b-popover :content="$t('userFunds.virtualBalanceDescription')" triggers="hover" class="popover-element">
									<i class="fa fa-info-circle increase-focus"></i>
								</b-popover>
							</div>
							<span v-else>
								<span class="mono">{{ item.value }}</span>&nbsp;
								<a :href="item.item.adddressUrl" :title="item.item.adddressUrl" target="_blank" rel="noopener" class="increase-focus">
									<i class="fa fa-external-link"></i>
								</a>
							</span>
						</div>
					</template>
					<template slot="createdAt" scope="item">
						<div v-if="item.item.virtualBalance">
							<i class="fa fa-minus"></i>
						</div>
						<div v-else>
							{{ item.value | moment(dateFormat) }}
						</div>
					</template>
					<template slot="lockedUntil" scope="item">
						<div v-if="item.item.virtualBalance">
							<i class="fa fa-minus"></i>
						</div>
						<div v-else>
							{{ item.value | moment(dateFormat) }}
						</div>
					</template>
					<template slot="locked" scope="item">
						<div v-if="item.item.virtualBalance">
							<i class="fa fa-minus"></i>
						</div>
						<div v-else class="no-wrap">
							<span v-if="item.value">
								<i class="fa fa-times red"></i> {{ $t('userFunds.locked') }}
							</span>
							<span v-else>
								<i class="fa fa-check green"></i> {{ $t('userFunds.unlocked') }}
							</span>
						</div>
					</template>
					<template slot="balance" scope="item">
						<div class="nowrap">
							<i class="fa fa-bitcoin"></i>
							{{ convertSatoshiToBitcoin(item.value) }}
						</div>
					</template>
					<template slot="qr" scope="item">
						<div v-if="item.item.virtualBalance">
							<i class="fa fa-minus"></i>
						</div>
						<div v-else>
							<qr-code :content="item.item.bitcoinAddress"></qr-code>
						</div>
					</template>
					<template slot="actions" scope="item">
						<div v-if="item.item.virtualBalance">
							<div class="no-action-possible">{{ $t('userFunds.noActionsPossible') }}</div>
						</div>
						<div v-else>
							<div v-if="item.item.balance > 0 && !item.item.locked && lockedAddress.bitcoinAddress !== null">
								<b-button variant="secondary" size="sm" @click.prevent="moveFundsPreparation(item.item.bitcoinAddress, item.item.redeemScript, item.item.balance)">
									{{ $t('userFunds.moveFunds') }}
								</b-button>
								<b-popover triggers="hover" :content="$t('userFunds.moveFundsDescription')" class="popover-element">
									<i class="fa fa-info-circle"></i>
								</b-popover>
							</div>
							<div v-else class="no-action-possible">{{ $t('userFunds.noActionsPossible') }}</div>
						</div>
					</template>
				</b-table>
			
				<div class="create-new-address-button" v-if="lockedAddress.bitcoinAddress === null">
					<b-button @click.prevent="createNewAddressPreparation">{{ $t('userFunds.createNewAddress') }}</b-button>
					<b-popover triggers="hover" :content="$t('userFunds.createNewAddressDescription')" class="popover-element">
						<i class="fa fa-info-circle"></i>
					</b-popover>
				</div>
				
				<div class="justify-content-center row my-1" v-show="this.tableItems.length > perPage">
					<b-pagination size="md" :total-rows="tableItems.length" :per-page="perPage" v-model="currentPage" />
				</div>
			</div>
		</div>
		
		<user-transfer @private-key-decrypted="moveFunds" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :amount="convertSatoshiToBitcoin(currentTransfer.amountSatoshi)"></user-transfer>
		<user-transfer @private-key-decrypted="createNewAddress" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true"></user-transfer>
	</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import QrCode from '@/components/QrCode';
import UserTransfer from '@/components/auth/user/UserTransfer';
import CryptoService from '@/services/CryptoService';
import TransactionService from '@/services/TransactionService';
import moment from 'moment';

export default {
	name: 'user-funds',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			currentPage: 1,
			perPage: 15,
			funds: {},
			lockedAddress: {},
			currentTransfer: {},
			moveFundsSuccessful: false
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
		totalBalance: function () {
			if (this.funds && this.funds.timeLockedAddresses) {
				let sumOfBalances = 0;

				this.funds.timeLockedAddresses.forEach((item) => {
					sumOfBalances += item.balance;
				});

				return this.funds.virtualBalance + sumOfBalances;
			} else {
				return '';
			}
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

				return table;
			} else {
				return [];
			}
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
		moveFundsPreparation: function (fromAddress, redeemScript, amountSatoshi) {
			this.isLoading = true;
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
			this.moveFundsSuccessful = false;

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

				// toPublicKey: '' && amount: 0 => external payment
				const dto = {
					tx: transaction,
					fromPublicKey: CryptoService.convertPrivateKeyWifToPublicKeyHex(decryptedPrivateKey),
					toPublicKey: '',
					amount: 0,
					nonce: moment().format('x')
				};
				const signedDTO = CryptoService.signDTO(decryptedPrivateKey, dto);

				HttpService.microPayment(signedDTO, true).then(() => {
					this.isLoading = false;
					this.currentTransfer = {};
					this.moveFundsSuccessful = true;
				}, () => {
					this.isLoading = false;
					this.currentTransfer = {};
					this.$toasted.global.error(this.$t('userFunds.paymentError'));
				});
			} catch (error) {
				this.isLoading = false;
				this.currentTransfer = {};
				this.$toasted.global.error(this.$t('userFunds.paymentError'));
			}
		},
		createNewAddressPreparation: function () {
			this.isLoading = true;
			this.currentTransfer = {};
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
			this.moveFundsSuccessful = false;

			const innerDTO = {
				lockTime: Math.floor(new Date() / 1000) + 3600 * 24 * 100,
				publicKey: window.bitcoin.ECPair.fromWIF(decryptedPrivateKey).getPublicKeyBuffer().toString('hex')
			};
			const signedInnerDTO = CryptoService.signDTO(decryptedPrivateKey, innerDTO);

			HttpService.createTimeLockedAddress(signedInnerDTO, true).then(() => {
				this.isLoading = false;
				this.currentTransfer = {};
				this.loadData();
			}, () => {
				this.$toasted.global.error(this.$t('userFunds.paymentError'));
				this.isLoading = false;
				this.currentTransfer = {};
			});
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
			"locked": "Locked",
			"unlocked": "Unlocked",
			"moveFunds": "Move Funds",
			"moveFundsDescription": "You can easily transfer your funds from previous bitcoin addresses to your current, for Coinblesk used Bitcoin address",
			"noActionsPossible": "No action possible.",
			"virtualBalance": "Virtual Balance",
			"virtualBalanceDescription": "To provide a fast, reliable service, a certain amount of Bitcoins is kept at the server as a virtual balance for a direct Coinblesk user exchange.",
			"createNewAddress": "Create new address",
			"createNewAddressDescription": "Create a new address!",
			"paymentError": "An error occurred. Please try it again later on.",
			"moveFundsSuccessful": "The amount was successfully transferred to the locked account. This transaction may be pending for up to an hour. Refresh this page to see if the transaction was already confirmed.",
			"fields": {
				"bitcoinAddress": "Bitcoin Address",
				"createdAt": "Created At",
				"lockedUntil": "Locked until",
				"locked": "Locked?",
				"balance": "Balance",
				"qr": "QR Code",
				"actions": "Actions"
			}
		}
	},
	"de": {
		"userFunds": {
			"title": "Guthaben",
			"locked": "Gesperrt",
			"unlocked": "Nicht gesperrt",
			"moveFunds": "Betrag verschieben",
			"moveFundsDescription": "Sie können die Beträge älterer Bitcoin-Adressen bequem auf Ihre aktuelle, in Coinblesk verwendete Bitcoin-Adresse übertragen.",
			"noActionsPossible": "Keine Aktion möglich.",
			"virtualBalance": "Virtuelles Saldo",
			"virtualBalanceDescription": "Um einen möglichst reibungslosen und schnellen Dienst anbieten zu können, wird jeweils eine beschränkte Summe Bitcoins auf dem Server für einen direkten Austausch zwischen Coinblesk Benutzern zurückbehalten.",
			"createNewAddress": "Neue Adresse anlegen",
			"createNewAddressDescription": "Create a new address!",
			"paymentError": "Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.",
			"moveFundsSuccessful": "Der Betrag ist erfolgreich auf das gesperrte Konto überwiesen worden. Die Transaktion kann bis zu einer Stunde dauern. Aktualisieren Sie die Seite, um zu erfahren, ob die Transaktion schon bestätigt ist.",
			"fields": {
				"bitcoinAddress": "Bitcoin Adresse",
				"createdAt": "Erstellt am",
				"lockedUntil": "Gesperrt bis",
				"locked": "Gesperrt?",
				"balance": "Betrag",
				"qr": "QR Code",
				"actions": "Aktionen"
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
</style>
