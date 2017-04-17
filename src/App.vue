<template>
<div id="app">
	<progress-bar></progress-bar>
	<div v-if="initialLoadingComplete">
		<main-header :shown="showHeader"></main-header>
		<router-view v-on:toggle-header="toggleHeader"></router-view>
	</div>
</div>
</template>

<script>
import MainHeader from './components/MainHeader';
import ProgressBar from './components/ProgressBar';

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
		MainHeader
	},
	methods: {
		toggleHeader: function (show) {
			this.showHeader = show;
		}
	},
	mounted: function () {
		this.$store.dispatch('initialize').then(() => {
			this.initialLoadingComplete = true;
		});
	}
};
</script>
