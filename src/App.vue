<template>
<div id="app">
	<progress-bar></progress-bar>
	<main-header :shown="showHeader"></main-header>
	<router-view
		v-on:toggle-footer="toggleFooter"
		v-on:toggle-header="toggleHeader">
	</router-view>
	<main-footer :shown="showFooter"></main-footer>
</div>
</template>

<script>
import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import ProgressBar from './components/ProgressBar';

export default {
	name: 'app',
	data: function () {
		return {
			showHeader: true,
			showFooter: true
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
	}
};
</script>
