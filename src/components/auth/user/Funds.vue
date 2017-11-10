<template>
<div class="user-funds">
	<div class="compact">
		<h1 class="display-4">{{ this.$t('funds.title') }}
			<small v-if="!isLoading && !loadingError" class="pull-right">
				<span class="total-funds-small">{{ this.$t('funds.total') }}</span>
				<i class="fa fa-credit-card"></i>
				<!-- {{ convertSatoshiToBitcoin(funds.totalBalance) }} -->
        1
			</small>
		</h1>
		<hr>
		<div class="pos-rel user-funds-content">
			<spinner :is-loading="isLoading"></spinner>

			<div class="table-wrapper" v-if="!isLoading && !loadingError">
        <div v-if="configured"
             class="table-responsive">
             <label>{{$t('funds.description')}}</label>

             <b-table  small striped hover :items="this.tableRows" :fields="this.fields" :current-page="currentPage" :per-page="perPage">
             					<template slot="bazoaddress" scope="item">
             						<div class="no-wrap">

             								<span class="mono" v-bind:title="item.item.bazoaddress">{{ cutBazoAddress(item.item.bazoaddress) }}</span>&nbsp;
                            <!-- <a v-bind:href="item.item.bazoaddress">Link</a> -->
                            <b-popover triggers="hover" :content="item.item.bazoaddress" class="popover-element">
                              <i class="fa fa-info-circle increase-focus"></i>
                            </b-popover>
             								<!-- <a :href="item.item.adddressUrl" :title="item.item.adddressUrl" target="_blank" rel="noopener" class="increase-focus">
             									<i class="fa fa-external-link"></i>
             								</a> -->
             						</div>
             					</template>

             					<template slot="balance" scope="item">
             						<div class="nowrap">
             							<i class="fa fa-star-o"></i>
             							<span >-</span>
             							{{ item.balance || Math.random().toString()[3] }}
             						</div>
             					</template>

             					<template slot="actions" scope="item">
             						<div >
             								<b-button variant="secondary" size="sm" @click.prevent="requestBazo">
             									{{ $t('funds.requestBazo') }}
             								</b-button>
             								<b-popover triggers="hover" :content="$t('funds.requestBazoDescription')" class="popover-element">
             									<i class="fa fa-info-circle increase-focus"></i>
             								</b-popover>
             						</div>
             					</template>
             				</b-table>

             <div class="reload-page">
              <span class="btn btn-secondary" @click.prevent="">
                <i class="fa fa-refresh"></i>
                {{ this.$t('funds.reload') }}
              </span>
            </div>
             <hr>

        </div>
        <div class="" v-else>
          <b-alert show variant="info">{{$t('funds.notConfigured')}}</b-alert>
        </div>

        <form>
          <b-form-fieldset :label="$t('funds.address')">
            <b-form-input v-model="bazoaddress" type="text"></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset :label="$t('funds.name')">
            <b-form-input v-model="bazoname" ></b-form-input>
          </b-form-fieldset>
          <b-button @click.prevent="saveAccount" :block="true" variant="primary" :disabled="isLoading">{{ $t('funds.save') }}</b-button>
        </form>
				<div class="justify-content-center row my-1" v-show="this.tableRows.length > perPage">
					<b-pagination size="md" :total-rows="this.tableRows.length" :per-page="perPage" v-model="currentPage" />
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
// import HttpService from '@/services/HttpService';
// import UtilService from '@/services/UtilService';
import QrCode from '@/components/QrCode';
import UserTransfer from '@/components/auth/user/UserTransfer';
import URIScheme from '@/services/URISCheme'

// import TransactionService from '@/services/TransactionService';

export default {
	name: 'user-funds',
	data: function () {
		return {
			blubb: false,
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
			}
		}
	},
	components: {
		Spinner,
		QrCode,
		UserTransfer
	},
	computed: {
    fields () {
      return {
        bazoname: {
          label: this.$t('funds.fields.name'),
          sortable: true
        },
        bazoaddress: {
          label: this.$t('funds.fields.address'),
          sortable: false
        },
        balance: {
          label: this.$t('funds.fields.balance'),
          sortable: true
        },
        actions: {
          label: this.$t('funds.fields.actions'),
          sortable: false
        }
      }
    },
    allAccounts () {
      return this.$store.getters.bazoAccounts;
    },
    tableRows () {
      return JSON.parse(JSON.stringify(this.allAccounts));
    },
    configured () {
      return this.$store.getters.accountConfigured;
    }
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			return Promise.all([
			]).then(responses => {
				this.loadingError = false;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
				this.loadingError = false;
			})
		},
    encodeBazoAddress (bazoAddress) {
      return URIScheme.encode(bazoAddress);
    },
    makePrimary: function (account) {
      this.$store.dispatch('updatePrimaryAccount', account);
    },
    cutBazoAddress: function (bazoAddress) {
      return `${bazoAddress.slice(0, 10)}..`
    },
    saveAccount: function () {
      const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/';
			if (!this.isLoading) {
				this.isLoading = true;
        // An account should always be a primary account if there are not multiple
        let isPrime;
        if (this.tableRows.length > 0) {
          isPrime = false
        } else {
          isPrime = true
        }
        this.$store.dispatch('updateConfig', {
          isPrime: this.isPrime || isPrime,
          bazoaddress: this.bazoaddress,
          bazoname: this.bazoname
        }).then(() => {
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
	},
	mounted: function () {
		this.loadData();
	}
};
</script>

<i18n>
{
	"en": {
		"funds": {
			"title": "Funds",
      "description": "Transfer your Surprise points to Bazo coins.",
			"total": "Total",
			"moveFunds": "Move Funds",
			"moveFundsDescription": "You can easily transfer your funds from previous Bazo addresses to your current, for Coinblesk used Bazo address",
			"transferButton": "Transfer",
			"reload": "Reload",
			"fields": {
        "name": "Name",
				"address": "Surprise Address",
        "balance": "Balance",
				"actions": "Actions"
			},
      "save": "Add this Surprise account",
      "requestBazo": "Request Bazo",
      "requestBazoDescription": "You can exchange your Surprise points with Bazo coins.",
      "address": "Surprise Address",
      "name": "Name this account",
			"alerts": {
				"success": {
					"moveFunds": "The amount was successfully transferred to the locked account. This transaction may be pending for up to an hour.",
					"createNewAddress": "Your new address was successfully created. Transfer your funds to this address to make payments in Coinblesk. You can directly move your funds from previous addresses to your new address on this page.",
					"payout": "Your virtual balance was transferred successfully to your locked address. The transaction may be pending for up to an hour."
				},
				"error": {
					"moveFunds": "An error occurred during the transaction of the funds. Please try it again later.",
					"createNewAddress": "An error occurred during the creation of a new address. Please try it again later.",
					"payout": "An error occurred during the pay out. Please try it again later."
				}
			}
		}
	},
	"de": {
		"funds": {
			"title": "Guthaben",
			"totalFunds": "Total",
			"moveFunds": "Betrag verschieben",
      "description": "Tauschen Sie Surprise Punkte gegen Bazo coins.",
      "name": "Name für dieses Konto",
      "address": "Adresse des Surprise-Kontos",
      "requestBazo": "Bazo anfordern",
      "requestBazoDescription": "Tauschen Sie Ihre Surprise Punkte gegen Bazo coins.",
			"paymentError": "Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.",
			"transferButton": "Transferieren",
			"transferDescription": "Transferieren Sie Coins von diesem Account in dem Sie eine neue Zahlung tätigen",
			"reload": "Aktualisieren",
			"fields": {
				"surpriseaddress": "Surprise Adresse",
				"actions": "Aktionen",
        "balance": "Guthaben"
			},
      "save": "Surprise Konto hinzufügen",
      "makePrimary": "Use this account as a primary account",
			"alerts": {
				"success": {
					"moveFunds": "Der Betrag ist erfolgreich auf das gesperrte Konto überwiesen worden. Die Transaktion kann bis zu einer Stunde dauern.",
					"createNewAddress": "Ihre neue Adresse wurde erfolgreich erstellt. Überweisen Sie Guthaben auf diese Adresse, um Zahlungen zu tätigen. Sie können das Guthaben von vorherigen Adressen hier direkt auf Ihre neue Adresse überweisen.",
					"payout": "Ihr virtuelles Saldo wurde erfolgreich auf Ihre gesperrte Adresse überwiesen. Die Transaktion kann bis zu einer Stunde dauern."
				},
				"error": {
					"moveFunds": "Es ist ein Fehler beim Überweisen aufgetreten. Bitte versuchen Sie es später erneut.",
					"createNewAddress": "Es ist ein Fehler beim Erstellen einer neuen Adresse aufgetreten. Bitte versuchen Sie es später erneut.",
					"payout": "Es ist ein Fehler beim Auszahlen aufgetreten. Bitte versuchen Sie es später erneut."
				}
			}
		}
	}
}
</i18n>

<style lang="scss" scoped>
@import '../../../styles/variables';

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
	margin-top: 20px;
	text-align: center;
}
</style>