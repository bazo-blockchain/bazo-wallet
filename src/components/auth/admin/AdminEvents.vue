<template>
<div class="events">
	<div class="container">
		<h1 class="display-4">{{ $t('adminEvents.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div class="event-urgence-selector">
				<span class="badge badge-very-danger" @click="changeUrgence('FATAL')" :class="{ 'translucent': !badges.FATAL }"><i class="fa fa-exclamation"></i> FATAL</span>
				<span class="badge badge-danger" @click="changeUrgence('ERROR')" :class="{ 'translucent': !badges.ERROR }">ERROR</span>
				<span class="badge badge-warning" @click="changeUrgence('WARN')" :class="{ 'translucent': !badges.WARN }">WARN</span>
				<span class="badge badge-primary" @click="changeUrgence('INFO')" :class="{ 'translucent': !badges.INFO }">INFO</span>
				<span class="badge badge-info" @click="changeUrgence('DEBUG')" :class="{ 'translucent': !badges.DEBUG }">DEBUG</span>
			</div>
			<div v-if="items.length > 0">
				<div class="justify-content-centermy-1 row">
					<b-form-fieldset horizontal label="Rows per page" class="col-6" :label-size="6">
						<b-form-select :options="[{text:50,value:50},{text:100,value:100},{text:200,value:200}]" v-model="perPage">
						</b-form-select>
					</b-form-fieldset>
					<b-form-fieldset horizontal label="Search" class="col-6" :label-size="2">
						<b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
					</b-form-fieldset>
				</div>
				<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
					<template slot="id" scope="item">
						{{ item.value }}
					</template>
					<template slot="urgence" scope="item">
						<span class="badge" :class="{'badge-very-danger': item.value === 'FATAL',
							'badge-danger': item.value === 'ERROR', 'badge-warning': item.value === 'WARN',
							'badge-primary': item.value === 'INFO', 'badge-info': item.value === 'DEBUG', }">
							<i v-if="item.value === 'FATAL'" class="fa fa-exclamation"></i>
							{{ item.value }}
						</span>
					</template>
					<template slot="date" scope="item">
						<div class="nowrap">
							{{ item.value | moment("YYYY-MM-DD, HH:mm:ss") }}
						</div>
					</template>
					<template slot="type" scope="item">
						{{ item.value | enumReadable }}
					</template>
					<template slot="description" scope="item">
						<div class="description-column">
							{{ item.value }}
						</div>
					</template>
				</b-table>
			</div>
			<div v-else>
				<div class="alert alert-warning">
					<b>{{ $t('adminEvents.noEntryAvailableTitle') }}</b>
					{{ $t('adminEvents.noEntryAvailable') }}
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '../../../services/Http';

export default {
	name: 'test',
	data: function () {
		return {
			isLoading: false,
			urgence: 'ERROR',
			badges: {
				FATAL: true,
				ERROR: true,
				WARN: false,
				INFO: false,
				DEBUG: false
			},
			items: [],
			currentPage: 1,
			perPage: 50,
			filter: null,
			fields: {
				id: {
					label: 'ID',
					sortable: false
				},
				urgence: {
					label: 'Urgence',
					sortable: true
				},
				date: {
					label: 'Date',
					sortable: true
				},
				type: {
					label: 'Type',
					sortable: true
				},
				description: {
					label: 'Description',
					sortable: false
				}
			}
		}
	},
	methods: {
		changeUrgence: function (urgence) {
			if (urgence === 'FATAL') {
				this.badges.FATAL = true; this.badges.ERROR = false; this.badges.WARN = false;
				this.badges.INFO = false; this.badges.DEBUG = false;
			} else if (urgence === 'ERROR') {
				this.badges.FATAL = true; this.badges.ERROR = true; this.badges.WARN = false;
				this.badges.INFO = false; this.badges.DEBUG = false;
			} else if (urgence === 'WARN') {
				this.badges.FATAL = true; this.badges.ERROR = true; this.badges.WARN = true;
				this.badges.INFO = false; this.badges.DEBUG = false;
			} else if (urgence === 'INFO') {
				this.badges.FATAL = true; this.badges.ERROR = true; this.badges.WARN = true;
				this.badges.INFO = true; this.badges.DEBUG = false;
			} else if (urgence === 'DEBUG') {
				this.badges.FATAL = true; this.badges.ERROR = true; this.badges.WARN = true;
				this.badges.INFO = true; this.badges.DEBUG = true;
			} else {
				return;
			}
			this.urgence = urgence;
			this.loadData();
		},
		loadData: function () {
			this.isLoading = true;
			Http.adminGetEvents(this.urgence).then((response) => {
				this.items = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		}
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				adminEvents: {
					title: 'Event overview',
					noEntryAvailableTitle: 'Attention:',
					noEntryAvailable: 'There is currently no event available.'
				}
			},
			de: {
				adminEvents: {
					title: 'Eventübersicht',
					noEntryAvailableTitle: 'Achtung:',
					noEntryAvailable: 'Momentan ist kein Event verfügbar.'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.event-urgence-selector {
	font-size: 20px;
	margin-bottom: 15px;
	text-align: right;
	.badge {
		cursor: pointer;
		padding: 0.4em 0.6em;
		&.translucent {
			opacity: 0.3;
			filter: grayscale(80%);
		}
	}
}
.description-column {
	font-size: 85%;
}
</style>
