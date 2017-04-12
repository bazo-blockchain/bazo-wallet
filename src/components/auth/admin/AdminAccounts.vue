<template>
	<div class="admin-accounts">
		<div class="container">
			<h1>{{ $t('adminAccounts.title') }}</h1>

			<div v-if="items.length > 0">

				<div class="justify-content-centermy-1 row">
					<b-form-fieldset horizontal label="Rows per page" class="col-6" :label-size="6">
						<b-form-select :options="[{text:10,value:10},{text:20,value:20},{text:50,value:50}]" v-model="perPage">
						</b-form-select>
					</b-form-fieldset>
					<b-form-fieldset horizontal label="Search" class="col-6" :label-size="2">
						<b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
					</b-form-fieldset>
				</div>
	
				<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
					<template slot="timeCreated" scope="item">
						{{ item.value | moment("YYYY-MM-DD, HH:mm:ss") }}
					</template>
					<template slot="privateKeyServer" scope="item">
						{{ item.value }}
					</template>
					<template slot="publicKeyServer" scope="item">
						{{ item.value }}
					</template>
					<template slot="publicKeyClient" scope="item">
						{{ item.value }}
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
						<b-btn size="sm" @click="details(item.item)">Details</b-btn>
					</template>
				</b-table>
	
				<div class="justify-content-center row my-1">
					<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
				</div>

			</div>

		</div>
	</div>
</template>

<script>
import Http from '../../../services/Http';

export default {
	name: 'admin-accounts',
	data: () => {
		return {
			items: [],
			fields: {
				timeCreated: {
					label: 'Created',
					sortable: true
				},
				privateKeyServer: {
					label: 'Private Key Server',
					sortable: true
				},
				publicKeyServer: {
					label: 'Public Key Server',
					sortable: true
				},
				publicKeyClient: {
					label: 'Public Key Client',
					sortable: true
				},
				satoshiBalance: {
					label: 'Satoshi Balance',
					sortable: true
				},
				virtualBalance: {
					label: 'Virtual Balance',
					sortable: true
				},
				totalBalance: {
					label: 'Total Balance'
				},
				actions: {
					label: 'Actions'
				}
			},
			currentPage: 1,
			perPage: 10,
			filter: null
		};
	},
	mounted: function () {
		this.updateData();
	},
	methods: {
		details: function (item) {
			alert(JSON.stringify(item));
		},
		updateData: function () {
			Http.adminGetAccounts(this)
				.then((response) => {
					this.items = response.body;
				});
		}
	},
	i18n: {
		messages: {
			en: {
				adminAccounts: {
					title: 'Account overview'
				}
			},
			de: {
				adminAccounts: {
					title: 'Kontoübersicht'
				}
			}
		}
	}
};
</script>
