<template>
<div id="app">
	<progress-bar></progress-bar>
	<div v-if="initialLoadingComplete">
		<main-header :shown="showHeader"></main-header>
		<router-view v-on:toggle-header="toggleHeader" v-on:set-body-background="setBodyBackground"></router-view>
	</div>
	<offline-message></offline-message>
</div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import ProgressBar from '@/components/ProgressBar';
import OfflineMessage from '@/components/OfflineMessage';

export default {
	name: 'app',
	data: function () {
		return {
			showHeader: true,
			initialLoadingComplete: false
		};
	},
	components: {
		ProgressBar,
		MainHeader,
		OfflineMessage
	},
	methods: {
		toggleHeader: function (show) {
			this.showHeader = show;
		},
		setBodyBackground: function (color) {
			if (color === 'dark') {
				color = '#4e4e4e';
			}
			document.querySelector('body').style.background = color;
		}
	},
	mounted: function () {
		this.$store.dispatch('initialize').then(() => {
			this.initialLoadingComplete = true;
		});
	}
};
</script>
