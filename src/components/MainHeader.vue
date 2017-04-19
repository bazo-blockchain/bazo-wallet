<template>
	<b-navbar toggleable type="inverse" variant="inverse" v-if="shown">
		<div class="container">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-link class="navbar-brand" :to="{ name: 'home' }">
				<span>Coin<i class="fa fa-bitcoin"><span>&#3647;</span></i>lesk</span>
			</b-link>

			<b-collapse is-nav id="nav_collapse">

				<b-nav is-nav-bar v-if="auth.authenticated">
					<b-nav-item :to="{ name: 'admin-accounts' }">{{ $t('header.adminAccounts') }}</b-nav-item>
					<b-nav-item :to="{ name: 'admin-events' }">{{ $t('header.adminEvents') }}</b-nav-item>
				</b-nav>
				<b-nav is-nav-bar v-if="auth.authenticated && auth.role === 'ROLE_USER'">
					<b-nav-item :to="{ name: 'authenticated' }"><small>{{ $t('header.authenticated') }}</small></b-nav-item>
					<b-nav-item :to="{ name: 'user-authenticated' }"><small>{{ $t('header.userAuthenticated') }}</small></b-nav-item>
				</b-nav>

				<b-nav is-nav-bar class="ml-auto">

					<!-- Navbar dropdowns -->
					<b-nav-item-dropdown right-alignment>
						<template slot="text">
							<span>{{ $t('language.' + currentLanguage) }}</span>
						</template>

						<b-dropdown-item @click="switchLanguage('en')" :class="{ 'active' : currentLanguage === 'en' }">
							<i class="flag-icon flag-icon-gb"></i> {{ $t('language.en') }}
						</b-dropdown-item>
						<b-dropdown-item @click="switchLanguage('de')" :class="{ 'active' : currentLanguage === 'de' }">
							<i class="flag-icon flag-icon-de"></i> {{ $t('language.de') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown v-if="auth.authenticated" right-alignment>
						<template slot="text">
							<span>
								<i class="fa fa-user-circle-o"></i>
								{{ shortEmail }}
							</span>
						</template>

						<b-dropdown-item :to="{ name: 'profile' }">
							<i class="fa fa-user-circle"></i>
							{{ $t('header.profile') }}
						</b-dropdown-item>
						<b-dropdown-item @click="signout">
							<i class="fa fa-sign-out"></i>
							{{ $t('header.signOut') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>
					
					<b-nav-item v-else :to="{ name: 'login' }">
						<i class="fa fa-sign-in"></i> {{ $t('header.signIn') }}
					</b-nav-item>
				 
				</b-nav>
			</b-collapse>
		</div>
	</b-navbar>
</template>

<script>
import Auth from '../services/Auth.js';

export default {
	name: 'main-header',
	data: function () {
		return {
			auth: Auth.auth
		};
	},
	methods: {
		switchLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
		},
		signout: Auth.logout
	},
	computed: {
		currentLanguage: function () {
			return this.$locale.current();
		},
		shortEmail: function () {
			if (this.user.email) {
				return this.user.email.substr(0, 10) + '...';
			} else {
				return null;
			}
		},
		user: function () {
			return this.$store.state.user;
		}
	},
	props: {
		shown: Boolean
	},
	i18n: {
		messages: {
			en: {
				header: {
					signIn: 'Sign In',
					signOut: 'Sign Out',
					profile: 'Profile',
					authenticated: 'Auth Page',
					userAuthenticated: 'User Auth Page',
					adminEvents: 'Events',
					adminAccounts: 'Accounts'
				}
			},
			de: {
				header: {
					signIn: 'Anmelden',
					signOut: 'Abmelden',
					profile: 'Profil',
					authenticated: 'Auth Seite',
					userAuthenticated: 'User-Auth Seite',
					adminEvents: 'Events',
					adminAccounts: 'Konten'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	background: #eee;
}
</style>
