<template>
<div class="admin-server-balance">
	<div class="container">
		<h1 class="display-4">{{ $t('adminServerBalance.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div v-if="balance">
				<div class="row equation">
					<div class="col-md-3 equation-box sum-of-all-pending-transactions">
						<div class="value">{{ formatSatoshi(balance.sumOfAllPendingTransactions) }}</div>
						<div class="description">&#931; of all pending transactions</div>
					</div>
					<div class="col-md-3 equation-box sum-of-all-virtual-balances">
						<div class="value">{{ formatSatoshi(balance.sumOfAllVirtualBalances) }}</div>
						<div class="description">&#931; of all virtual balances</div>
					</div>
					<div class="col-md-3 equation-box server-pot-baseline">
						<div class="value">{{ formatSatoshi(balance.serverPotBaseline) }}</div>
						<div class="description">Server Pot Baseline 
							<button class="btn btn-secondary btn-sm" @click="editServerPotBaseline">
								<i class="fa fa-edit increase-focus"></i>
							</button>
						</div>
					</div>
					<div class="col-md-3 equation-box server-pot-current ">
						<div class="value">{{ formatSatoshi(balance.serverPotCurrent) }}</div>
						<div class="description">Server Pot Current</div>
					</div>
				</div>
				<hr>
				<div class="row equation">
					<div class="col-md-3 equation-box sum-of-all-pending-transactions">
						<div class="value">{{ formatSatoshi(balance.sumOfAllPendingTransactions) }}</div>
						<div class="description">&#931; of all pending transactions</div>
					</div>
					<div class="col-md-3 equation-box sum-of-all-virtual-balances">
						<div class="value">{{ formatSatoshi(balance.sumOfAllVirtualBalances) }}</div>
						<div class="description">&#931; of all virtual balances</div>
					</div>
					<div class="col-md-3 equation-box server-pot">
						<div class="value">{{ formatSatoshi(balance.serverPotBaseline - balance.serverPotCurrent) }}</div>
						<div class="description">Server Pot</div>
					</div>
				</div>
				<hr>
				<div class="row equation">
					<div class="col-md-3 equation-box sum-of-all-pending-transactions">
						<div class="value">{{ formatSatoshi(balance.sumOfAllPendingTransactions) }}</div>
						<div class="description">&#931; of all pending transactions</div>
					</div>
					<div class="col-md-3 equation-box server">
						<div class="value">{{ formatSatoshi(balance.sumOfAllVirtualBalances + balance.serverPotBaseline - balance.serverPotCurrent) }}</div>
						<div class="description">Server</div>
					</div>
					<div class="col-md-3 equation-box equality">
						<div class="positive" v-if="balance.sumOfAllPendingTransactions === balance.sumOfAllVirtualBalances + balance.serverPotBaseline - balance.serverPotCurrent">
							<span>
								<i class="fa fa-check"></i> EQUAL
							</span>
						</div>
						<div class="negative" v-else>
							<span>
								<i class="fa fa-ban"></i> NOT EQUAL
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('adminServerBalance.error') }}</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '@/services/Http';
import Util from '@/services/Util';

export default {
	name: 'admin-server-balance',
	data: function () {
		return {
			isLoading: false,
			balance: null
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;

			Http.adminGetServerBalance().then((response) => {
				this.balance = response.body;
				this.isLoading = false;
			}, () => {
				this.balance = null;
				this.isLoading = false;
			});
		},
		formatSatoshi: Util.formatSatoshi
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				adminServerBalance: {
					title: 'Server Balance',
					error: 'The data could not be loaded.'
				}
			},
			de: {
				adminServerBalance: {
					title: 'Server Balance',
					error: 'Die Daten konnten nicht geladen werden.'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.equation-box {
	position: relative;

	.value {
		text-align: center;
		font-size: 24px;
		font-weight: 300;
	}
	.description {
		text-align: center;
		font-size: 16px;
		max-width: 80%;
		margin: 0 auto;
	}
	
	&:before,
	&:after {
		content: "";
		display: block;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translate(50%, -50%);
	}
}
.sum-of-all-pending-transactions {
	&:before {
		height: 8px;
		width: 20px;
		border-top: 3px solid black;
		border-bottom: 3px solid black;
		margin-top: 3px;
	}
	&:after {
		content: "!";
		font-weight: 700;
		font-size: 12px;
		margin-top: -9px;
	}
}
.sum-of-all-virtual-balances {
	&:before {
		content: "+";
		font-size: 32px;
	}
}
.server-pot-baseline {
	&:before {
		content: "\2013";
		font-size: 32px;
	}
}
.server {
	&:before {
		content: "";
		height: 8px;
		width: 20px;
		border-top: 3px solid black;
		border-bottom: 3px solid black;
		margin-top: 4px;
		z-index: 1;
	}
	&:after {
		content: "";
		height: 8px;
		width: 20px;
		border-top: 3px solid black;
		margin-top: -1px;
		z-index: 1;
	}
}
.equality {
	border-left: 1px solid #e2e2e2;

	> div {
		text-align: center;
		margin-top: 17px;
		font-size: 24px;
		font-weight: 700;
		
		&.positive {
			$color: #096f09;
			color: $color;
			> span {
				padding: 10px;
				border: 2px solid $color;
			}
		}
		&.negative {
			$color: #ad0505;
			color: $color;
			> span {
				padding: 10px;
				border: 2px solid $color;
			}
		}
	}
}
</style>
