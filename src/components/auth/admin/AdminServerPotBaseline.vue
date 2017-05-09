<template>
	<div>
		<b-modal id="admin-server-pot-baseline" :title="$t('adminServerPotBaseline.title')"
				:hide-footer="true" size="md" @shown="loadData" @hidden="modalWasClosed">
			<div v-if="!isLoading">
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
					<div v-if="items.length === 0">
						<p class="text-center">
							<i>{{ $t('adminServerPotBaseline.noEntries') }}</i>
						</p>
						<hr>
					</div>
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
			</div>
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
			currentTotal: 0,
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

			Promise.all([
				Http.adminGetTotalServerPotBaselineAmount(),
				Http.adminGetAllServerPotBaselineAmounts()
			]).then(responses => {
				this.currentTotal = responses[0].body;
				this.items = responses[1].body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		},
		saveNewAmount: function () {
			this.isLoading = true;
			Http.adminPostServerPotBaseline(this.newAmount).then(() => {
				this.$toasted.global.success(this.$t('adminServerPotBaseline.newAmountSuccess'));
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
					noEntries: 'No entries available',
					newAmountSuccess: 'New amount was successfully added',
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
					noEntries: 'Keine Einträge vorhanden',
					newAmountSuccess: 'Der neue Betrag wurde erfolgreich hinzugefügt.',
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
