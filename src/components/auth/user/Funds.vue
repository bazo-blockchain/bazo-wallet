<template>
  <div class="user-funds">
    <div class="compact">
      <h1 class="display-4">{{ this.$t('funds.title') }}
        <!-- <small v-if="!isLoading && !loadingError" class="pull-right">
          <span class="total-funds-small">{{ this.$t('funds.total') }}</span>
          <i class="fa fa-credit-card"></i>
          {{totalBalance}}
        </small> -->
      </h1>
      <hr>
      <div class="pos-rel user-funds-content">
        <spinner :is-loading="isLoading"></spinner>

        <div class="table-wrapper" v-if="!isLoading && !loadingError">
          <label>{{$t('funds.description')}}</label>
          <div v-if="configured"class="table-responsive">
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
                <span>-</span>
                {{ item.balance || Math.random().toString()[3] }}
              </div>
            </template>

            <template slot="actions" scope="item">
              <div>
                <b-button variant="secondary" size="sm" @click.prevent="requestBazo">
                  {{ $t('funds.requestBazo') }}
                </b-button>
                <b-popover triggers="hover" :content="$t('funds.requestBazoDescription')" class="popover-element">
                  <i class="fa fa-info-circle increase-focus"></i>
                </b-popover>
              </div>
            </template>
          </b-table>
        </div>
        <div class="" v-else>
          <b-alert v-html="$t('funds.notConfigured')" show variant="info"></b-alert>
        </div>
        <div class="reload-page" v-if="configured">
          <span class="btn btn-secondary" @click.prevent="">
            <i class="fa fa-refresh"></i>
            {{ this.$t('funds.reload') }}
          </span>
        </div>
        <hr>
      </div>
      <div class="row">
        <div class="col-12">
          <b-form-fieldset :label="$t('funds.address')">
            <b-form-input v-model="fundingRequest.surpriseToken" type="text"></b-form-input>
          </b-form-fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <b-form-fieldset :label="$t('funds.amount')">
            <b-input-group>
              <b-form-input v-model="fundingRequest.amount" class="mono amount-input" type="number" min="0" step="any"></b-form-input>
            </b-input-group>
          </b-form-fieldset>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="">
            <label class="col-form-label">{{ $t('funds.target') }}</label>
          </div>
          <b-button-group  class="btn-group" right>
            <b-dropdown v-if="configured" left :text="formattedAccount" :disabled="!multipleAccountsConfigured" >
              <b-dropdown-item  v-for="bazoAccount in bazoAccounts" @click="paymentInfo.selectedAccount = bazoAccount" :key="bazoAccount">
                <span class="currency">{{ formatBazoAccount(bazoAccount) }}</span>
                <i class="fa fa-check" v-if="bazoAccount === paymentInfo.selectedAccount ||
                (paymentInfo.selectedAccount === '' && bazoAccount === this.defaultBazoAccount)"></i>
              </b-dropdown-item>
            </b-dropdown>
            <b-button @click.prevent="createAccount"><i class="fa fa-plus" aria-hidden="true"></i></b-button>
          </b-button-group><br>
        </div>
      </div>
      <div class="row">
        <div class="col-12 submit-btn">
          <b-button @click.prevent="requestBazo" :block="true" variant="primary" :disabled="validRequest" >{{ $t('funds.save') }}</b-button>
          <b-modal :title="$t('funds.modaltitle')"
          size="md" :hide-footer="true" ref="accountcreation">
          <div>
            <div class="alert alert-success" v-html="$t('funds.modaldescription')"></div>
            <b-form-fieldset :label="$t('funds.accountname')">
              <b-form-input type="text" label="City:" v-model="accountGeneration.name"></b-form-input>
              <hr>
              <div class="main-title display-7">{{ $t('funds.accounttitle') }}
              </div>
              <label class="col-form-label">{{ $t('funds.pubkey') }}
                <b-popover :triggers="['hover']" :content="$t('funds.pubkeyDescription')" class="popover-element">
                  <i class="fa fa-info-circle increase-focus"></i>
                </b-popover>
              </label>
              <b-form-input type="username" label="City:" v-model="accountGeneration.publicKey" readonly></b-form-input>
              <label class="col-form-label">{{ $t('funds.privKey') }}
                <b-popover :triggers="['hover']" :content="$t('funds.privkeyDescription')" class="popover-element">
                  <i class="fa fa-info-circle increase-focus"></i>
                </b-popover>
              </label>
              <div class="pos-rel">
                <b-form-input class="privateKeyInput" v-bind:type="accountGeneration.showPrivateKey ? 'text' : 'password'" v-model="accountGeneration.privateKey" readonly><i class="fa fa-eye" aria-hidden="true"></i>
                </b-form-input>
                <span v-if="!accountGeneration.showPrivateKey" class="showHidePubKey" @click.prevent="showPrivateKey"><i class="fa fa-eye" aria-hidden="true"></i></span>
                <span v-if="accountGeneration.showPrivateKey" class="showHidePubKey" @click.prevent="hidePrivateKey"><i class="fa fa-eye-slash" aria-hidden="true"></i></span>

              </div>
            </b-form-fieldset>
            <b-button variant="block"><a download="keyfile.txt" v-bind:href="'data:application/octet-stream;charset=utf-16le;base64,' + base64KeyFile"><i class="fa fa-download" aria-hidden="true"></i>{{ $t('funds.keyfile') }}</a></b-button>
            <div class="button-wrapper">
              <b-button variant="primary" class="pull-right" :disabled="!accountGeneration.name" @click.prevent="saveAccount">{{ $t('funds.add') }}</b-button>
              <b-button variant="default" class="pull-right" @click.prevent="hideModal">{{ $t('funds.cancel') }}</b-button>
            </div>
          </div>
        </b-modal>
        </div>
      </div>
    </form>
  </div>
  <div class="justify-content-center row my-1" v-show="this.tableRows.length > perPage">
    <b-pagination size="md" :total-rows="this.tableRows.length" :per-page="perPage" v-model="currentPage" />
  </div>

</div>
</div>
<!-- <user-transfer @private-key-decrypted="moveFunds" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :amount="convertSatoshiToBitcoin(currentTransfer.amountSatoshi)"></user-transfer>
<user-transfer @private-key-decrypted="createNewAddress" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true"></user-transfer>
<user-transfer @private-key-decrypted="payout" :encrypted-private-key="currentTransfer.encryptedPrivateKey" :only-unlock="true" separate="payout"></user-transfer> -->

</template>

<script>
import Spinner from '@/components/Spinner';
import QrCode from '@/components/QrCode';
import URIScheme from '@/services/URIScheme';
import elliptic from 'elliptic';

export default {
  name: 'user-funds',
  data: function () {
    return {
      isLoading: true,
      loadingError: false,
      currentPage: 1,
      perPage: 15,
      paymentInfo: {
        selectedAccount: ''
      },
      fundingRequest: {
        useExisting: false,
        targetBazoAddress: '',
        surpriseToken: '',
        amount: ''
      },
      accountGeneration: {
        privateKey: '',
        publicKey: '',
        name: '',
        showPrivateKey: false
      },
      totalBalance: 0,
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
    QrCode
  },
  computed: {
    fields () {
      return {
        ticketid: {
          label: this.$t('funds.fields.ticketid'),
          sortable: true
        },
        surpriseid: {
          label: this.$t('funds.fields.surpriseid'),
          sortable: false
        },
        amount: {
          label: this.$t('funds.fields.balance'),
          sortable: true
        },
        target: {
          label: this.$t('funds.fields.target'),
          sortable: false
        }
      }
    },
    allTickets () {
      return [
        {
          ticketid: '13x8y1n3',
          surpriseid: '23by0a973hm323m0as893b493',
          amount: -100,
          target: '24KBD9FJAS24ND9S8O3J93'
        },
        {
          ticketid: '7824b9s4',
          surpriseid: '89shzgs98dz4nm3brs7dh2ap',
          amount: -150,
          target: '893MDMJXUFWM43JN8A9SD79'
        }
      ];
    },
    base64KeyFile: function () {
      return btoa(`${this.accountGeneration.publicKey}\n${this.accountGeneration.privateKey}`)
    },
    bazoAccounts: function () {
      return this.$store.getters.bazoAccounts;
    },
    defaultBazoAccount: function () {
      return this.bazoAccounts.find(function (bazoAccount) {
        return bazoAccount.isPrime;
      });
    },
    formattedAccount: function () {
      if (this.paymentInfo.selectedAccount) {
        return this.formatBazoAccount(this.paymentInfo.selectedAccount)
      } else {
        return this.formatBazoAccount(this.defaultBazoAccount)
      }
    },
    validRequest: function () {
      return this.isLoading ||
            !this.fundingRequest.amount ||
            !this.fundingRequest.surpriseToken ||
            !(this.paymentInfo.selectedAccount || this.defaultBazoAccount)
    },
    multipleAccountsConfigured: function () {
      return this.bazoAccounts.length > 1;
    },
    tableRows () {
      return this.allTickets;
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
    computeAndUpdateTotalFunds: function () {
      let result = 0
      this.bazoAccounts.forEach((bazoAccount) => {
        // requestBalance(bazoAccount.bazoaddress, (res) => {
        //   result += res.body.balance;
        // })
        result += Number(Math.random().toString()[3]);
      })
      this.totalBalance = result;
    },
    resetAccountGeneration: function () {
      this.accountGeneration = {
        privateKey: '',
        publicKey: '',
        name: '',
        showPrivateKey: false
      }
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
    formatBazoAccount: function (account) {
      console.log('acc:', account);
      if (account) {
        return `${account.bazoname} (${account.bazoaddress.slice(0, 10)}..)`
      }
    },
    saveAccount: function () {
      let formattedAddress = this.accountGeneration.publicKey.length === 127 ? '0' + this.accountGeneration.publicKey : this.accountGeneration.publicKey;
      this.$store.dispatch('updateConfig', {
        bazoaddress: formattedAddress,
        bazoname: this.accountGeneration.name,
        isPrime: this.bazoAccounts.length === 0
      }).then(() => {
        this.hideModal();
      });
    },
    createAccount: function () {
      // eslint-disable-next-line
      let curve = new elliptic.ec('p256');
      let keypair = curve.genKeyPair();
      let publicKey = `${keypair.getPublic().x.toJSON()}${keypair.getPublic().y.toJSON()}`
      let privateKey = keypair.getPrivate().toJSON();
      this.accountGeneration.publicKey = publicKey;
      this.accountGeneration.privateKey = privateKey;
      privateKey = null;

      this.$refs.accountcreation.show();
    },
    showPrivateKey: function () {
      this.accountGeneration.showPrivateKey = true;
    },
    hidePrivateKey: function () {
      this.accountGeneration.showPrivateKey = false;
    },
    hideModal: function () {
      this.resetAccountGeneration();
      this.$refs.accountcreation.hide();
    },
    requestBazo: function () {
      console.log('requesting');
    }
  },
  mounted: function () {
    this.loadData();
    this.computeAndUpdateTotalFunds();
  }
};
</script>

<i18n>
  {
    "en": {
      "funds": {
        "title": "Funds",
        "description": "Transfer your Surprise points to OySy coins.",
        "total": "Total",
        "moveFunds": "Move Funds",
        "transferButton": "Transfer",
        "amount": "Amount",
        "reload": "Reload",
        "fields": {
          "surpriseid": "Surprise Token",
          "balance": "Volume",
          "target": "Target Account (OySy)",
          "ticketid": "Ticket ID"
        },
        "target": "Target account",
        "notConfigured": "You don't have an account stored in the OySy Wallet. You can generate and register a new account here, or add your existing Account on the <i>Accounts</i> page",
        "save": "Request OySy Coins",
        "requestBazo": "Request OySy",
        "requestBazoDescription": "You can exchange your Surprise points with OySy coins.",
        "address": "Surprise Token",
        "name": "Name this account",
        "modaltitle": "Your new OySy account",
        "modaldescription": "A new OySy account was generated. Submitting this form will add the account to the Wallet. <b>Make sure to store the private key in a secure place!</b> In order for the account to be valid, you need to request new Oysy coins.",
        "accountname": "Name this account",
        "accounttitle": "Store the following information securely",
        "pubkey": "Public Key (Address)",
        "pubkeyDescription": "The address of an account uniquely identifies the account and can be sent to other users for payments.",
        "privKey": "Private Key",
        "privkeyDescription": "This key needs to be entered whenever a new transaction from the account is issued. Store the key securely and do not share the key with other users.",
        "keyfile": " Key file",
        "cancel": "cancel",
        "add": "Add to Wallet",
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
        "description": "Tauschen Sie Surprise Punkte gegen OySy coins.",
        "amount": "Menge",
        "address": "Token des Surprise-Kontos",
        "requestBazo": "OySy anfordern",
        "requestBazoDescription": "Tauschen Sie Ihre Surprise Punkte gegen OySy coins.",
        "paymentError": "Ein Fehler ist aufgetreten. Versuchen Sie es später noch einmal.",
        "transferButton": "Transferieren",
        "transferDescription": "Transferieren Sie Coins von diesem Account in dem Sie eine neue Zahlung tätigen",
        "reload": "Aktualisieren",
        "notConfigured": "Sie haben momentan kein OySy Konto im System hinterlegt. Sie können entweder hier ein neues Konto generieren und registrieren, oder ein bestehendes auf der <i>Konti</i> Seite hinterlegen.",
        "fields": {
          "surpriseid": "Surprise Token",
          "ticketid": "Ticket Nummer",
          "balance": "Transaktionsvolumen",
          "target": "Zielkonto (OySy)"
        },
        "target": "Zielkonto",
        "save": "OySy Coins anfordern",
        "makePrimary": "Use this account as a primary account",
        "modaltitle": "Ihr OySy Konto",
        "modaldescription": "Ein neues OySy Konto wurde generiert. Mit dem Bestätigen dieser Form wird das Konto im System gespeichert. <b>Stellen Sie sicher dass der private Schlüssel sicher aufbewahrt wird!</b> Damit dieses Konto aktiviert wird, müssen Sie es mit OySy Coins aufladen.",
        "accountname": "Geben Sie dem Konto einen Namen",
        "accounttitle": "Bewahren Sie folgende Informationen auf",
        "pubkey": "Öffentlicher Schlüssel (Adresse)",
        "pubkeyDescription": "Der öffentliche Schlüssel identifiziert ein OySy Konto. Sie können diesen Schlüssel einer anderen Person mitteilen um eine neue Zahlung anzufordern.",
        "privKey": "Privater Schlüssel",
        "privkeyDescription": "Der private Schlüssel muss für alle ausgehenden Transaktionen verwendet werden. Bewahren Sie den Schlüssel sicher auf und teilen Sie ihn niemandem mit.",
        "keyfile": " Sicherungsdatei",
        "cancel": "abbrechen",
        "add": "Konto speichern",
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

.user-funds {
  .form-control.mono {
    font-size: 15px;
  }
  .user-funds-content {
    min-height: 300px;
  }
  .submit-btn, .button-wrapper {
    margin-top: 20px;
  }
  .privateKeyInput {
    padding-right: 40px;
  }
  .showHidePubKey {
    font-size: 16px;
		position: absolute;
		right: 0;
		z-index: 99;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
		padding: 7px 6px;
  }
  .box-wrapper {
    max-width: 650px;
    padding-top: 20px;
    .box {
      width: 100%;
      background: #f8f8f8;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 20px;
      .main-title {
        text-align: center;
      }
    }
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
  /deep/ {
    .dropdown-item {
      cursor: pointer;
      .currency + .fa-check {
        font-size: 60%;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        margin-top: -1px;
      }
    }
    .input-group-btn .btn {
      background: white;
      border: 1px solid rgba(0,0,0,0.15);
      color: inherit;
      font-size: 15px;

      .fa {
        font-size: 85%;
        margin-top: -1px;
      }
    }
  }

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
