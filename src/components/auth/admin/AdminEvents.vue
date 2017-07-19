<template>
<div class="events">
	<div class="compact">
		<h1 class="display-4">{{ $t('adminEvents.title') }}</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>
			<div v-if="!isLoading">
				<div class="event-urgence-selector">
					<span class="badge badge-very-danger" @click="changeUrgence('FATAL')" :class="{ 'translucent': !badges.FATAL }"><i class="fa fa-exclamation"></i> FATAL</span>
					<span class="badge badge-danger" @click="changeUrgence('ERROR')" :class="{ 'translucent': !badges.ERROR }">ERROR</span>
					<span class="badge badge-warning" @click="changeUrgence('WARN')" :class="{ 'translucent': !badges.WARN }">WARN</span>
					<span class="badge badge-primary" @click="changeUrgence('INFO')" :class="{ 'translucent': !badges.INFO }">INFO</span>
					<span class="badge badge-info" @click="changeUrgence('DEBUG')" :class="{ 'translucent': !badges.DEBUG }">DEBUG</span>
				</div>
				<div v-if="items.length > 0">
					<div class="table-wrapper">
						<b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
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
									{{ item.value | moment(dateFormat) }}
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
					
					<div class="justify-content-center row pagination-bar" v-show="perPage < this.items.length">
						<b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage"></b-pagination>
					</div>
					
					<div class="rows-per-page">
						<label>
							{{ $t('general.rowsPerPage') }}
							<b-form-select :options="[{text:50,value:50},{text:100,value:100},{text:200,value:200}]" v-model="perPage" size="sm"></b-form-select>
						</label>
					</div>
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
</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import Spinner from '@/components/Spinner';

export default {
	name: 'admin-events',
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
			fields: {
				id: {
					label: 'ID',
					sortable: false
				},
				urgence: {
					label: this.$t('adminEvents.fields.urgence'),
					sortable: true
				},
				date: {
					label: this.$t('adminEvents.fields.date'),
					sortable: true
				},
				type: {
					label: this.$t('adminEvents.fields.type'),
					sortable: true
				},
				description: {
					label: this.$t('adminEvents.fields.description'),
					sortable: false
				}
			}
		}
	},
	components: {
		Spinner
	},
	computed: {
		dateFormat: function () {
			return UtilService.DATE_FORMAT;
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
			HttpService.Auth.Admin.getEvents(this.urgence).then((response) => {
				this.items = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		}
	},
	mounted: function () {
		this.loadData();
	}
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.event-urgence-selector {
	margin-top: -62px;
	margin-bottom: 35px;
	font-size: 20px;
	text-align: right;
	white-space: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
	
	.badge {
		cursor: pointer;
		padding: 0.4em 0.6em;
	}
}
.description-column {
	font-size: 85%;
}
@media (max-width: 850px) {
	.event-urgence-selector {
		margin-top: 0;
		margin-bottom: 20px;
		font-size: 17px;
		text-align: center;
	}
}
.table-wrapper {
	width: 100%;
	max-width: 100%;
	margin-bottom: 20px;
	overflow-x: auto;
	@include light-scrollbar();
	
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
		"adminEvents": {
			"title": "Event overview",
			"noEntryAvailableTitle": "Attention:",
			"noEntryAvailable": "There is currently no event available in this event urgence.",
			"fields": {
				"urgence": "Urgence",
				"date": "Date",
				"type": "Category",
				"description": "Description"
			}
		}
	},
	"de": {
		"adminEvents": {
			"title": "Eventübersicht",
			"noEntryAvailableTitle": "Achtung:",
			"noEntryAvailable": "Momentan ist kein Event verfügbar in dieser Dringlichkeitsstufe.",
			"fields": {
				"urgence": "Dringlichkeit",
				"date": "Datum",
				"type": "Kategorie",
				"description": "Beschreibung"
			}
		}
	}
}
</i18n>
