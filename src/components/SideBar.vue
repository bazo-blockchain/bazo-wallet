<template>
	<div class="side-bar">
		<div class="logo-container">
			<img class="logo" src="../assets/about_cb_2.png" alt="Coinblesk" :to="{ 'name': 'home' }">
		</div>
		<div class="entries" :class="{ 'offline-mode': isOffline }">
			
			<router-link class="entry" :to="{ name: 'home' }" :class="dynamicLinkClasses('home')">
				<i class="fa fa-home"></i>
				<span class="text">{{ $t('sideBar.home') }}</span>
			</router-link>
			<router-link class="entry" :to="{ name: 'forex' }" :class="dynamicLinkClasses('forex')">
				<i class="fa fa-bitcoin"></i>
				<span class="text">{{ $t('sideBar.forex') }}</span>
			</router-link>
			
			<div v-if="auth.authenticated && auth.role === 'ROLE_ADMIN'">
				<div class="separator"></div>
				<div class="subtitle">{{ $t('sideBar.administration').toUpperCase() }}</div>
				<router-link class="entry" :to="{ name: 'admin-accounts' }" :class="dynamicLinkClasses('admin-accounts')">
					<i class="fa fa-bars"></i>
					<span class="text">{{ $t('sideBar.adminAccounts') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-events' }" :class="dynamicLinkClasses('admin-events')">
					<i class="fa fa-calendar-times-o"></i>
					<span class="text">{{ $t('sideBar.adminEvents') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-user-accounts' }" :class="dynamicLinkClasses('admin-user-accounts')">
					<i class="fa fa-users"></i>
					<span class="text">{{ $t('sideBar.adminUserAccounts') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'admin-server-balance' }" :class="dynamicLinkClasses('admin-server-balance')">
					<i class="fa fa-balance-scale"></i>
					<span class="text">{{ $t('sideBar.adminServerBalance') }}</span>
				</router-link>
			</div>
			
			<div v-if="auth.authenticated && auth.role === 'ROLE_USER'">
				<div class="separator"></div>
				<router-link class="entry" :to="{ name: 'authenticated' }" :class="dynamicLinkClasses('authenticated')">
					<i class="fa fa-bitcoin"></i>
					<span class="text">{{ $t('sideBar.authenticated') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'user-authenticated' }" :class="dynamicLinkClasses('user-authenticated')">
					<i class="fa fa-bitcoin"></i>
					<span class="text">{{ $t('sideBar.userAuthenticated') }}</span>
				</router-link>
			</div>

			<div class="separator"></div>
			<div class="subtitle">{{ $t('sideBar.accountManagement').toUpperCase() }}</div>
			<div v-if="auth.authenticated">
				<router-link class="entry" :to="{ name: 'profile' }" :class="dynamicLinkClasses('profile')">
					<i class="fa fa-user-o"></i>
					<span class="text">{{ $t('sideBar.profile') }}</span>
				</router-link>
				<a class="entry" @click="logout">
					<i class="fa fa-sign-out"></i>
					<span class="text">{{ $t('sideBar.logout') }}</span>
				</a>
			</div>
			<div v-else>
				<router-link class="entry" :to="{ name: 'login' }" :class="dynamicLinkClasses('login')">
					<i class="fa fa-sign-in"></i>
					<span class="text">{{ $t('sideBar.login') }}</span>
				</router-link>
				<router-link class="entry" :to="{ name: 'registration' }" :class="dynamicLinkClasses('registration')">
					<i class="fa fa-user-plus"></i>
					<span class="text">{{ $t('sideBar.registration') }}</span>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'side-bar',
	data: function () {
		return {};
	},
	props: {
		showTriangle: Boolean
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
				selected: routeName === this.$route.name || routeName + '-detail' === this.$route.name,
				'hide-triangle': !this.showTriangle
			};
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

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
	height: calc(100vh - 2em - 2.2em - 2.5em);
	padding-bottom: 10px;
	
	&.offline-mode {
		/* create space for the offline message */
		padding-bottom: 96px;
	}
	
	.entry {
		position: relative;
		cursor: pointer;
		display: block;
		color: #e5e5e5;
		font-weight: 500;
		text-decoration: none;
		transition: 0.2s ease background-color;
		
		&:after {
			content: "";
			display: block;
			width: 0;
			height: 0;
			border-right: 0.7em solid white;
			border-top: 0.8em solid transparent;
			border-bottom: 0.8em solid transparent;
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			opacity: 0;
		}
		
		&.selected {
			background: $green-color;
			&:after {
				opacity: 1
			}
			&.hide-triangle:after {
				opacity: 0;
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
</style>

<i18n>
{
	"en": {
		"sideBar": {
			"home": "Home",
			"forex": "Market trend",
			"administration": "ADMINISTRATION",
			"login": "Login",
			"registration": "Registration",
			"forex": "Market trend",
			"authenticated": "Auth Page",
			"userAuthenticated": "User Auth Page",
			"adminEvents": "Events",
			"adminAccounts": "Accounts",
			"adminUserAccounts": "User Accounts",
			"adminServerBalance": "Server Balance",
			"accountManagement":"Account Management",
			"profile": "Profile",
			"login": "Login",
			"logout": "Logout",
			"registration": "Registration"
		}
	},
	"de": {
		"sideBar": {
			"home": "Start",
			"forex": "Kursentwicklung",
			"administration": "ADMINISTRATION",
			"forex": "Kursentwicklung",
			"authenticated": "Auth Seite",
			"userAuthenticated": "User-Auth Seite",
			"adminEvents": "Events",
			"adminAccounts": "Konten",
			"adminUserAccounts": "Benutzerkonten",
			"adminServerBalance": "Server Balance",
			"accountManagement": "Kontoverwaltung",
			"profile": "Profil anzeigen",
			"login": "Login",
			"logout": "Logout",
			"registration": "Registrierung"
		}
	}
}
</i18n>
