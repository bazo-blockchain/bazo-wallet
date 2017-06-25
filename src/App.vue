<template>
<div id="app">
	<progress-bar></progress-bar>
	<div id="app-container" v-if="initialLoadingComplete">
		<div class="side-bar-wrapper" v-if="showSideBar" :class="{ shown: hamburgerClicked }">
			<side-bar
				:show-triangle="showSideBarTriangle"
				@close-menu="hamburgerClicked = false"></side-bar>
			<div class="hamburger" @click="hamburgerClicked = !hamburgerClicked">
				<i class="fa fa-bars"></i>
			</div>
		</div>
		<div class="main-view" @click="hamburgerClicked = false">
			<main-header :shown="showHeader" :transparent="showHeaderTransparent"></main-header>
			<router-view
				@toggle-header="toggleHeader"
				@toggle-header-transparent="toggleHeaderTransparent"
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
			showHeaderTransparent: false,
			showSideBar: true,
			showSideBarTriangle: true,
			initialLoadingComplete: false,
			hamburgerClicked: false
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
		toggleHeaderTransparent: function (show) {
			this.showHeaderTransparent = show;
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
@import './styles/variables';

#app-container {
	display: flex;
	align-items: stretch;
	flex-direction: row;

	.main-view {
		flex-grow: 1;
	}

	.side-bar-wrapper {
		z-index: 999;
		flex-shrink: 0;
		width: 0;
		
		/deep/ .side-bar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			margin-left: -100%;
			transition: 0.3s ease all;
			background: $side-bar-black;
			
			.entries .entry.selected:after {
				opacity: 0;
				visibility: hidden;
			}
		}
	
		&.shown {
			/deep/ .side-bar {
				margin-left: 0;
			}
			.hamburger {
				left: 100%;
				margin-left: -2em;
				background: transparent;
				font-size: 1.3em;
				transition: 0.3s ease left;
			}
		}
		
		.hamburger {
			position: fixed;
			top: 0;
			left: 0;
			opacity: 1;
			visibility: visible;
			font-size: 25px;
			width: 2em;
			height: 2em;
			color: white;
			margin-left: 0;
			background: $side-bar-black;
			cursor: pointer;
	
			.fa {
				display: block;
				transform: translate(-50%, -50%);
				position: absolute;
				top: 50%;
				left: 50%;
			}
		}
	}
}
@media (min-width: 500px) {
	#app-container {
		.side-bar-wrapper {
			width: 0;

			/deep/ .side-bar {
				width: 300px;
			}
			.hamburger {
				left: 0;
			}
			&.shown {
				.hamburger {
					left: 300px;
				}
			}
		}
	}
}
@media (min-width: 1210px) {
	#app-container {
		.side-bar-wrapper {
			width: 300px;

			/deep/ .side-bar {
				width: 300px;
				margin-left: 0;
				
				.entries .entry.selected:after {
					opacity: 1;
					visibility: visible;
				}
			}
			.hamburger {
				display: none;
			}
		}
	}
}
@media (min-width: 1400px) {
	#app-container {
		.side-bar-wrapper {
			width: 350px;
			
			/deep/ .side-bar {
				width: 350px;
				margin-left: 0;
			}
			.hamburger {
				display: none;
			}
		}
	}
}
</style>
