<template>
	<div>
		<b-modal id="admin-server-pot-baseline" :title="$t('adminServerPotBaseline.title')"
				:hide-footer="true" size="md" @shown="loadData" @hidden="modalWasClosed">
			<div class="table">
				<b-table striped hover :items="items" :fields="fields">
					<template slot="id" scope="item">
						{{ item.value }}
					</template>
					<template slot="timestamp" scope="item">
						{{ item.value | moment(dateFormat) }}
					</template>
					<template slot="amount" scope="item">
						{{ formatSatoshi(item.value) }}
					</template>
				</b-table>
			</div>
			
			<div class="current-total-wrapper">
				<div class="current-total">
					<label>
						{{ $t('adminServerPotBaseline.currentTotal') }}:
					</label>
					<span class="value">
						{{ formatSatoshi(currentTotal) }}
					</span>
				</div>
			</div>
			<form class="row" @submit.stop.prevent="saveNewAmount">
				<div class="col-md-8">
					<b-form-input v-model.number="newAmount" type="number"
							:placeholder="$t('adminServerPotBaseline.newAmountPlaceholder')"
							:max="newAmountMax" :min="newAmountMin"></b-form-input>
				</div>
				<div class="col-md-4">
					<b-button variant="primary" :block="true">{{ $t('adminServerPotBaseline.newAmountButton') }}</b-button>
				</div>
			</form>
		</b-modal>
	</div>
</template>

<script>
import Util from '@/services/Util';
import Http from '@/services/Http';

export default {
	name: 'admin-server-pot-baseline',
	data: function () {
		return {
			isLoading: false,
			items: [],
			newAmount: '',
			formIsTouched: false,
			newAmountMax: Number.MAX_SAFE_INTEGER,
			newAmountMin: Number.MIN_SAFE_INTEGER
		};
	},
	computed: {
		dateFormat: function () {
			return Util.DATE_FORMAT;
		},
		currentTotal: function () {
			let totalAmount = 0;
			for (let i = 0; i < this.items.length; i++) {
				let item = this.items[i];
				totalAmount += item.amount;
			}
			return totalAmount;
		},
		fields: function () {
			return {
				id: {
					label: 'ID'
				},
				timestamp: {
					label: this.$t('adminServerPotBaseline.fields.timestamp'),
					sortable: true
				},
				amount: {
					label: this.$t('adminServerPotBaseline.fields.amount')
				}
			};
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			Http.adminGetAllServerPotBaselineAmounts().then(response => {
				this.items = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		},
		saveNewAmount: function () {
			this.isLoading = true;
			Http.adminPostServerPotBaseline(this.newAmount).then(() => {
				this.newAmount = '';
				this.loadData();
			}, () => {
				this.isLoading = false;
			});
		},
		modalWasClosed: function () {
			this.newAmount = '';
			this.$emit('modal-closed');
		},
		formatSatoshi: Util.formatSatoshi
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				adminServerPotBaseline: {
					title: 'Server Pot Baseline',
					newAmountPlaceholder: 'Add satoshis (+/-)',
					newAmountButton: 'Add satoshis',
					currentTotal: 'Current Total',
					fields: {
						timestamp: 'Added at',
						amount: 'Amount'
					}
				}
			},
			de: {
				adminServerPotBaseline: {
					title: 'Server Pot Grundstock',
					newAmountPlaceholder: 'Weitere Satoshis hinzufügen (+/-)',
					newAmountButton: 'Hinzufügen',
					currentTotal: 'Derzeitiges Total',
					fields: {
						timestamp: 'Hinzugefügt am',
						amount: 'Betrag'
					}
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.table {
	max-height: 50vh;
	overflow-y: auto;
	padding-right: 0.15em;
}
.current-total-wrapper {
	text-align: center;
	margin-top: 20px;
	margin-bottom: 40px;
	
	.current-total {
		border: 2px solid #333;
		padding: 10px 12px;
		display: inline-block;
		border-radius: 3px;
		max-width: 80%;
		
		> * {
			display: inline-block;
			vertical-align: middle;
			font-weight: 300;
			line-height: normal;
		}
		label {
			font-size: 20px;
			padding: 0;
			margin: 0;
			margin-right: 10px;
		}
		.value {
			font-size: 30px;
		}
	}
}
</style>
