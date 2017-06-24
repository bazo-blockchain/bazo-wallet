<template>
<div id="app">
	<progress-bar></progress-bar>
	<div id="app-container" v-if="initialLoadingComplete">
		<div class="side-bar" v-if="showSideBar">
			<side-bar :show-triangle="showSideBarTriangle"></side-bar>
		</div>
		<div class="main-view">
			<main-header :shown="showHeader"></main-header>
			<router-view
				@toggle-header="toggleHeader"
				@toggle-side-bar="toggleSideBar"
				@toggle-side-bar-triangle="toggleSideBarTriangle"
				@set-body-background="setBodyBackground"></router-view>
		</div>
	</div>
	<offline-message></offline-message>
</div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import SideBar from '@/components/SideBar';
import ProgressBar from '@/components/ProgressBar';
import OfflineMessage from '@/components/OfflineMessage';

export default {
	name: 'app',
	data: function () {
		return {
			showHeader: true,
			showSideBar: true,
			showSideBarTriangle: true,
			initialLoadingComplete: false
		};
	},
	components: {
		ProgressBar,
		MainHeader,
		OfflineMessage,
		SideBar
	},
	methods: {
		toggleHeader: function (show) {
			this.showHeader = show;
		},
		toggleSideBar: function (show) {
			this.showSideBar = show;
		},
		toggleSideBarTriangle: function (show) {
			this.showSideBarTriangle = show;
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

<style lang="scss" scoped>
#app-container {
	display: flex;
	align-items: stretch;
	flex-direction: row;
	.side-bar {
		z-index: 999;
		flex-shrink: 0;
	}
	.main-view {
		flex-grow: 1;
	}
}
</style>

<style lang="scss">
@mixin set-view-width($side-bar-width) {
	#app-container .side-bar {
		width: $side-bar-width;
	}
	#app-container .main-view .header-bar {
		padding-left: $side-bar-width;
	}
}
@include set-view-width(100px);

@media (min-width: 576px) {
	@include set-view-width(200px);
}
@media (min-width: 768px) {
	@include set-view-width(250px);
}
@media (min-width: 992px) {
	@include set-view-width(300px);
}
@media (min-width: 1200px) {
	@include set-view-width(350px);
}
</style>
