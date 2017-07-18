<template>
<div class="user-balance">
	<a href @click.prevent="openFundsPage">
		<i class="fa fa-bitcoin"></i>
		<span class="value">{{ totalBalanceBTC }}</span>
	</a>
	<b-tooltip :content="balanceDateFormatted" :placement="tooltipPlacement" class="info" :offset="offset">
		<i class="fa fa-info-circle increase-focus" :class="{ 'red': isOffline || oldBalance }"></i>
	</b-tooltip>
</div>
</template>

<script>
import moment from 'moment';
import UtilService from '@/services/UtilService';

export default {
	name: 'user-balance',
	data: function () {
		return {
			userBalanceIsLoading: false,
			now: moment()
		}
	},
	props: {
		tooltipPlacement: {
			type: String,
			default: 'bottom'
		}
	},
	computed: {
		isOffline: function () {
			return this.$store.state.offline;
		},
		oldBalance: function () {
			if (!this.userBalance || !this.userBalance.lastUpdate) {
				return true;
			}
			return moment(this.userBalance.lastUpdate).isBefore(this.now.subtract(5, 'minutes'));
		},
		userBalance: function () {
			return this.$store.state.userBalance;
		},
		totalBalanceBTC: function () {
			if (this.userBalance && this.userBalance.totalBalance) {
				return UtilService.convertSatoshiToBitcoin(this.userBalance.totalBalance);
			}
			return 0;
		},
		balanceDateFormatted: function () {
			if (this.userBalance && this.userBalance.lastUpdate) {
				return this.$t('userBalance.lastUpdate', { timestamp: moment(this.userBalance.lastUpdate).format(UtilService.DATE_FORMAT) });
			}
			return '';
		},
		offset: function () {
			if (this.tooltipPlacement === 'bottom') {
				return '-10px 0';
			} else {
				return '10px 0';
			}
		}
	},
	methods: {
		updateNow: function () {
			this.now = moment();
		},
		openFundsPage: function () {
			this.$emit('link-clicked');
			this.$router.push({ name: 'user-funds' });
		}
	},
	mounted: function () {
		window.setInterval(this.updateNow, 1000)
	},
	clearInterval: function () {
		window.clearInterval(this.updateNow);
	}
};
</script>

<style lang="scss" scoped>
.user-balance {
	text-decoration: none;
	
	a:hover,
	a:active,
	a:focus,
	a:visited {
		color: inherit;
		text-decoration: none;
	}

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
@keyframes bumping {
	0%,
	100% {
		transform: scale(1);
	},
	50% {
		transform: scale(1.2);
	}
}
</style>

<i18n>
{
	"en": {
		"userBalance": {
			"lastUpdate": "Last Update<br>{timestamp}"
		}
	},
	"de": {
		"userBalance": {
			"lastUpdate": "Letztes Update<br>{timestamp}"
		}
	}
}
</i18n>
