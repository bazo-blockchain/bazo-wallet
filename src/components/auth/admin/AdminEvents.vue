<template>
<div class="events">
	<div class="container">
		<h1 class="display-4">{{ $t('adminEvents.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div class="event-urgence-selector">
				<span class="badge badge-danger" @click="changeUrgence('FATAL')" :class="{ 'translucent': !badges.FATAL }">FATAL</span>
				<span class="badge badge-warning" @click="changeUrgence('ERROR')" :class="{ 'translucent': !badges.ERROR }">ERROR</span>
				<span class="badge badge-info" @click="changeUrgence('WARN')" :class="{ 'translucent': !badges.WARN }">WARN</span>
				<span class="badge badge-primary" @click="changeUrgence('INFO')" :class="{ 'translucent': !badges.INFO }">INFO</span>
				<span class="badge badge-default" @click="changeUrgence('DEBUG')" :class="{ 'translucent': !badges.DEBUG }">DEBUG</span>
			</div>
			<div v-if="items.length > 0">
				<div v-for="item in items">
					{{item}}
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
</template>

<script>
import Http from '../../../services/Http';

export default {
	name: 'test',
	data: function () {
		return {
			isLoading: false,
			items: [],
			urgence: 'FATAL',
			badges: {
				FATAL: true,
				ERROR: false,
				WARN: false,
				INFO: false,
				DEBUG: false
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
			opacity: 0.2;
		}
	}
}
</style>
