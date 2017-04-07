<template>
<header>
	<b-navbar toggleable type="inverse" variant="inverse">
		<div class="container">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-link class="navbar-brand" :to="{ name: 'home' }">
				<span>Coinblesk</span>
			</b-link>

			<b-collapse is-nav id="nav_collapse">

				<b-nav is-nav-bar>
					<b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
					<b-nav-item :to="{ name: 'secure' }">Secure website</b-nav-item>
				</b-nav>

				<b-nav is-nav-bar class="ml-auto">

					<!-- Navbar dropdowns -->
					<b-nav-item-dropdown right-alignment>
						<template slot="text">
							<span><i class="fa fa-flag-checkered"></i> {{ $t('language.' + currentLanguage) }}</span>
						</template>

						<b-dropdown-item @click="switchLanguage('en')" :class="{ 'active' : currentLanguage === 'en' }">
							<i class="flag-icon flag-icon-gb"></i> {{ $t('language.en') }}
						</b-dropdown-item>
						<b-dropdown-item @click="switchLanguage('de')" :class="{ 'active' : currentLanguage === 'de' }">
							<i class="flag-icon flag-icon-de"></i> {{ $t('language.de') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown v-if="user.authenticated" right-alignment>
						<template slot="text">
							<span>
								<i class="fa fa-user-circle-o"></i>
								{{ user.token.substr(0,10) + '...' }}
							</span>
						</template>

						<b-dropdown-item to="#">
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
	<span>{{currentLanguage}}</span>
	<p>{{ $t("message.hello") }}</p>
	<pre>{{ user }}</pre>
</header>
</template>

<script>
import Auth from '../services/Auth.js';

export default {
	name: 'main-header',
	data: function () {
		return {
			user: Auth.user
		}
	},
	methods: {
		switchLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
		},
		signout: Auth.repudiate
	},
	computed: {
		currentLanguage: function () {
			return this.$locale.current();
		}
	},
	i18n: {
		messages: {
			en: {
				message: {
					hello: 'hii!!! :)'
				},
				header: {
					signIn: 'Sign In',
					signOut: 'Sign Out',
					profile: 'Profile'
				}
			},
			de: {
				message: {
					hello: 'hallöööchen'
				},
				header: {
					signIn: 'Anmelden',
					signOut: 'Abmelden',
					profile: 'Profil'
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
