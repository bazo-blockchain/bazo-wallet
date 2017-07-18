<template>
<div class="user-funds">
	<div class="compact">
		<h1 class="display-4">{{ $t('userFunds.title') }}</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>
			
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
							<span class="key-extended">{{ item.value }}</span>&nbsp;
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
					<div v-else>
						<span v-if="item.value">
							<i class="fa fa-times red"></i> {{ $t('userFunds.locked') }}
						</span>
						<span v-else>
							<i class="fa fa-check green"></i> {{ $t('userFunds.unlocked') }}
						</span>
					</div>
				</template>
				<template slot="balance" scope="item">
					<i class="fa fa-bitcoin"></i>
					{{ convertSatoshiToBitcoin(item.value) }}
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
						<div v-if="item.item.balance > 0 && !item.item.locked">
							<b-button variant="secondary" size="sm">
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
			
			<div class="justify-content-center row my-1" v-show="this.items.length > perPage">
				<b-pagination size="md" :total-rows="tableItems.length" :per-page="perPage" v-model="currentPage" />
			</div>
			
		</div>
	</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import QrCode from '@/components/QrCode';

export default {
	name: 'user-funds',
	data: function () {
		return {
			isLoading: true,
			items: [],
			currentPage: 1,
			perPage: 15,
			funds: {}
		}
	},
	components: {
		Spinner,
		QrCode
	},
	computed: {
		fields: function () {
			return {
				bitcoinAddress: {
					label: this.$t('userFunds.fields.bitcoinAddress'),
					sortable: true
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
					sortable: true
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
			return HttpService.Auth.User.getFunds().then((response) => {
				this.funds = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			})
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
			"virtualBalanceDescription": "Um einen möglichst reibungslosen und schnellen Dienst anbieten zu können, wird eine jeweils eine beschränkte Summe Bitcoins auf dem Server für einen direkten Austausch zwischen Coinblesk Benutzern zurückbehalten.",
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
