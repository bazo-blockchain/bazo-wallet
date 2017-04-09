<template>
<div id="app">
	<progress-bar></progress-bar>
	<div v-if="initialLoadingComplete">
		<main-header :shown="showHeader"></main-header>
		<router-view
			v-on:toggle-footer="toggleFooter"
			v-on:toggle-header="toggleHeader">
		</router-view>
		<main-footer :shown="showFooter"></main-footer>
	</div>
</div>
</template>

<script>
import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import ProgressBar from './components/ProgressBar';
import Auth from './services/Auth';

export default {
	name: 'app',
	data: function () {
		return {
			showHeader: true,
			showFooter: true,
			initialLoadingComplete: false
		};
	},
	components: {
		ProgressBar,
		MainHeader,
		MainFooter
	},
	methods: {
		toggleHeader: function (show) {
			this.showHeader = show;
		},
		toggleFooter: function (show) {
			this.showFooter = show;
		}
	},
	mounted: function () {
		Auth.refreshUser(this).then(() => {
			this.initialLoadingComplete = true;
		});
	}
};
</script>
