<template>
<div id="app">
	<progress-bar></progress-bar>
	<spinner :is-loading="!initialLoadingComplete"></spinner>
	<div id="app-container" v-if="initialLoadingComplete">
		<div class="side-bar-wrapper" v-show="showSideBar" :class="{ shown: sideBarIsShown }">
			<side-bar
				@close-menu="sideBarIsShown = false"></side-bar>
			<div class="hamburger" @click="sideBarIsShown = !sideBarIsShown">
				<i class="fa fa-bars"></i>
			</div>
		</div>
		<div class="main-view" @click="sideBarIsShown = false" :class="{ 'grayed-out': sideBarIsShown }">
			<main-header :shown="showHeader" :transparent="showHeaderTransparent"></main-header>
			<router-view
				@toggle-header="toggleHeader"
				@toggle-header-transparent="toggleHeaderTransparent"
				@toggle-side-bar="toggleSideBar"
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
import Spinner from '@/components/Spinner';

export default {
	name: 'app',
	data: function () {
		return {
			showHeader: true,
			showHeaderTransparent: false,
			showSideBar: true,
			initialLoadingComplete: false,
			sideBarIsShown: false
		};
	},
	components: {
		ProgressBar,
		MainHeader,
		OfflineMessage,
		SideBar,
		Spinner
	},
	computed: {
		isOffline: function () {
			return this.$store.state.offline;
		},
		auth: function () {
			return this.$store.state.auth;
		}
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
		setBodyBackground: function (color) {
			if (color === 'dark') {
				color = '#4e4e4e';
			}
			document.querySelector('body').style.background = color;
		},
		screenIsLarge: function () {
			// adapt the 1210px if the styles change
			return window.matchMedia('(min-width: 1210px)').matches;
		},
		resizeHandler: function () {
			// hides menu when the window is resized to the large
			// view. after the change, the watcher of sideBarIsShown
			// is setting the overflow styles of the body tag
			if (this.screenIsLarge()) {
				this.sideBarIsShown = false;
			}
		},
		updateUserBalance: function () {
			if (!this.isOffline) {
				return this.$store.dispatch('updateUserBalance');
			}
		}
	},
	mounted: function () {
		this.$store.dispatch('initialize').then(() => {
			this.initialLoadingComplete = true;
		}, () => {
			this.initialLoadingComplete = true;
		});
    let that = this;
    setInterval(function () {
      that.$store.dispatch('updateUserBalance',
      { url: that.$store.getters.customURL,
        silent: true
      });
    }, 60000)
		window.addEventListener('resize', this.resizeHandler);
	},
	watch: {
		sideBarIsShown: function () {
			if (!this.sideBarIsShown) {
				document.querySelector('body').style.overflow = 'initial';
			} else {
				document.querySelector('body').style.overflow = 'hidden';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import './styles/variables';

#app {
  height: auto;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  background-color: $background-color-black;
}
#app-container {
	display: flex;
	align-items: stretch;
	flex-direction: row;

	.main-view {
		flex-grow: 1;
		max-width: 100%;
		width: 100%;
		overflow: hidden;
    background-color: $background-color-black;

		&:after {
			content: "";
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 150;
			background-color: rgba(0,0,0,0.5);
			transition: 0.3s ease all;
			opacity: 0;
			visibility: hidden;
		}
		&.grayed-out:after {
			opacity: 1;
			visibility: visible;
		}
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
			background: $side-bar-purple;

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
			color: $purple-color;
			margin-left: 0;
			background: rgba(0,0,0,0.4);
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
@media (min-width: 550px) {
	#app-container {
		.side-bar-wrapper {
			width: 0;

			/deep/ .side-bar {
				width: 300px;

				.balance-wrapper {
					display: none;
				}
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
/* if the 1210px change, adapt also the JavaScript function screenIsLarge() */
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
			}
		}
	}
}
</style>
