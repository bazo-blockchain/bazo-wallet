<template>
	<div class="side-bar">
		<div class="logo-container">
			<img class="logo" src="../assets/about_cb_2.png" alt="Coinblesk" :to="{ 'name': 'home' }">
		</div>
		<div class="entries" :class="{ 'offline-mode': isOffline }">

			<router-link class="entry" :to="{ name: 'home' }" :class="dynamicLinkClasses('home')" @click.native="closeMenu">
				<i class="fa fa-home"></i>
				<span class="text">{{ $t('sideBar.home') }}</span>
			</router-link>

			<div class="separator"></div>
			<div class="subtitle">{{ $t('sideBar.subtitle.bazo').toUpperCase() }}</div>
			<router-link class="entry" :to="{ name: 'forex' }" :class="dynamicLinkClasses('forex')" @click.native="closeMenu">
				<i class="fa fa-line-chart"></i>
				<span class="text">{{ $t('sideBar.forex') }}</span>
			</router-link>

			<div v-if="auth.authenticated && auth.role === 'ROLE_ADMIN'">
				<div class="separator"></div>
				<div class="subtitle">{{ $t('sideBar.subtitle.administration').toUpperCase() }}</div>
				<router-link class="entry" :to="{ name: 'admin-accounts' }" :class="dynamicLinkClasses('admin-accounts')" @click.native="closeMenu">
					<i class="fa fa-bars"></i>
					<span class="text">{{ $t('sideBar.adminAccounts') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-events' }" :class="dynamicLinkClasses('admin-events')" @click.native="closeMenu">
					<i class="fa fa-calendar-times-o"></i>
					<span class="text">{{ $t('sideBar.adminEvents') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-user-accounts' }" :class="dynamicLinkClasses('admin-user-accounts')" @click.native="closeMenu">
					<i class="fa fa-users"></i>
					<span class="text">{{ $t('sideBar.adminUserAccounts') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-server-balance' }" :class="dynamicLinkClasses('admin-server-balance')" @click.native="closeMenu">
					<i class="fa fa-balance-scale"></i>
					<span class="text">{{ $t('sideBar.adminServerBalance') }}</span>
				</router-link>
			</div>

			<div v-if="configured">
				<router-link class="entry" :to="{ name: 'user-send' }" :class="dynamicLinkClasses('user-send')" @click.native="closeMenu">
					<i class="fa fa-arrow-circle-right"></i>
					<span class="text">{{ $t('sideBar.userSend') }}</span>
				</router-link>
        <router-link class="entry" :to="{ name: 'user-request' }" :class="dynamicLinkClasses('user-request')" @click.native="closeMenu">
          <i class="fa fa-arrow-circle-left"></i>
          <span class="text">{{ $t('sideBar.userRequest') }}</span>
        </router-link>
				<router-link class="entry" :to="{ name: 'user-funds' }" :class="dynamicLinkClasses('user-funds')" @click.native="closeMenu">
					<i class="fa fa-bitcoin"></i>
					<span class="text">{{ $t('sideBar.userFunds') }}</span>
				</router-link>
			</div>

			<div class="separator"></div>
			<div class="subtitle">{{ $t('sideBar.subtitle.accountManagement').toUpperCase() }}</div>
			<div v-if="auth.authenticated">
				<router-link class="entry" :to="{ name: 'profile' }" :class="dynamicLinkClasses('profile')" @click.native="closeMenu">
					<i class="fa fa-user"></i>
					<span class="text">{{ $t('sideBar.profile') }}</span>
				</router-link>
				<a class="entry" @click="logout(); closeMenu();">
					<i class="fa fa-sign-out"></i>
					<span class="text">{{ $t('sideBar.logout') }}</span>
				</a>
			</div>
			<div v-else>
				<router-link class="entry" :to="{ name: 'login' }" :class="dynamicLinkClasses('login')" @click.native="closeMenu">
					<i class="fa fa-sign-in"></i>
					<span class="text">{{ $t('sideBar.login') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'registration' }" :class="dynamicLinkClasses('registration')" @click.native="closeMenu">
					<i class="fa fa-user-plus"></i>
					<span class="text">{{ $t('sideBar.registration') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'password-forgotten' }" :class="dynamicLinkClasses('password-forgotten')" @click.native="closeMenu">
					<i class="fa fa-question-circle"></i>
					<span class="text">{{ $t('sideBar.passwordForgotten') }}</span>
				</router-link>
			</div>
		</div>
		<div class="language-picker" :class="{ 'offline-mode': isOffline }">
			<div class="language" :class="{'selected': currentLanguage === language}" v-for="language in ['en', 'de']" @click="changeLanguage(language)">
				<span class="text" :title="$t('language.' + language)">{{ language.toUpperCase() }}</span>
			</div>
			<div class="balance-wrapper" v-if="auth.role === 'ROLE_USER' && userBalance">
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
	background: $side-bar-black;
	color: #e5e5e5;
	font-size: 18px;
}
.logo-container {
	margin-top: 2em;
	margin-bottom: 2.2em;
	text-align: center;

	.logo {
		max-width: 90%;
		height: 2.5em;
	}
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
		color: #e5e5e5;
		font-weight: 500;
		text-decoration: none;
		transition: 0.2s ease background-color;
		&:hover {
			background-color: #454545;
		}

		&.selected {
			background: $green-color;
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

		.fa {
			position: absolute;
			top: 0.8em;
			left: 1.3em;
			opacity: 0.6;

			&.fa-line-chart {
				/* line chart icon is larger then the others */
				margin-top: 4px;
				font-size: 85%;
			}
		}
		.text {
			display: block;
			font-weight: 300;
			padding: 0.6em 0.65em 0.6em 3.2em;
		}

	}
	.separator {
		height: 0.7em;
		border-top: 1px solid #515151;
		margin-top: 0.7em;
	}
	.subtitle {
		margin-top: 1em;
		margin-bottom: 0.7em;
		font-size: 0.8em;
		margin-left: 0.8em;
	}
}
.language-picker {
	display: block;
	text-align: center;
	padding-top: 0.8em;
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
				background: #626262;
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
		height: 2.3em;
		position: relative;
		padding-top: 0.35em;
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
				"bazo": "Bazo",
				"administration": "Administration",
				"accountManagement":"Account Management"
			},
			"home": "Home",
			"forex": "Market trend",
			"login": "Login",
			"registration": "Registration",
			"forex": "Market trend",
			"userSend": "Transfer Bazo coins",
			"userFunds": "Funds",
			"adminEvents": "Events",
			"adminAccounts": "Accounts",
			"adminUserAccounts": "User Accounts",
			"adminServerBalance": "Server Balance",
			"profile": "Profile",
			"login": "Login",
			"logout": "Logout",
			"registration": "Registration",
			"passwordForgotten": "Forgot your password?"
		}
	},
	"de": {
		"sideBar": {
			"subtitle": {
				"bazo": "Bazo",
				"administration": "Administration",
				"accountManagement": "Kontoverwaltung"
			},
			"home": "Start",
			"forex": "Kursentwicklung",
			"forex": "Kursentwicklung",
			"userSend": "Bazo coins versenden",
			"userFunds": "Guthaben",
			"adminEvents": "Events",
			"adminAccounts": "Konten",
			"adminUserAccounts": "Benutzerkonten",
			"adminServerBalance": "Server Balance",
			"profile": "Profil anzeigen",
			"login": "Anmelden",
			"logout": "Abmelden",
			"registration": "Registrierung",
			"passwordForgotten": "Passwort vergessen?"
		}
	}
}
</i18n>
