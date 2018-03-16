<template>
  <div class="side-bar">
    <div class="logo-container">
      <div class="navigation-title">
      OySy
      </div>
    </div>
    <div class="entries" :class="{ 'offline-mode': isOffline }">

      <div class="subtitle" v-if="configured">{{ $t('sideBar.subtitle.bazo').toUpperCase() }}</div>
      <router-link class="entry" :to="{ name: 'home' }" :class="dynamicLinkClasses('home')" @click.native="closeMenu">
        <i class="oysyicon">c</i>
        <span class="text">{{ $t('sideBar.home') }}</span>
      </router-link>
      <div v-if="configured">
        <router-link class="entry" :to="{ name: 'user-send' }" :class="dynamicLinkClasses('user-send')" @click.native="closeMenu">
          <i class="oysyicon">a</i>
          <span class="text">{{ $t('sideBar.userSend') }}</span>
        </router-link>
        <router-link class="entry" :to="{ name: 'user-request' }" :class="dynamicLinkClasses('user-request')" @click.native="closeMenu">
          <i class="oysyicon">b</i>
          <span class="text">{{ $t('sideBar.userRequest') }}</span>
        </router-link>
      </div>

      <div class="separator"></div>
      <div class="subtitle">{{ $t('sideBar.subtitle.accountManagement').toUpperCase() }}</div>

      <div>
        <router-link class="entry" :to="{ name: 'accounts' }" :class="dynamicLinkClasses('accounts')" @click.native="closeMenu">
          <i class="oysyicon">f</i>
          <span class="text">{{ $t('sideBar.userAccounts') }}</span>
        </router-link>
        <router-link class="entry" :to="{ name: 'transactions' }" :class="dynamicLinkClasses('transactions')" @click.native="closeMenu">
          <i class="oysyicon">d</i>
          <span class="text">{{ $t('sideBar.transactions') }}</span>
        </router-link>

        <router-link  class="entry" :to="{ name: 'funds' }" :class="dynamicLinkClasses('funds')" @click.native="closeMenu">
          <i class="fa fa-credit-card"></i>
          <span class="text">{{ $t('sideBar.funds') }}</span>
        </router-link>
        <router-link v-if="configured" class="entry" :to="{ name: 'settings' }" :class="dynamicLinkClasses('settings')" @click.native="closeMenu">
          <i class="fa fa-cog"></i>
          <span class="text">{{ $t('sideBar.settings') }}</span>
        </router-link>
      </div>
    </div>
    <div class="language-picker" :class="{ 'offline-mode': isOffline }">
      <div class="language" :class="{'selected': currentLanguage === language}"
      v-for="language in ['en', 'de']"
      @click="changeLanguage(language)">
      <span class="text" :title="$t('language.' + language)">{{ language.toUpperCase() }}</span>
    </div>
    <div class="balance-wrapper" v-if="configured">
      <user-balance tooltip-placement="top" @link-clicked="closeMenu"></user-balance>
    </div>
  </div>
</div>
</template>

<script>
import Hammer from 'hammerjs';
import UserBalance from '@/components/auth/user/UserBalance';

export default {
	name: 'side-bar',
	data: function () {
		return {
			hammer: []
		};
	},
	components: {
		UserBalance
	},
	computed: {
		isOffline: function () {
			return this.$store.state.offline;
		},
		offlineRoutes: function () {
			return this.$router.$offlineRoutes();
		},
		auth: function () {
			return this.$store.state.auth;
		},
    configured: function () {
      return this.$store.getters.configured;
    },
		userBalance: function () {
			return this.$store.state.userBalance;
		},
		currentLanguage: function () {
			return this.$locale.current();
		}
	},
	methods: {
		logout: function () {
			this.$store.dispatch('logout');
			this.$toasted.global.successNoIcon('<i class="fa fa-sign-out"></i>' + this.$t('toasts.signedOff'));
			this.$router.push({ 'path': '/' });
		},
		dynamicLinkClasses: function (routeName) {
			return {
				offline: this.isOffline && this.offlineRoutes.indexOf(routeName) === -1,
				selected: routeName === this.$route.name || routeName + '-detail' === this.$route.name
			};
		},
		closeMenu: function () {
			this.$emit('close-menu');
		},
		hammerSwipeHandler: function (event) {
			if (event.direction === Hammer.DIRECTION_LEFT) {
				this.closeMenu();
			}
		},
		changeLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
		}
	},
	mounted: function () {
		// hammer did not work with ".entries" on a parent element
		const elements = this.$el.querySelectorAll('.logo-container, .entries, .language-picker');
		for (let i = 0; i < elements.length; i++) {
			const instance = new Hammer(elements[i]);
			instance.on('swipe', this.hammerSwipeHandler);
			this.hammer.push(instance);
		}
	},
	beforeDestroy: function () {
		for (let i = 0; i < this.hammer.length; i++) {
			this.hammer[i].off('swipe', this.hammerSwipeHandler);
			this.hammer[i].destroy();
		}
		this.hammer = [];
	}
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

$language-picker-height: 3.9em;

/* offline-mode needs place for offline-message */
$language-picker-height-offline: 8.9em;

.side-bar {
	background: $purple-color;
	color: #e5e5e5;
	font-size: 18px;
}
.logo-container {
	margin-top: 1em;
	margin-bottom: 1em;
	text-align: center;
  height: 80px;
  font-weight: bold;
  font-size: 2em;

	// .logo {
	// 	max-width: 90%;
	// 	height: 3.5em;
	// }
}
.oysyicon {
  font-family: oysy;
}
.selected > .oysyicon {
  color: $purple-color;
}
.entries {
	overflow-y: auto;
	height: calc(100vh - 2em - 2.2em - 2.5em - #{$language-picker-height});
	padding-bottom: 10px;

	&.offline-mode {
		/* create space for the offline message */
		height: calc(100vh - 2em - 2.2em - 2.5em - #{$language-picker-height-offline});
	}

	&::-webkit-scrollbar {
		width: 12px;
		background-color: rgba(255,255,255,0.1);
		margin-right: 2px;
		border-right: 2px solid #353535;
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgba(255,255,255,0.2);
		border-right: 2px solid #353535;
	}

	.entry {
		position: relative;
		cursor: pointer;
		display: block;
		color: white;
		font-weight: 500;
		text-decoration: none;
		transition: 0.2s ease background-color;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: black;
		&:hover {
			// background-color: #454545;
		}
		&.selected {
			background: $accent-color;
			&:after {
				opacity: 1
			}
			.fa {
				opacity: 1;
			}

			.text {
				font-weight: 500;
			}
		}

    i {
      font-size: 30px;
      font-style: normal;
      position: absolute;
      top: 0.1em;
      left: 0.4em;
    }

		.fa {
      font-style: normal;
			position: absolute;
      top: 0.4em;
      left: 0.4em;
			opacity: 0.6;


			&.fa-line-chart {
				/* line chart icon is larger then the others */
				margin-top: 4px;
				font-size: 85%;
			}
		}
		.text {
			display: block;
			// font-weight: 300;
			padding: 0.6em 0.65em 0.6em 3.2em;
		}

	}
	.separator {
		height: 2em;
		border-top: 1px solid transparent;
		margin-top: 0.7em;
	}
	.subtitle {
		margin-top: 1em;
		// margin-bottom: 0.7em;
		font-size: 0.8em;
    font-weight: 600;
    letter-spacing: 1px;
		padding-left: 0.8em;
    padding-bottom: 0.5em;
    color: #000000;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: black;
	}
}
.language-picker {
	display: block;
	text-align: center;
	height: $language-picker-height;

	&.offline-mode {
		height: $language-picker-height-offline;
	}

	.language {
		display: inline-block;
		width: 2.3em;
		height: 2.3em;
		border-radius: 100px;
		position: relative;
		cursor: pointer;
		transition: 0.2s ease all;

		&.selected {
			&, &:hover {
				background: black;
			}
		}
		&:hover {
			background: #454545;
		}
		& + .language {
			margin-left: 0.2em;
		}

		.text {
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			font-size: 15px;
		}
	}
	.balance-wrapper {
		display: inline-block;
		vertical-align: top;
		height: 2.1em;
		position: relative;
		padding-top: 0;
		margin-left: 0.75em;
		padding-left: 0.75em;
		border-left: 1px solid #656565;
		font-weight: 300;

		/deep/ .user-balance .fa.fa-info-circle {
			margin-right: 0;
		}
	}
}
</style>

<i18n>
{
	"en": {
		"sideBar": {
			"subtitle": {
				"bazo": "The Oyster System",
				"administration": "Administration",
				"accountManagement":"Account Management"
			},
			"home": "Home",
			"userSend": "Transfer OySy pearls",
      "userRequest": "Request OySy pearls",
			"userAccounts": "Accounts",
      "transactions": "Transactions",
      "funds": "Funds",
      "settings": "Settings",
			"login": "Login"
		}
	},
	"de": {
		"sideBar": {
			"subtitle": {
				"bazo": "Das Oyster System",
				"administration": "Administration",
				"accountManagement": "Kontoverwaltung"
			},
			"home": "Start",
			"userSend": "OySy Perlen versenden",
      "userRequest": "OySy Perlen erhalten",
			"userAccounts": "Konti",
      "transactions": "Transaktionen",
      "funds": "Guthaben",
      "settings": "Einstellungen",
			"login": "Anmelden"
		}
	}
}
</i18n>
