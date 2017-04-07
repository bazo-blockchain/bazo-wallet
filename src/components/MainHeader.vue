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
							<span>{{ $t('navbar.language') }}</span>
						</template>

						<b-dropdown-item @click="switchLanguage('en')" :class="{ 'active' : currentLanguage === 'en' }">
							<i class="flag-icon flag-icon-gb"></i> {{ $t('language.en') }}
						</b-dropdown-item>
						<b-dropdown-item @click="switchLanguage('de')" :class="{ 'active' : currentLanguage === 'de' }">
							<i class="flag-icon flag-icon-de"></i> {{ $t('language.de') }}
						</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown right-alignment>
						<template slot="text">
							<span style="font-weight: bold;">User</span>
						</template>

						<b-dropdown-item to="#">Profile</b-dropdown-item>
						<b-dropdown-item to="#">Signout</b-dropdown-item>
					</b-nav-item-dropdown>
				 
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
		}
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
				navbar: {
					language: 'Language'
				}
			},
			de: {
				message: {
					hello: 'hallöööchen'
				},
				navbar: {
					language: 'Sprache'
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
