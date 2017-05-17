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
		channelTransaction: function () {
			if (window.bitcoin) {
				var tx = window.bitcoin.Transaction.fromHex('0100000002d8c8df6a6fdd2addaf589a83d860f18b44872d13ee6ec3526b2b470d42a96d4d000000008b483045022100b31557e47191936cb14e013fb421b1860b5e4fd5d2bc5ec1938f4ffb1651dc8902202661c2920771fd29dd91cd4100cefb971269836da4914d970d333861819265ba014104c54f8ea9507f31a05ae325616e3024bd9878cb0a5dff780444002d731577be4e2e69c663ff2da922902a4454841aa1754c1b6292ad7d317150308d8cce0ad7abffffffff2ab3fa4f68a512266134085d3260b94d3b6cfd351450cff021c045a69ba120b2000000008b4830450220230110bc99ef311f1f8bda9d0d968bfe5dfa4af171adbef9ef71678d658823bf022100f956d4fcfa0995a578d84e7e913f9bb1cf5b5be1440bcede07bce9cd5b38115d014104c6ec27cffce0823c3fecb162dbd576c88dd7cda0b7b32b0961188a392b488c94ca174d833ee6a9b71c0996620ae71e799fc7c77901db147fa7d97732e49c8226ffffffff02c0175302000000001976a914a3d89c53bb956f08917b44d113c6b2bcbe0c29b788acc01c3d09000000001976a91408338e1d5e26db3fce21b011795b1c3c8a5a5d0788ac00000000');
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
			/* if (window.bitcoin && this.accountDetail && this.accountDetail.account && this.accountDetail.account.channelTransaction) {
				return Bitcoin.Transaction.fromHex(this.accountDetail.account.channelTransaction); */
		},
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

				// TODO remove the following line!!
				this.accountDetail.account.channelTransaction = true;

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
					locked: 'Locked',
					notLocked: 'Not Locked',
					seeBelow: 'See below',
					channelTransaction: 'Version {version}; {numInputs} Inputs, {numOutputs} Outputs ({outputs})',
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
						balance: 'Balance',
						broadcastBefore: 'Broadcast Before',
						nonce: 'Nonce',
						channelTransaction: 'Channel Transaction'
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
					locked: 'Gesperrt',
					notLocked: 'Nicht gesperrt',
					seeBelow: 'Siehe unten',
					channelTransaction: 'Version {version}; {numInputs} Eingänge, {numOutputs} Ausgänge ({outputs})',
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
						balance: 'Saldo',
						broadcastBefore: 'Broadcast vor',
						nonce: 'Nonce',
						channelTransaction: 'Channel Transaktion'
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
