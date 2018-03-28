<template>
  <div class="user-funds">
    <div class="compact">
      <h1 class="display-4">{{ this.Translation.t('userAccounts.title') }}
        <!-- <small v-if="!isLoading && !loadingError && configured" class="pull-right">
          <span class="total-funds-small">{{ this.Translation.t('userAccounts.total') }}</span>
          <i class="fa fa-usd"></i>
          {{ this.sumOfBalances }}
        </small> -->
      </h1>
      <div class="pos-rel user-funds-content">
        <spinner :is-loading="isLoading"></spinner>
        <!-- <label v-if="configured">{{Translation.t('userAccounts.description')}}</label> -->

        <!-- <div class="reload-page" v-if="configured">
          <div>{{this.lastBalanceUpdate}}</div>

          <span class="btn btn-secondary oysy-button" @click.prevent="triggerBalanceUpdate(false)">
            <i class="fa fa-refresh"></i>
            {{ this.Translation.t('userAccounts.reload') }}
          </span>
        </div> -->
        <hr v-if="configured">
        <div class="col-12">
          <form>
            <div class="wrapper" v-if="editing || !configured">
              <b-form-fieldset :label="Translation.t('userAccounts.fields.bazoaddress')">
                <b-form-input class="icon-input" v-model="bazoaddress" type="text">
                </b-form-input>

                <i class="fa fa-times right-icon" aria-hidden="true" @click="disableEditing"></i>
              </b-form-fieldset>
            </div>
            <div class="wrapper" v-else>
              <b-form-fieldset :label="Translation.t('userAccounts.fields.bazoaddress')">
                <b-form-input class="icon-input" disabled v-model="defaultBazoAddress" type="text"></b-form-input>
                <i class="fa fa-pencil right-icon" aria-hidden="true" @click="enableEditing"></i>

              </b-form-fieldset>
            </div>


            <!-- <b-form-fieldset :label="Translation.t('userAccounts.fields.bazoname')">
              <b-form-input id="bazoname" v-model="bazoname" ></b-form-input>
            </b-form-fieldset> -->
            <!-- <div >
              <label>
                <b-form-checkbox v-model="isPrime">{{ Translation.t('userAccounts.makePrimary') }}

                </b-form-checkbox>
              </label>
            </div> -->
            <b-button v-if="editing || !configured" class="oysy-button" @click.prevent="saveAccount" :block="true" variant="primary" :disabled="isLoading">{{ Translation.t('userAccounts.save') }}</b-button>
          </form>
          <div class="justify-content-center row my-1" v-show="this.tableRows.length > perPage">
            <b-pagination size="md" :total-rows="this.tableRows.length" :per-page="perPage" v-model="currentPage" />
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
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
      editing: false,
      isPrime: false,
      newAddress: '123',
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
      return accounts;
    },
    defaultBazoAccount: function () {
      if (this.allAccounts && this.allAccounts.length > 0) {
        return this.allAccounts[0]
      }
    },
    defaultBazoAddress: function () {
      if (this.allAccounts && this.allAccounts.length > 0) {
        return this.allAccounts[0].bazoaddress
      } return ''
    },
    sumOfBalances: function () {
      return this.$store.getters.sumOfBalances;
    },
    lastBalanceUpdate: function () {
      return this.$store.getters.lastBalanceUpdated;
    },
    tableRows () {
      return this.$store.getters.bazoAccounts;
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
    triggerBalanceUpdate (silent) {
      this.$store.dispatch('updateUserBalance',
      { url: this.customURLUsed,
        silent: silent
      });
    },
    disableEditing () {
      this.editing = false;
    },
    enableEditing () {
      this.bazoaddress = this.defaultBazoAddress
      this.editing = true;
    },
    encodeBazoAddress (bazoAddress) {
      return URIScheme.encode(bazoAddress);
    },
    makePrimary: function (account) {
      this.$store.dispatch('updatePrimaryAccount', account);
    },
    deleteAccount: function (account) {
      this.$store.dispatch('deleteAccount', account);
      this.triggerBalanceUpdate(false);
    },
    cutBazoAddress: function (bazoAddress) {
      return `${bazoAddress.slice(0, 5)}..${bazoAddress.slice(-5)}`
    },
    parseProps: function () {
      const address = this.$route.query.address;
      if (address) {
        this.bazoaddress = address;
        this.$toasted.global.success(this.Translation.t('userAccounts.prefilledAddress'));

        setTimeout(() => {
          // jQuery('#bazoname').focus();
        }, 1000)
      }
    },
    checkNotificationPermissions: function () {
      try {
        if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      } catch (e) {

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

          // Prefix the account with a '0' in case it is ommited, that way all
          // addresses are 128 characters in length.
          let formattedAddress = this.bazoaddress.length === 127 ? '0' + this.bazoaddress : this.bazoaddress;
          this.$store.dispatch('updateConfig', {
            isPrime: this.isPrime || isPrime,
            bazoaddress: formattedAddress,
            bazoname: this.bazoname
          }).then(() => {
            this.triggerBalanceUpdate(false);
            if (this.$route.query.redirect) {
              this.$router.push({ path: redirect });
            } else {
              this.bazoaddress = '';
              this.bazoname = '';
              this.isLoading = false;
              this.editing = false;
            }
          });
        }
      }
    }
  },
	mounted: function () {
    this.isLoading = false;
    this.triggerBalanceUpdate(false);
    this.parseProps();
    this.checkNotificationPermissions();
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.user-funds-content {
	min-height: 300px;
}
.right-icon {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}
.icon-input {
  padding-right: 40px;
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
