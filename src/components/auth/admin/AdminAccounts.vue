<template>
	<div class="admin-accounts">
		<div class="container">
			<h1 class="display-4">{{ $t('adminAccounts.title') }}</h1>
			<hr>
			<div v-if="!isLoading">
				<div v-if="items.length > 0">
	
					<div class="justify-content-centermy-1 row">
						<b-form-fieldset horizontal label="Rows per page" class="col-6" :label-size="6">
							<b-form-select :options="[{text:10,value:10},{text:20,value:20},{text:50,value:50}]" v-model="perPage">
							</b-form-select>
						</b-form-fieldset>
					</div>
		
					<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
						<template slot="timeCreated" scope="item">
							{{ item.value | moment(dateFormat) }}
						</template>
						<template slot="publicKeyClient" scope="item">
							<span class="short-key">{{ item.value }}</span>
						</template>
						<template slot="satoshiBalance" scope="item">
							{{ item.value }}
						</template>
						<template slot="virtualBalance" scope="item">
							{{ item.value }}
						</template>
						<template slot="totalBalance" scope="item">
							{{ item.value }}
						</template>
						<template slot="actions" scope="item">
							<b-btn size="sm" :to="{ name: 'admin-accounts-detail', params: { publicKeyClient: item.item.publicKeyClient } }">Details</b-btn>
						</template>
					</b-table>
		
					<div class="justify-content-center row my-1">
						<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
					</div>
	
				</div>
				<div v-else>
					<div class="alert alert-warning">
						<b>{{ $t('adminAccounts.noEntryAvailableTitle') }}</b>
						{{ $t('adminAccounts.noEntryAvailable') }}
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import Http from '../../../services/Http';
import Util from '../../../services/Util';

export default {
	name: 'admin-accounts',
	data: () => {
		return {
			isLoading: false,
			items: [],
			currentPage: 1,
			perPage: 10
		};
	},
	computed: {
		fields: function () {
			return {
				timeCreated: {
					label: this.$t('adminAccounts.fields.timeCreated'),
					sortable: true
				},
				publicKeyClient: {
					label: this.$t('adminAccounts.fields.publicKeyClient'),
					sortable: true
				},
				satoshiBalance: {
					label: this.$t('adminAccounts.fields.satoshiBalance'),
					sortable: true
				},
				virtualBalance: {
					label: this.$t('adminAccounts.fields.virtualBalance'),
					sortable: true
				},
				totalBalance: {
					label: this.$t('adminAccounts.fields.totalBalance')
				},
				actions: {
					label: this.$t('adminAccounts.fields.actions')
				}
			};
		},
		dateFormat: function () {
			return Util.DATE_FORMAT;
		}
	},
	mounted: function () {
		this.updateData();
	},
	methods: {
		details: function (item) {
			alert(JSON.stringify(item));
		},
		updateData: function () {
			this.isLoading = true;

			Http.Auth.Admin.getAccounts()
				.then((response) => {
					this.items = response.body;
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
				});
		}
	},
	i18n: {
		messages: {
			en: {
				adminAccounts: {
					title: 'Account overview',
					noEntryAvailableTitle: 'Attention:',
					noEntryAvailable: 'There is currently no account available.',
					fields: {
						timeCreated: 'Created at',
						publicKeyClient: 'Public Key Client',
						satoshiBalance: 'Satoshi Balance',
						virtualBalance: 'Virtual Balance',
						totalBalance: 'Total Balance',
						actions: 'Actions'
					}
				}
			},
			de: {
				adminAccounts: {
					title: 'Kontoübersicht',
					noEntryAvailableTitle: 'Achtung:',
					noEntryAvailable: 'Derzeit ist kein Konto verfügbar.',
					fields: {
						timeCreated: 'Erstellt am',
						publicKeyClient: 'Public Key Client',
						satoshiBalance: 'Satoshi Saldo',
						virtualBalance: 'Virtuelles Saldo',
						totalBalance: 'Gesamtsaldo',
						actions: 'Aktionen'
					}
				}
			}
		}
	}
};
</script>
