<template>
<div :class="{'shown': offline}" class="offline-message">
	<div class="box">
		<i class="fa fa-wifi"></i>
		<span class="text">
			<span v-html="$t('offlineMessage.currentlyOfflineTitle')"></span>
			<small>{{ $t('offlineMessage.currentlyOfflineDetail') }}</small>
		</span>
	</div>
</div>
</template>

<script>
export default {
	name: 'offline-message',
	data: function () {
		return {};
	},
	computed: {
		offline: function () {
			return this.$store.state.offline;
		}
	}
};
</script>

<style lang="scss" scoped>
.offline-message {
	opacity: 0;
	visibility: hidden; 
	transition: 0.3s ease all;
	position: relative;
	z-index: 999;
	
	&.shown {
		opacity: 1;
		visibility: visible; 
	}
	
	.box {
		position: fixed;
		bottom: 0.75em;
		left: 0.75em;
		right: 0.75em;
		background: rgba(254, 216, 89, 0.91);
		padding: 1.75em 0.5em 1.75em 3.4em;
		box-shadow: 1px 1px 2px rgba(0,0,0,0.42);
		border-radius: 2px;
		font-size: 20px;
		font-weight: 300;
		z-index: 999;
		
		> .fa {
			position: absolute;
			top: 50%;
			left: 1.3em;
			transform: translateY(-50%);
		}
		> .text {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			line-height: 1.2em;
			padding-right: 10px;
			
			small {
				font-weight: 300;
				font-size: 75%;
				display: block;
			}
		}
	}
}

@media only screen and (max-width: 600px) {
	.offline-message .box > .text > small {
		display: none;
	}
}
</style>

<i18n>
{
	"en": {
		"offlineMessage": {
			"currentlyOfflineTitle": "You are currently <b>offline</b>.",
			"currentlyOfflineDetail": "Multiple features might not work as expected."
		}
	},
	"de": {
		"offlineMessage": {
			"currentlyOfflineTitle": "Sie sind derzeit <b>offline</b>.",
			"currentlyOfflineDetail": "Mehrere Funktionen funktionieren möglicherweise nicht wie erwartet."
		}
	}
}
</i18n>
