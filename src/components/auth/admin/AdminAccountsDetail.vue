<template>
<div class="admin-accounts-detail">
	<div class="compact">
		<h1 class="display-4">
			{{ $t('adminAccountsDetail.title') }}
			<small class="text-muted short-key-extended">{{ publicKeyClient }}</small>
		</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>

			<div v-if="!isLoading">
				<div v-if="accountDetail">
					<div class="striped-table-wrapper">
						<table class="table table-striped">
							<tbody>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.belongsToUser') }}</th>
									<td v-if="accountDetail.account.userAccountEmail">
										<router-link :to="{ name: 'admin-user-accounts-detail', params: { email: accountDetail.account.userAccountEmail } }">{{ accountDetail.account.userAccountEmail }}</router-link>
									</td>
									<td v-else>
										<i class="fa fa-minus"></i>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.timeCreated') }}</th>
									<td>{{ accountDetail.account.timeCreated | moment(dateFormat) }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.publicKeyClient') }}</th>
									<td>
										<span class="key">{{ accountDetail.account.publicKeyClient }}</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.privateKeyServer') }}</th>
									<td>
										<span class="key">{{ accountDetail.account.privateKeyServer }}</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.publicKeyServer') }}</th>
									<td>
										<span class="key">{{ accountDetail.account.publicKeyServer }}</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.locked') }}</th>
									<td>
										<span v-if="accountDetail.account.locked">
											<i class="fa fa-ban"></i>
											{{ $t('adminAccountsDetail.locked') }}
										</span>
										<span v-else>
											<i class="fa fa-check"></i>
											{{ $t('adminAccountsDetail.notLocked') }}
										</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.broadcastBefore') }}</th>
									<td>
										<span v-if="accountDetail.account.broadcastBefore">
											{{ accountDetail.account.broadcastBefore | moment(dateFormat) }}
										</span>
										<span v-else>
											<i class="fa fa-minus"></i>
										</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.nonce') }}</th>
									<td>
										<span v-if="accountDetail.account.nonce">
											{{ accountDetail.account.nonce | moment(dateFormat) }}
										</span>
										<span v-else>
											<i class="fa fa-minus"></i>
										</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.channelTransaction') }}</th>
									<td>
										<span v-if="accountDetail.account.channelTransaction">
											{{ $t('adminAccountsDetail.channelTransaction', channelTransaction) }}
										</span>
										<span v-else>
											<i class="fa fa-minus"></i>
										</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.channelTransactionAmount') }}</th>
									<td>
										<span :class="{'red': accountDetail.account.channelTransactionAmount > 0}">
											<span v-if="accountDetail.account.channelTransactionAmount > 0">-</span>
											{{ accountDetail.account.channelTransactionAmount }}
										</span>
									</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.virtualBalance') }}</th>
									<td>{{ accountDetail.account.virtualBalance }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.satoshiBalance') }}</th>
									<td>{{ accountDetail.account.satoshiBalance }}</td>
								</tr>
								<tr>
									<th scope="row">{{ $t('adminAccountsDetail.fields.totalBalance') }}</th>
									<td>{{ accountDetail.account.totalBalance }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<h2 class="display-7 time-locked-addresses-title">{{ $t('adminAccountsDetail.timeLockedAddresses') }}:</h2>
					<div v-if="accountDetail.timeLockedAddresses && accountDetail.timeLockedAddresses.length > 0" class="table-wrapper">
						<b-table striped hover :items="accountDetail.timeLockedAddresses" :fields="timeLockedAddressesFields">
							<template slot="createdAt" scope="item">
								{{ item.value | moment(dateFormat) }}
							</template>
							<template slot="bitcoinAddress" scope="item">
								<span class="key">{{ item.value }}</span>
							</template>
							<template slot="adddressUrl" scope="item">
								<a :href="item.value" target="_blank" rel="noopener">
									Link
									<i class="fa fa-external-link"></i>
								</a>
							</template>
							<template slot="locked" scope="item">
								<span v-if="item.value">
									<i class="fa fa-ban"></i>
									{{ $t('adminAccountsDetail.locked') }}
								</span>
								<span v-else>
									<i class="fa fa-check"></i>
									{{ $t('adminAccountsDetail.notLocked') }}
								</span>
							</template>
							<template slot="lockedUntil" scope="item">
								{{ item.value | moment(dateFormat) }}
							</template>
							<template slot="balance" scope="item">
								{{ item.value }}
							</template>
						</b-table>
					</div>
					<div v-else class="alert alert-warning">
						<b>{{ $t('adminAccountsDetail.noTimeLockedAddressFoundTitle') }}</b>
						{{ $t('adminAccountsDetail.noTimeLockedAddressFound') }}
					</div>
				</div>
				<div v-else class="alert alert-warning">
					<b>{{ $t('adminAccountsDetail.noAccountFoundTitle') }}</b>
					{{ $t('adminAccountsDetail.noAccountFound') }}
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import Spinner from '@/components/Spinner';
import Bitcoin from 'coinblesk-frontend-bitcoinjs';

export default {
	name: 'admin-accounts-detail',
	data () {
		return {
			isLoading: false,
			accountDetail: null
		}
	},
	props: {
		publicKeyClient: String
	},
	components: {
		Spinner
	},
	computed: {
		channelTransaction: function () {
			if (this.accountDetail && this.accountDetail.account && this.accountDetail.account.channelTransaction) {
				var tx = Bitcoin.Transaction.fromHex(this.accountDetail.account.channelTransaction);
				if (tx) {
					return {
						version: tx.version,
						numInputs: tx.ins.length,
						numOutputs: tx.outs.length,
						outputs: tx.outs.map(out => {
							return out.value;
						}).join(' satoshi, ') + ' satoshi',
						raw: tx
					};
				} else {
					return null;
				}
			} else {
				return null;
			}
		},
		dateFormat: function () {
			return UtilService.DATE_FORMAT;
		},
		timeLockedAddressesFields: function () {
			return {
				createdAt: {
					label: this.$t('adminAccountsDetail.fields.createdAt'),
					sortable: true
				},
				bitcoinAddress: {
					label: this.$t('adminAccountsDetail.fields.bitcoinAddress'),
					sortable: true
				},
				adddressUrl: {
					label: this.$t('adminAccountsDetail.fields.addressUrl'),
					sortable: true
				},
				locked: {
					label: this.$t('adminAccountsDetail.fields.locked'),
					sortable: true
				},
				lockedUntil: {
					label: this.$t('adminAccountsDetail.fields.lockedUntil'),
					sortable: true
				},
				balance: {
					label: this.$t('adminAccountsDetail.fields.balance'),
					sortable: true
				}
			};
		}
	},
	watch: {
		// necessary, if somebody changes the URL, and the view is not rerendered completely
		publicKeyClient: function () {
			this.accountDetail = null;
			this.loadData();
		}
	},
	mounted: function () {
		this.loadData();
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			HttpService.Auth.Admin.getAccount(this.publicKeyClient).then((response) => {
				this.accountDetail = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../../styles/variables';

.display-4 small {
	font-size: 70%;
	margin-bottom: -5px;
}
.time-locked-addresses-title {
	margin-top: 40px;
	margin-bottom: 20px;
}
.striped-table-wrapper,
.table-wrapper {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	@include light-scrollbar();
	
	table {
		min-width: 950px;
		margin-bottom: 5px;
	}
}
</style>

<i18n>
{
	"en": {
		"adminAccountsDetail": {
			"title": "Account",
			"noAccountFoundTitle": "Attention:",
			"noAccountFound": "No account with this public client key was found.",
			"timeLockedAddresses": "Time locked Bitcoin addresses",
			"noTimeLockedAddressFoundTitle": "Attention:",
			"noTimeLockedAddressFound": "No time locked Bitcoin address was found under this account.",
			"locked": "Locked",
			"notLocked": "Not Locked",
			"seeBelow": "See below",
			"channelTransaction": "Version {version}; {numInputs} Inputs, {numOutputs} Outputs ({outputs})",
			"fields": {
				"belongsToUser": "Belongs to user",
				"publicKeyClient": "Public Key Client",
				"privateKeyServer": "Private Key Server",
				"publicKeyServer": "Public Key Server",
				"timeCreated": "Created at",
				"virtualBalance": "Virtual Balance",
				"satoshiBalance": "Satoshi Balance",
				"totalBalance": "Total Balance",
				"createdAt": "Created at",
				"bitcoinAddress": "Bitcoin address",
				"addressUrl": "Address URL",
				"locked": "Locked",
				"lockedUntil": "Locked until",
				"balance": "Balance",
				"broadcastBefore": "Broadcast Before",
				"nonce": "Nonce",
				"channelTransaction": "Channel Transaction",
				"channelTransactionAmount": "Channel Balance"
			}
		}
	},
	"de": {
		"adminAccountsDetail": {
			"title": "Konto",
			"noAccountFoundTitle": "Achtung:",
			"noAccountFound": "Es wurde kein Konto mit diesem Client Public Key gefunden.",
			"timeLockedAddresses": "Bitcoin-Adressen, die zeitlich begrenzt sind",
			"noTimeLockedAddressFoundTitle": "Achtung:",
			"noTimeLockedAddressFound": "Es wurden keine zeitlich beschränkten Bitcoin-Adressen gefunden für dieses Konto.",
			"locked": "Gesperrt",
			"notLocked": "Nicht gesperrt",
			"seeBelow": "Siehe unten",
			"channelTransaction": "Version {version}; {numInputs} Eingänge, {numOutputs} Ausgänge ({outputs})",
			"fields": {
				"belongsToUser": "Gehört zum Benutzer",
				"publicKeyClient": "Public Key Client",
				"privateKeyServer": "Private Key Server",
				"publicKeyServer": "Public Key Server",
				"timeCreated": "Erstellt am",
				"virtualBalance": "Virtuelles Saldo",
				"satoshiBalance": "Satoshi Saldo",
				"totalBalance": "Totales Saldo",
				"createdAt": "Erstellt am",
				"bitcoinAddress": "Bitcoin-Adresse",
				"addressUrl": "Adress-Link",
				"locked": "Gesperrt",
				"lockedUntil": "Gesperrt bis",
				"balance": "Saldo",
				"broadcastBefore": "Broadcast vor",
				"nonce": "Nonce",
				"channelTransaction": "Channel Transaktion",
				"channelTransactionAmount": "Channel Saldo"
			}
		}
	}
}
</i18n>
