<template>
  <div class="inbound">
    <div class="compact">
      <h1 class="display-4">{{ this.Translation.t('transactions.title') }}
      </h1>
      <hr>
      <div class="pos-rel user-funds-content">
        <spinner :is-loading="isLoading"></spinner>
        <label v-if="configured">{{Translation.t('transactions.description')}}</label>
        <div class="table-wrapper" v-if="!isLoading && !loadingError">
          <div v-if="configured"
          class="table-responsive">

          <b-table responsive small striped hover :items="this.tableRows" :fields="this.fields" :current-page="currentPage" :per-page="perPage">
            <template slot="address" scope="item">
              <div class="no-wrap">
                <span class="mono" v-bind:title="item.value">{{ formatBazoAddress(item.value) }}</span>&nbsp;
                <b-popover triggers="hover" :content="item.value" class="popover-element">
                  <i class="fa fa-eye increase-focus"></i>
                </b-popover>
              </div>
            </template>

            <template slot="sender" scope="item">
              <div class="no-wrap">
                <span class="mono" v-bind:title="item.value">{{ formatBazoAddress(item.value) }}</span>&nbsp;
                <b-popover triggers="hover" :content="item.value" class="popover-element">
                  <i class="fa fa-eye increase-focus"></i>
                </b-popover>
              </div>
            </template>
            <template slot="isPrime" scope="item">
              <div>
                <div class="" v-if="item.item.isPrime">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="" v-else>
                  <b-button variant="secondary" size="sm" @click.prevent="makePrimary(item.item)">
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                  </b-button>
                </div>
              </div>
            </template>
            <template slot="qr" scope="item">
              <div>
                <b-popover triggers="hover" :content="Translation.t('userAccounts.explorer')" class="popover-element">
                  <a :href="'http://explorer.oysy.io/account/' + item.item.bazoaddress">
                    <i class="fa fa-link" aria-hidden="true"></i>
                  </a>
                </b-popover>
              </div>
            </template>
            <template slot="actions" scope="item">
              <div>
                <div>
                  <b-button variant="danger" size="sm" @click.prevent="deleteAccount(item.item)">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                  </b-button>
                  <b-popover triggers="hover" :content="Translation.t('userAccounts.deleteDescription')" class="popover-element">
                    <i class="fa fa-info-circle increase-focus"></i>
                  </b-popover>
                </div>
              </div>
            </template>
          </b-table>
        </div>
        <div class="" v-else>
          <b-alert v-html="Translation.t('userAccounts.notConfigured')" show variant="info"></b-alert>
        </div>
        <div class="reload-page" v-if="configured">
          <span class="btn btn-secondary oysy-button" @click.prevent="getRecentTransactions(false)">
            <i class="fa fa-refresh"></i>
            {{ this.Translation.t('userAccounts.reload') }}
          </span>
        </div>
        <hr v-if="configured">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
import URIScheme from '@/services/URIScheme';
import Translation from '@/config/Translation';
import HttpService from '@/services/HttpService';

export default {
	name: 'transactions',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			currentPage: 1,
			perPage: 15,
      Translation: Translation,
      recentTransactions: []
		}
	},
	components: {
		Spinner
  },
	computed: {
    fields () {
      return {
        verified: {
          label: this.Translation.t('transactions.fields.verified'),
          sortable: false
        },
        amount: {
          label: this.Translation.t('transactions.fields.amount'),
          sortable: true
        },
        address: {
          label: this.Translation.t('transactions.fields.address'),
          sortable: true
        },
        sender: {
          label: this.Translation.t('transactions.fields.sender'),
          sortable: true
        }
      }
    },
    tableRows () {
      return this.recentTransactions;
    },
    allAccounts () {
      let accounts = this.$store.getters.bazoAccounts;
      return accounts;
    },
    configured () {
      return this.$store.getters.accountConfigured;
    },
    customURLUsed: function () {
      if (this.usingCustomHost) {
        return this.$store.getters.customURL;
      } return null;
    }
	},
  methods: {
    encodeBazoAddress (bazoAddress) {
      return URIScheme.encode(bazoAddress);
    },
    formatBazoAddress (address) {
      console.log('addr', address);
      if (address && address.length > 10) {
        return `${address.slice(0, 5)}..${address.slice(-5)}`;
      } return ''
    },
    getRecentTransactions (silent) {
      let addresses = this.allAccounts.map(account => account.bazoaddress);
      console.log(addresses);
      let transactions = []
      HttpService.queryAccountInfo(addresses, this.customURLUsed, silent).then((responses) => {
        console.log('responses', responses);
        responses.forEach(function (response) {
          // if (true) {
          //
          // }
          if (response.body && response.body.content && response.body.content && response.body.content.length > 0) {
            response.body.content.forEach(function (transaction) {
              if (transaction.detail) {
                console.log('found recentes', response.body.content[1].detail);
                if (transaction.detail.to && transaction.detail.amount && transaction.detail.from) {
                  transactions.push({
                    verified: transaction.detail.status,
                    address: transaction.detail.to,
                    amount: transaction.detail.amount,
                    sender: transaction.detail.from
                  })
                }
              }
            })
          }
        })
        this.recentTransactions = transactions
      });
    }
  },
	mounted: function () {
    this.isLoading = false;
    this.getRecentTransactions(false)
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

h1 small {
	margin-top: 6px;
	font-size: 70%;
	font-weight: 300;
}
@media (max-width: 650px) {
	h1 small {
		margin-top: 15px;
		display: block;
		float: none;
	}
}
@media (max-width: 1050px) {
	.table-wrapper {
		overflow-x: auto;
		overflow-y: visible;
		width: 100%;
		max-width: 100%;

		@include light-scrollbar();

		/deep/ table {
			min-width: 1050px;
		}

	}
}

.popover-element {
	color: #999;
	display: inline-block;
	vertical-align: middle;
	margin-left: 3px;
	cursor: help;
}

.create-new-address-button {
	.popover-element {
		margin-top: 3px;
		margin-left: 5px;
	}
}

.table /deep/ thead th {
	border-top: 0;
}

/* default is added to uninteresting rows */
.table /deep/ .table-default td {
	padding: 0.3rem 0.75rem;
	opacity: 0.4;
	font-style: italic;
}
.no-action-possible {
	font-style: italic;
	font-size: 90%;
}

.reload-page {
	// margin-top: 20px;
	text-align: center;
}
</style>
