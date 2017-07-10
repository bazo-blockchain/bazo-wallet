<template>
	<div class="header-bar-wrapper" v-if="shown" :class="{ 'transparent': transparent }">
		<div class="header-bar">
			<img class="logo" src="../assets/about_cb_2.png" alt="Coinblesk">
			
			<!-- buttons are hidden on small screens -->
			<div class="buttons pull-right" v-if="auth.authenticated">
				<div class="button" v-if="auth.role === 'ROLE_USER'">
					<a class="balance">
						<i class="fa fa-bitcoin"></i>
						<span class="value">{{ totalBalanceFormatted }}</span>
						<b-tooltip :content="balanceDateFormatted" placement="bottom" class="info" offset="-10px 0">
							<i class="fa fa-info-circle increase-focus" :class="{ 'red': isOffline }"></i>
						</b-tooltip>
					</a>
				</div>
				<div class="button">
					<router-link class="profile" :to="{ name: 'profile' }" :class="offlineCheck('profile')">
						<img class="user-image" :alt="user.email" src="../assets/user.svg">
						<span class="email">
							{{ user.email }}
						</span>
					</router-link>
				</div>
				<div class="button">
					<a @click="signout" class="logout increase-focus" :title="$t('header.logout')">
						<i class="fa fa-sign-out"></i>
					</a>
				</div>
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
					<router-link :to="{ name: 'login' }">
						<i class="fa fa-sign-in"></i>
						{{ $t('header.signIn') }}
					</router-link>
				</div>
				<div class="button" :class="offlineCheck('registration')">
					<router-link :to="{ name: 'registration' }">
						<i class="fa fa-user-plus"></i>
						{{ $t('header.register') }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import UtilService from '@/services/UtilService';

export default {
	name: 'main-header',
	data: function () {
		return {
			userBalanceIsLoading: false
		};
	},
	props: {
		shown: Boolean,
		transparent: Boolean
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
		},
		loadUserBalance: function () {
			if (!this.userBalanceIsLoading && !this.isOffline) {
				this.userBalanceIsLoading = true;

				this.$store.dispatch('updateUserBalance').then(() => {
					this.userBalanceIsLoading = false;
				}, () => {
					this.userBalanceIsLoading = false;
				});
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
		userBalance: function () {
			return this.$store.state.userBalance;
		},
		totalBalanceFormatted: function () {
			if (this.userBalance && this.userBalance.totalBalance) {
				return UtilService.formatSatoshi(this.userBalance.totalBalance);
			}
			return 0;
		},
		balanceDateFormatted: function () {
			if (this.userBalance && this.userBalance.lastUpdate) {
				return this.$t('header.balanceLastUpdate', { timestamp: moment(this.userBalance.lastUpdate).format(UtilService.DATE_FORMAT) });
			}
			return '';
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
	},
	mounted: function () {
		this.loadUserBalance();
		window.setInterval(this.loadUserBalance, 20000);
	},
	beforeDestory: function () {
		window.clearInterval(this.loadUserBalance);
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.header-bar-wrapper {
	position: relative;
	height: 40px;
	width: 100%;
	
	&.transparent {
		height: 0;
		.header-bar {
			text-shadow: 0 0 5px rgba(0, 0, 0, 0.58);
			height: 70px;
			font-weight: 500;
			padding-right: 10px;
			background-color: transparent;
			border-bottom-color: transparent;
			
			.buttons .button a {
				font-size: 120%;
				color: white;
			}
		}
	}
	
	.header-bar {
		background: #f1f1f1;
		position: fixed;
		height: 50px;
		width: 100%;
		border-bottom: 1px solid #d4d4d4;
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
				
				.balance {
					font-size: 17px;
					font-weight: 300;
					cursor: initial;
					
					.fa, .value, .info {
						display: inline-block;
						vertical-align: middle;
					}
					.info {
						line-height: 0;
					}
					
					.fa-info-circle {
						color: #bfbfbf;
						font-size: 80%;
						margin-left: 3px;
						margin-right: 10px;
						cursor: help;
						line-height: 0;
						&.red {
							color: #d83838;
							animation: bumping 2s infinite;
							text-shadow: 0 0 5px rgba(255, 255, 255, 0.58);
						}
					}
				}
				
				a {
					display: inline-block;
					position: relative;
					top: 50%;
					transform: translateY(-50%);
					color: #555;
					cursor: pointer;
					text-decoration: none;
				}
			}
		}
	}
}
@keyframes bumping {
	0%,
	100% {
		transform: scale(1);
	},
	50% {
		transform: scale(1.2);
	}
}
.logo {
	opacity: 0;
	visibility: hidden;
	height: 22px;
	margin-top: -1px;
}
@media (max-width: $breakpoint-hide-header) {
	.logo {
		opacity: 1;
		visibility: visible;
	}
	.header-bar-wrapper .header-bar {
		background: #626262;
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
			"signIn": "Sign In",
			"logout": "Sign Out",
			"register": "Registration",
			"balanceLastUpdate": "Last Update:<br>{timestamp}"
		}
	},
	"de": {
		"header": {
			"signIn": "Anmelden",
			"logout": "Abmelden",
			"register": "Registrieren",
			"balanceLastUpdate": "Letztes Update:<br>{timestamp}"
		}
	}
}
</i18n>
