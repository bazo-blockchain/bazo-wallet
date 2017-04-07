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
					<b-nav-item-dropdown text="Lang" right-alignment>
						<b-dropdown-item @click="switchLanguage('en')">EN</b-dropdown-item>
						<b-dropdown-item @click="switchLanguage('de')">DE</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown right-alignment>

						<!-- Using text slot -->
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
	i18n: {
		messages: {
			de: {
				message: {
					hello: 'hallöööchen'
				}
			},
			en: {
				message: {
					hello: 'hii!!! :)'
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
