<template>
<div class="admin-accounts-detail">
	<div class="container">
		<h1 class="display-4">
			{{ $t('adminAccountsDetail.title') }}
			<small class="text-muted short-key-extended">{{ publicKeyClient }}</small>
		</h1>
		<hr>
		<div v-if="!isLoading">
			<div v-if="accountDetail">
				<table class="table table-striped">
					<tbody>
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
				<h2 class="display-7 time-locked-addresses-title">{{ $t('adminAccountsDetail.timeLockedAddresses') }}:</h2>
				<div v-if="accountDetail.timeLockedAddresses && accountDetail.timeLockedAddresses.length > 0">
					<b-table striped hover :items="accountDetail.timeLockedAddresses" :fields="timeLockedAddressesFields">
						<template slot="createdAt" scope="item">
							{{ item.value | moment(dateFormat) }}
						</template>
						<template slot="bitcoinAddress" scope="item">
							<span class="key">{{ item.value }}</span>
						</template>
						<template slot="adddressUrl" scope="item">
							<a :href="item.value" target="_blank">
								Link
								<i class="fa fa-external-link"></i>
							</a>
						</template>
						<template slot="locked" scope="item">
							<span v-if="item.value">
								<i class="fa fa-ban"></i>
								Yes
							</span>
							<span v-else>
								<i class="fa fa-check"></i>
								No
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
</template>

<script>
import Http from '@/services/Http';
import Util from '@/services/Util';

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
	computed: {
		dateFormat: function () {
			return Util.DATE_FORMAT;
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
			Http.Auth.Admin.getAccount(this.publicKeyClient).then((response) => {
				this.accountDetail = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		}
	},
	i18n: {
		messages: {
			en: {
				adminAccountsDetail: {
					title: 'Account',
					noAccountFoundTitle: 'Attention:',
					noAccountFound: 'No account with this public client key was found.',
					timeLockedAddresses: 'Time locked Bitcoin addresses',
					noTimeLockedAddressFoundTitle: 'Attention:',
					noTimeLockedAddressFound: 'No time locked Bitcoin address was found under this account.',
					fields: {
						publicKeyClient: 'Public Key Client',
						privateKeyServer: 'Private Key Server',
						publicKeyServer: 'Public Key Server',
						timeCreated: 'Created at',
						virtualBalance: 'Virtual Balance',
						satoshiBalance: 'Satoshi Balance',
						totalBalance: 'Total Balance',
						createdAt: 'Created at',
						bitcoinAddress: 'Bitcoin address',
						addressUrl: 'Address URL',
						locked: 'Locked',
						lockedUntil: 'Locked until',
						balance: 'Balance'
					}
				}
			},
			de: {
				adminAccountsDetail: {
					title: 'Konto',
					noAccountFoundTitle: 'Achtung:',
					noAccountFound: 'Es wurde kein Konto mit diesem Client Public Key gefunden.',
					timeLockedAddresses: 'Bitcoin-Adressen, die zeitlich begrenzt sind',
					noTimeLockedAddressFoundTitle: 'Achtung:',
					noTimeLockedAddressFound: 'Es wurden keine zeitlich beschränkten Bitcoin-Adressen gefunden für dieses Konto.',
					fields: {
						publicKeyClient: 'Public Key Client',
						privateKeyServer: 'Private Key Server',
						publicKeyServer: 'Public Key Server',
						timeCreated: 'Erstellt am',
						virtualBalance: 'Virtuelles Saldo',
						satoshiBalance: 'Satoshi Saldo',
						totalBalance: 'Totales Saldo',
						createdAt: 'Erstellt am',
						bitcoinAddress: 'Bitcoin-Adresse',
						addressUrl: 'Adress-Link',
						locked: 'Gesperrt',
						lockedUntil: 'Gesperrt bis',
						balance: 'Saldo'
					}
				}
			}
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.display-4 small {
	font-size: 70%;
	margin-bottom: -5px;
}
.time-locked-addresses-title {
	margin-top: 40px;
	margin-bottom: 20px;
}
</style>
