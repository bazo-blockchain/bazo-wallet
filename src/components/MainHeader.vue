<template>
	<b-navbar toggleable type="inverse" variant="inverse" v-if="shown">
		<div class="container">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-link class="navbar-brand" :to="{ name: 'home' }">
				<img src="../assets/about_cb_2.png" class="logo">
			</b-link>

			<b-collapse is-nav id="nav_collapse">
				
				<b-nav is-nav-bar>
					<b-nav-item :to="{ name: 'forex' }">{{ $t('header.forex') }}</b-nav-item>
				</b-nav>
				<b-nav is-nav-bar v-if="auth.authenticated && auth.role === 'ROLE_ADMIN'">
					<b-nav-item :to="{ name: 'admin-accounts' }">{{ $t('header.adminAccounts') }}</b-nav-item>
					<b-nav-item :to="{ name: 'admin-events' }">{{ $t('header.adminEvents') }}</b-nav-item>
					<b-nav-item :to="{ name: 'admin-user-accounts' }">{{ $t('header.adminUserAccounts') }}</b-nav-item>
					<b-nav-item :to="{ name: 'admin-server-balance' }">{{ $t('header.adminServerBalance') }}</b-nav-item>
				</b-nav>
				<b-nav is-nav-bar v-if="auth.authenticated && auth.role === 'ROLE_USER'">
					<b-nav-item :to="{ name: 'authenticated' }"><small>{{ $t('header.authenticated') }}</small></b-nav-item>
					<b-nav-item :to="{ name: 'user-authenticated' }"><small>{{ $t('header.userAuthenticated') }}</small></b-nav-item>
				</b-nav>

				<b-nav is-nav-bar class="ml-auto">
					<b-nav-item-dropdown v-if="auth.authenticated" right-alignment>
						<template slot="text">
							<span>
								<i class="fa fa-user-circle-o"></i>
								{{ user.email }}
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
					<div v-else>
						<b-nav-item :to="{ name: 'login' }" class="d-inline-block">
							<i class="fa fa-sign-in"></i> {{ $t('header.signIn') }}
						</b-nav-item>
						<b-nav-item :to="{ name: 'registration' }" class="d-inline-block">
							<i class="fa fa-user-plus"></i> {{ $t('header.register') }}
						</b-nav-item>
					</div>
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
					register: 'Registration',
					profile: 'Profile',
					forex: 'Market trend',
					authenticated: 'Auth Page',
					userAuthenticated: 'User Auth Page',
					adminEvents: 'Events',
					adminAccounts: 'Accounts',
					adminUserAccounts: 'User Accounts',
					adminServerBalance: 'Server Balance'
				}
			},
			de: {
				header: {
					signIn: 'Anmelden',
					signOut: 'Abmelden',
					register: 'Registrieren',
					profile: 'Profil',
					forex: 'Kursentwicklung',
					authenticated: 'Auth Seite',
					userAuthenticated: 'User-Auth Seite',
					adminEvents: 'Events',
					adminAccounts: 'Konten',
					adminUserAccounts: 'Benutzerkonten',
					adminServerBalance: 'Server Balance'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.logo {
	height: 22px;
	margin-top: -3px;
}
</style>
