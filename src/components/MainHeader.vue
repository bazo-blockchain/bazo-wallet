<template>
	<div class="header-bar-wrapper" v-if="shown" :class="{ 'transparent': transparent }">
		<div class="header-bar">
			<!-- <img class="logo" src="../assets/OySy.png" alt="Coinblesk"> -->

			<!-- buttons are hidden on small screens -->
			<div class="buttons pull-right" v-if="configured">
				<div class="button" v-if="configured">
					<user-balance></user-balance>
				</div>
				<!-- <div class="button">
					<router-link class="profile" :to="{ name: 'accounts' }" :class="offlineCheck('profile')">
            <div v-if="mainBazoAccount">
              <img class="user-image" :alt="mainBazoAccount.bazoname" src="../assets/user.svg">
              <span class="email">
                {{ `${mainBazoAccount.bazoname} (${mainBazoAccount.bazoaddress.slice(0, 10)}..${mainBazoAccount.bazoaddress.slice(-10)})`}}
              </span>
            </div>
            <div v-else>
              <img class="user-image" :alt="defaultBazoAccount.bazoname" src="../assets/user.svg">
  						<span class="email">
  							{{ `${defaultBazoAccount.bazoname} (${defaultBazoAccount.bazoaddress.slice(0, 10)}..${defaultBazoAccount.bazoaddress.slice(-10)})`}}
  						</span>
            </div>
					</router-link>
				</div> -->
			</div>

			<!-- buttons are hidden on small screens -->
			<div class="buttons pull-right" v-else>
				<div class="button">
					<a @click="switchLanguage('en')" v-if="currentLanguage === 'de'">
						<i class="fa fa-language"></i> {{ $t('language.de') }}
					</a>
					<a @click="switchLanguage('de')" v-if="currentLanguage === 'en'">
						<i class="fa fa-language"></i> {{ $t('language.en') }}
					</a>
				</div>
				<div class="button" :class="offlineCheck('login')">
					<router-link :to="{ name: 'funds' }">
						<i class="fa fa-sign-in"></i>
						{{ $t('header.signIn') }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import UserBalance from '@/components/auth/user/UserBalance';

export default {
	name: 'main-header',
	data: function () {
		return {};
	},
	props: {
		shown: Boolean,
		transparent: Boolean
	},
	components: {
		UserBalance
	},
	methods: {
		switchLanguage: function (newLanguage) {
			this.$locale.change(newLanguage);
		},
		signout: function () {
			this.$store.dispatch('logout');
			this.$toasted.global.successNoIcon('<i class="fa fa-sign-out"></i>' + this.$t('toasts.signedOff'));
			this.$router.push({ 'path': '/' });
		},
		offlineCheck: function (routeName) {
			return {
				offline: this.isOffline && this.offlineRoutes.indexOf(routeName) === -1
			}
		}
	},
	computed: {
		user: function () {
			return this.$store.state.user;
		},
		auth: function () {
			return this.$store.state.auth;
		},
    configured: function () {
      return this.$store.getters.configured;
    },
    bazoAccounts: function () {
      // let formattedAccounts = this.$store.getters.bazoAccounts.map((account) => {
      //   return this.formatBazoAccount(account);
      // });
      // return formattedAccounts;
      return this.$store.getters.bazoAccounts;
    },
    defaultBazoAccount: function () {
      return this.$store.getters.bazoAccounts[0];
    },
    mainBazoAccount: function () {
      return this.$store.getters.bazoAccounts.find((bazoAccount) => {
        return bazoAccount.isPrime;
      });
    },
		userBalance: function () {
			return this.$store.state.userBalance;
		},
		currentLanguage: function () {
			return this.$locale.current();
		},
		offlineRoutes: function () {
			return this.$router.$offlineRoutes();
		},
		isOffline: function () {
			return this.$store.state.offline;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.header-bar-wrapper {
	position: relative;
	height: 50px;
	width: 100%;

	&.transparent {
		height: 0;
		.header-bar {
			text-shadow: 0 0 5px rgba(0, 0, 0, 0.58);
			height: 50px;
			font-weight: 500;
			padding-right: 10px;
			background-color: #1a1a1a;
			border-bottom-color: transparent;

			.buttons .button a {
				font-size: 120%;
				color: white;
			}

			/deep/ .buttons .button .user-balance a {
				color: white;
			}
		}
	}

	.header-bar {
		background: #1a1a1a;
		position: fixed;
		height: 50px;
		width: 100%;
		// border-bottom: 1px solid #d4d4d4;
		z-index: 100;
		left: 0;
		top: 0;

		.logo {
			max-width: 70%;
			max-height: 40px;
			transform: translate(-50%, -50%);
			position: absolute;
			top: 50%;
			left: 50%;
		}

		.buttons {
			transition: 0.3s ease all;
			height: 100%;
			.button {
				display: inline-block;
				height: 100%;
				padding-left: 10px;
				padding-right: 10px;

				&:last-child {
					padding-right: 20px;
				}

				.profile {
					text-decoration: none;

					.user-image {
						width: 1.4em;
						height: 1.4em;
						display: inline-block;
						vertical-align: middle;
						margin-right: 0.3em;
					}
					.email {
						display: inline-block;
						vertical-align: middle;
						margin-right: -0.2em;
					}
				}

				.logout {
					cursor: pointer;
				}

				a, /deep/ .user-balance {
					display: inline-block;
					position: relative;
					top: 50%;
					transform: translateY(-50%);
					color: white;
					cursor: pointer;
					text-decoration: none;
				}

				/deep/ .user-balance {
					font-size: 17px;
					font-weight: 300;
					cursor: initial;
				}
			}
		}
	}
}
.logo {
	opacity: 0;
	visibility: hidden;
	// height: 32px;
	margin-top: -1px;
}
@media (max-width: $breakpoint-hide-header) {
	.logo {
		opacity: 1;
		visibility: visible;
	}
	.header-bar-wrapper .header-bar {
		background: #1a1a1a;
		border-bottom-color: #464646;
		.buttons {
			opacity: 0;
			visibility: hidden;
		}
	}
}
</style>

<i18n>
{
	"en": {
		"header": {
			"signIn": "Get Started",
			"balanceLastUpdate": "Last Update:<br>{timestamp}"
		}
	},
	"de": {
		"header": {
			"signIn": "Start",
			"balanceLastUpdate": "Letztes Update:<br>{timestamp}"
		}
	}
}
</i18n>
