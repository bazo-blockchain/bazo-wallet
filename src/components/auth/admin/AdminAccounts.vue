<template>
	<div class="admin-accounts">
		<div class="compact">
			<h1 class="display-4">{{ $t('adminAccounts.title') }}</h1>
			<hr>
			<div class="pos-rel">
				<spinner :is-loading="isLoading"></spinner>
			
				<div v-if="!isLoading">
					<div v-if="items.length > 0">
						
						<div class="table-wrapper">
							<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
								<template slot="userAccountEmail" scope="item">
									<span v-if="item.value">
										<router-link :to="{ name: 'admin-user-accounts-detail', params: { email: item.value } }">{{ item.value }}</router-link>
									</span>
									<span v-else>
										<i class="fa fa-minus"></i>
									</span>
								</template>
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
						</div>
						
						<div class="justify-content-center row" v-show="perPage < this.items.length">
							<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
						</div>

						<div class="rows-per-page">
							<b-form-fieldset>
								<label>{{ $t('general.rowsPerPage') }}</label>&nbsp;
								<b-form-select size="sm" :options="[{text:10,value:10},{text:20,value:20},{text:50,value:50}]" v-model="perPage"></b-form-select>
							</b-form-fieldset>
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
	</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import Spinner from '@/components/Spinner';

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
	components: {
		Spinner
	},
	computed: {
		fields: function () {
			return {
				userAccountEmail: {
					label: this.$t('adminAccounts.fields.belongsToUser'),
					sortable: true
				},
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
			return UtilService.DATE_FORMAT;
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

			HttpService.Auth.Admin.getAccounts()
				.then((response) => {
					this.items = response.body;
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.table-wrapper {
	width: 100%;
	max-width: 100%;
	overflow-x: auto;
	@include light-scrollbar();
	margin-bottom: 20px;
	
	/deep/ table {
		min-width: 900px;
		margin-bottom: 5px;
		thead th {
			border-top: 0;
		}
	}
}
.rows-per-page {
	margin-top: 25px;
	text-align: center;
}
</style>

<i18n>
{
	"en": {
		"adminAccounts": {
			"title": "Account overview",
			"noEntryAvailableTitle": "Attention:",
			"noEntryAvailable": "There is currently no account available.",
			"fields": {
				"belongsToUser": "Belongs to user",
				"timeCreated": "Created at",
				"publicKeyClient": "Public Key Client",
				"satoshiBalance": "Satoshi Balance",
				"virtualBalance": "Virtual Balance",
				"totalBalance": "Total Balance",
				"actions": "Actions"
			}
		}
	},
	"de": {
		"adminAccounts": {
			"title": "Kontoübersicht",
			"noEntryAvailableTitle": "Achtung:",
			"noEntryAvailable": "Derzeit ist kein Konto verfügbar.",
			"fields": {
				"belongsToUser": "Gehört Benutzer",
				"timeCreated": "Erstellt am",
				"publicKeyClient": "Public Key Client",
				"satoshiBalance": "Satoshi Saldo",
				"virtualBalance": "Virtuelles Saldo",
				"totalBalance": "Gesamtsaldo",
				"actions": "Aktionen"
			}
		}
	}
}
</i18n>
