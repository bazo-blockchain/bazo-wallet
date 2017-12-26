<template>
  <div class="user-funds">
    <div class="compact">
      <h1 class="display-4">{{ this.Translation.t('userAccounts.title') }}
        <small v-if="!isLoading && !loadingError && configured" class="pull-right">
          <span class="total-funds-small">{{ this.Translation.t('userAccounts.total') }}</span>
          <i class="fa fa-bitcoin"></i>
          <!-- {{ convertSatoshiToBitcoin(funds.totalBalance) }} -->
          {{this.totalBalance}}
        </small>
      </h1>
      <hr>
      <div class="pos-rel user-funds-content">
        <spinner :is-loading="isLoading"></spinner>
        <label>{{Translation.t('userAccounts.description')}}</label>
        <div class="table-wrapper" v-if="!isLoading && !loadingError">
          <div v-if="configured"
          class="table-responsive">

          <b-table  small striped hover :items="this.tableRows" :fields="this.fields" :current-page="currentPage" :per-page="perPage">
            <template slot="bazoaddress" scope="item">
              <div class="no-wrap">

                <span class="mono" v-bind:title="item.item.bazoaddress">{{ cutBazoAddress(item.item.bazoaddress) }}</span>&nbsp;
                <!-- <a v-bind:href="item.item.bazoaddress">Link</a> -->
                <b-popover triggers="hover" :content="item.item.bazoaddress" class="popover-element">
                  <i class="fa fa-eye increase-focus"></i>
                </b-popover>
                <!-- <a :href="item.item.adddressUrl" :title="item.item.adddressUrl" target="_blank" rel="noopener" class="increase-focus">
                <i class="fa fa-external-link"></i>
              </a> -->
            </div>
          </template>

          <template slot="balance" scope="item">
            <div class="nowrap">
              <i class="fa fa-bitcoin"></i>
              <span >-</span>
              {{ item.item.balance}}
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
              <a href="#/auth/user/request" :href="'https://shrouded-dawn-45355.herokuapp.com/account/' + item.item.bazoaddress">
                <i class="fa fa-link" aria-hidden="true"></i>
              </a>
            </div>
          </template>
          <template slot="actions" scope="item">
            <div>
              <!-- <div >
              <b-button variant="secondary" size="sm" @click.prevent="payoutPreparation">
              {{ Translation.t('userAccounts.transferButton') }}
            </b-button>
            <b-popover triggers="hover" :content="Translation.t('userAccounts.transferDescription')" class="popover-element">
            <i class="fa fa-info-circle increase-focus"></i>
          </b-popover>
        </div>
        <div>
        <b-button variant="secondary" size="sm" @click.prevent="payoutPreparation">
        {{ Translation.t('userAccounts.tradeButton') }}
      </b-button>
      <b-popover triggers="hover" :content="Translation.t('userAccounts.tradeDescription')" class="popover-element">
      <i class="fa fa-info-circle increase-focus"></i>
    </b-popover>
  </div> -->
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
  <b-alert show variant="info">{{Translation.t('userAccounts.notConfigured')}}</b-alert>
</div>
<div class="reload-page" v-if="configured">
  <div>{{this.lastBalanceUpdate}}</div>

  <span class="btn btn-secondary" @click.prevent="triggerBalanceUpdate">
    <i class="fa fa-refresh"></i>
    {{ this.Translation.t('userAccounts.reload') }}
  </span>
</div>
<hr>
<div class="col-12">
  <form>
    <b-form-fieldset :label="Translation.t('userAccounts.fields.bazoaddress')">
      <b-form-input v-model="bazoaddress" type="text"></b-form-input>
    </b-form-fieldset>
    <b-form-fieldset :label="Translation.t('userAccounts.fields.bazoname')">
      <b-form-input id="bazoname" v-model="bazoname" ></b-form-input>
    </b-form-fieldset>
    <div >
      <label>
        <b-form-checkbox v-model="isPrime">{{ Translation.t('userAccounts.makePrimary') }}

        </b-form-checkbox>
      </label>
    </div>
    <b-button @click.prevent="saveAccount" :block="true" variant="primary" :disabled="isLoading">{{ Translation.t('userAccounts.save') }}</b-button>
  </form>
  <div class="justify-content-center row my-1" v-show="this.tableRows.length > perPage">
    <b-pagination size="md" :total-rows="this.tableRows.length" :per-page="perPage" v-model="currentPage" />
  </div>
</div>

</div>
</div>

<!-- <user-transfer @private-key-decrypted="moveFunds" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :amount="convertSatoshiToBitcoin(currentTransfer.amountSatoshi)"></user-transfer>
<user-transfer @private-key-decrypted="createNewAddress" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true"></user-transfer>
<user-transfer @private-key-decrypted="payout" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true" separate="payout"></user-transfer> -->
</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
import jQuery from 'jQuery';
import UserTransfer from '@/components/auth/user/UserTransfer';
import URIScheme from '@/services/URIScheme';
import Translation from '@/config/Translation';

export default {
	name: 'user-funds',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			currentPage: 1,
			perPage: 15,
      bazoaddress: '',
      bazoname: '',
      isPrime: false,
			alerts: {
				success: {
					moveFunds: false,
					createNewAddress: false,
					payout: false
				},
				error: {
					moveFunds: false,
					createNewAddress: false,
					payout: false
				}
			},
      Translation: Translation
		}
	},
	components: {
		Spinner,
		UserTransfer
	},
	computed: {
    fields () {
      return {
        bazoname: {
          label: this.Translation.t('userAccounts.fields.bazoname'),
          sortable: true
        },
        balance: {
          label: this.Translation.t('userAccounts.fields.balance'),
          sortable: true
        },
        bazoaddress: {
          label: this.Translation.t('userAccounts.fields.bazoaddress'),
          sortable: false
        },
        isPrime: {
          label: this.Translation.t('userAccounts.fields.prime'),
          sortable: true
        },
        qr: {
          label: this.Translation.t('userAccounts.fields.explorer'),
          sortable: false
        },
        actions: {
          label: this.Translation.t('userAccounts.fields.actions'),
          sortable: false
        }
      }
    },
    allAccounts () {
      let accounts = this.$store.getters.bazoAccounts;
      this.accounts = accounts;
      return accounts;
    },
    defaultBazoAccount: function () {
      return this.allAccounts.find(function (bazoAccount) {
        return bazoAccount.isPrime;
      });
    },
    totalBalance: function () {
      var sum = this.allAccounts.reduce(function (val, account) {
        if (account && account.balance && !isNaN(account.balance)) {
          return val + account.balance;
        } else {
          return val;
        }
      }, 0);
      return sum;
    },
    lastBalanceUpdate: function () {
      return this.$store.getters.lastBalanceUpdated;
    },
    tableRows () {
      return JSON.parse(JSON.stringify(this.allAccounts));
    },
    configured () {
      return this.$store.getters.accountConfigured;
    },
    usingCustomHost: function () {
      return this.$store.getters.useCustomHost === 'true';
    },
    customURLUsed: function () {
      if (this.usingCustomHost) {
        return this.$store.getters.customURL;
      } return null;
    }
	},
  methods: {
    triggerBalanceUpdate () {
      this.$store.dispatch('updateUserBalance', this.customURLUsed);
    },
    encodeBazoAddress (bazoAddress) {
      return URIScheme.encode(bazoAddress);
    },
    makePrimary: function (account) {
      this.$store.dispatch('updatePrimaryAccount', account);
    },
    deleteAccount: function (account) {
      this.$store.dispatch('deleteAccount', account);
      this.triggerBalanceUpdate();
    },
    cutBazoAddress: function (bazoAddress) {
      return `${bazoAddress.slice(0, 10)}..`
    },
    parseProps: function () {
      const address = this.$route.query.address;
      if (address) {
        this.bazoaddress = address;
        this.$toasted.global.success(this.Translation.t('userAccounts.prefilledAddress'));

        setTimeout(() => {
          jQuery('#bazoname').focus();
        }, 1000)
      }
    },
    findExistingAccountByAddress: function (address) {
      return this.tableRows.find((account) => {
        return account.bazoaddress === address;
      })
    },
    saveAccount: function () {
      const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
      if (!this.isLoading) {
        // An account should always be a primary account if there are not multiple
        let isPrime;
        if (this.tableRows.length > 0) {
          isPrime = false
        } else {
          isPrime = true
        }
        if (this.findExistingAccountByAddress(this.bazoaddress)) {
          this.$toasted.global.error(Translation.t('userAccounts.accountExists'));
        } else {
          this.isLoading = true;
          this.$store.dispatch('updateConfig', {
            isPrime: this.isPrime || isPrime,
            bazoaddress: this.bazoaddress,
            bazoname: this.bazoname
          }).then(() => {
            this.triggerBalanceUpdate();
            if (this.$route.query.redirect) {
              this.$router.push({ path: redirect });
            } else {
              this.bazoaddress = '';
              this.bazoname = '';
              this.isLoading = false;
            }
          });
        }
      }
    }
  },
	mounted: function () {
    this.isLoading = false;
    this.triggerBalanceUpdate();
    this.parseProps();
	}
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.user-funds-content {
	min-height: 300px;
}
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

.fa.green {
	color: $green-color;
}
.fa.red {
	color: $red-color;
}
.fa-qrcode {
	font-size: 120%;
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
.total-funds-small {
	font-size: 60%;
	text-transform: uppercase;
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
