<template>
  <div class="user-send">
    <div class="compact">
      <h1 class="display-4">{{ Translation.t('userRequest.title') }}</h1>
      <hr>
      <div class="pos-rel user-send-content">
        <spinner :is-loading="isLoading"></spinner>

        <div>
          <div class="box-wrapper" v-if="!isLoading && !loadingError">
            <div class="box">
              <div class="main-title display-7">{{ Translation.t('userRequest.boxTitle') }}</div>
              <hr>
              <form>
                <div class="row">
                  <div class="col-md-12">
                    <label class="col-form-label" for="selection">{{ Translation.t('userRequest.accountUsed') }}
                      <b-popover :triggers="['hover']" :content="Translation.t('userRequest.paymentInfo')" class="popover-element">
                        <i class="fa fa-info-circle increase-focus"></i>
                      </b-popover>
                    </label>
                  </div>

                  <div class="col-md-12">
                    <b-form-fieldset>
                      <b-input-group>
                        <b-form-input v-model="paymentInfo.amount" class="mono amount-input" type="number" min="0" step="any" :class="{ 'form-error': formIsTouched && !validAmount }"></b-form-input>
                        <b-input-group-button slot="right">
                          <b-dropdown :disabled="!multipleAccountsConfigured" :text="formatBazoAccount(paymentInfo.selectedAccount) || formatBazoAccount(defaultBazoAccount)" variant="default" right>
                            <b-dropdown-item v-for="bazoAccount in bazoAccounts" @click="paymentInfo.selectedAccount = bazoAccount" :key="bazoAccount">
                              <span class="currency">{{ formatBazoAccount(bazoAccount) }}</span>
                              <i class="fa fa-check" v-if="bazoAccount === paymentInfo.selectedAccount ||
                              (paymentInfo.selectedAccount === '' && bazoAccount === defaultBazoAccount)"></i>													</b-dropdown-item>
                            </b-dropdown>
                          </b-input-group-button>
                        </b-input-group>
                      </b-form-fieldset>
                    </div>

                    <div class="col-md-12" v-if="this.advancedOptionsShown">
                      <label class="col-form-label" for="selection">{{ Translation.t('userRequest.posid') }}
                        <b-popover :triggers="['hover']" :content="Translation.t('userRequest.posiddescription')" class="popover-element">
                          <i class="fa fa-info-circle increase-focus"></i>
                        </b-popover>
                      </label>
                      <b-form-input v-model="paymentInfo.posid" class="mono posid-input"></b-form-input>
                    </div>

                    <div class="col-12">
                      <hr>
                      <div>
                        <label for="">{{ Translation.t('userRequest.transfertype') }}</label>
                      </div>
                      <b-button-group>
                        <b-button class="payment-variant-btn" variant="primary" @click.prevent="showQR">
                          <i class="fa fa-qrcode"></i>
                          <span>QR Code</span>
                        </b-button>
                        <b-button class="payment-variant-btn" :disabled="!bluetooth.BTSupported" variant="primary" @click.prevent="openBT">
                          <i class="fa fa-bluetooth-b"></i>
                          <span>Bluetooth</span>
                        </b-button>
                        <b-button v-if="isAndroidDevice" class="payment-variant-btn" :disabled="!nfc.NFCSupported" variant="primary" @click.prevent="openNFC">
                          <i class="fa fa-rss"></i>
                          <span>NFC</span>
                        </b-button>
                      </b-button-group>
                      <a class="transfer-link" v-if="isMobileDevice && advancedOptionsShown" v-bind:href="whatsappLink" data-action="share/whatsapp/share">
                        <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        <span>Whatsapp</span>
                      </a>
                      <a class="transfer-link" v-if="isAndroidDevice && advancedOptionsShown" v-bind:href="nfcbridgeLink" >
                        <i class="fa fa-android" aria-hidden="true"></i>
                        <span>NFC Bridge</span>
                      </a>

                      <div class="nfc-screen" :class="{'shown': nfc.NFCShown}" @click="closeNFC">
                        <div class="close" @click="closeNFC">&times;</div>
                        <div class="nfc-title" @click.stop>
                          <i class="fa fa-rss"></i>
                          {{ Translation.t('userRequest.NFCTitle') }}
                        </div>

                        <div class="nfc-display-wrapper" @click.stop>
                          <div class="nfc-notice">{{ Translation.t('userRequest.NFCNotice') }}

                          </div>
                          <div class="nfc-status-wrapper">
                            <svg :class="{'nfc-watch-active': nfc.NFCSending, 'nfc-watch-success': nfc.NFCSuccess}" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"/></svg>

                          </div>
                          <div class="nfc-status">
                            {{ nfc.NFCStatus }}
                          </div>
                        </div>
                      </div>
                      <div class="bt-screen" :class="{'shown': bluetooth.BTShown}"
                      @click="closeBT">
                      <div class="close" @click="closeBT">&times;</div>
                      <div class="bt-title" @click.stop>
                        <i class="fa fa-bluetooth-b"></i>
                        {{ Translation.t('userRequest.BTTitle') }}
                      </div>

                      <div class="bt-notice">{{ Translation.t('userRequest.BTNotice') }}
                        <div class="bt-status-wrapper">

                        </div>
                        <div class="bt-status">
                          {{ bluetooth.BTStatus }}
                        </div>
                      </div>
                      <div class="bt-display" @click.stop>
                      </div>
                    </div>

                    <div class="camera-screen" :class="{'shown':cameraShown}" @click="hideQr">
                      <div class="close" @click="hideQr">&times;</div>
                      <div class="camera-title" @click.stop>
                        <i class="fa fa-qrcode"></i>

                        {{ Translation.t('userRequest.QRTitle') }}
                      </div>
                      <div class="qr-code-container">
                        <div class="qr-code-wrapper">
                          <div class="camera-notice">{{ Translation.t('userRequest.QRNotice') }}</div>
                          <qr-code class="qr-display" :content="this.encodedPaymentInformation"></qr-code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilService from '@/services/UtilService';
// import HttpService from '@/services/HttpService';
import Spinner from '@/components/Spinner';
import Translation from '@/config/Translation';
import QrCode from '@/components/QrCode';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
      cameraShown: false,
      isMobileDevice: false,
      isAndroidDevice: false,
      nfc: {
        NFCStatus: Translation.t('userRequest.nfcstatusinitial'),
        NFCSending: false,
        NFCSuccess: false,
        NFCShown: false,
        NFCSupported: false
      },
      bluetooth: {
        BTStatus: 'not watching..',
        BTSupported: false,
        BTShown: false,
        BTSuccess: false
      },
      paymentInfo: {
        selectedAccount: '',
        amount: 0,
        posid: ''
      },
			formIsTouched: false,
			successfulTransaction: false,
      Translation: Translation
		}
	},
	components: {
		Spinner,
    QrCode
	},
	computed: {
    bazoAccounts: function () {
      return this.$store.getters.bazoAccounts;
    },
    defaultBazoAccount: function () {
      return this.bazoAccounts.find(function (bazoAccount) {
        return bazoAccount.isPrime;
      });
    },
    multipleAccountsConfigured: function () {
      return this.bazoAccounts.length > 1;
    },
    advancedOptionsShown: function () {
      return this.$store.getters.showAdvancedOptions === 'shown'
    },
    validPOSId: function () {
      if (this.paymentInfo.posid !== '-' && this.paymentInfo.posid) {
        return true;
      } return false;
    },
    encodedPaymentInformation: function () {
      let target = this.paymentInfo.selectedAccount || this.defaultBazoAccount;
      let posid = this.validPOSId ? this.paymentInfo.posid : '';
      return UtilService.encodeAsCompleteURI(target.bazoaddress, {
        amount: this.paymentInfo.amount
      }, posid)
    },
    whatsappLink: function () {
      return 'https://api.whatsapp.com/send?text=' + encodeURI(this.encodedPaymentInformation);
    },
    nfcbridgeLink: function () {
      let target = this.paymentInfo.selectedAccount || this.defaultBazoAccount;
      let posid = this.validPOSId ? this.paymentInfo.posid : '';
      return `nfcbridge.peerpush://paymentInfo/${target.bazoaddress}/${this.paymentInfo.amount}/${posid}`;
    },
    validAmount: function () {
      if (this.paymentInfo.amount > 0) {
        return true;
      }
      return false;
    }
	},
	methods: {
		loadInitialData: function () {
      this.isLoading = false
		},
    checkPlatform: function () {
      this.isMobileDevice = (this.onIOS() || this.onAndroid());
      this.isAndroidDevice = this.onAndroid();
    },
    onIOS: function () {
      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];
      if (navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop()) {
            return true;
          }
        }
      }
      return false;
    },
    onAndroid: function () {
      return /(android)/i.test(navigator.userAgent);
    },
    checkBTSupport: function () {
      if ('bluetooth' in navigator) {
        this.bluetooth.BTSupported = true;
        // TODO check if bluetooth can actually be adressed
        this.bluetooth.BTSupported = false;
      } else {
        this.bluetooth.BTSupported = false;
      }
    },
    openBT: function () {
      if (this.bluetooth.BTSupported) {
        this.bluetooth.BTShown = true;
        this.startWatchingBT();
      } else {
        this.bluetooth.BTShown = false;
        this.$toasted.global.warn(Translation.t('userRequest.BTNotSupported'));
      }
    },
    closeBT: function () {
      this.bluetooth.BTShown = false;
    },
    startWatchingBT: function () {

    },
    checkNFCSupport: function () {
      if ('nfc' in navigator) {
        this.nfc.NFCSupported = true;
      } else {
        this.nfc.NFCSupported = false;
      }
    },
    openNFC: function () {
      if (this.nfc.NFCSupported) {
        this.nfc.NFCShown = true;
        this.sendPaymentInfoNFC();
      } else {
        this.nfc.NFCShown = false;
        this.$toasted.global.warn(Translation.t('userRequest.NFCNotSupported'));
      }
    },
    closeNFC: function () {
      this.nfc.NFCShown = false;
      this.nfc.NFCSuccess = false;
      this.nfc.NFCSending = false;
      try {
        navigator.nfc.cancelWatch();
      } catch (e) {
        console.log(e);
      }
    },
    sendPaymentInfoNFC: function () {
      if (this.nfc.NFCSupported) {
        this.nfc.NFCSending = true;
        this.nfc.NFCStatus = Translation.t('userRequest.NFCSending');
        navigator.nfc.push({
          records: [
            {
              recordType: 'url',
              data: this.encodedPaymentInformation
            }
          ]
        }).then(() => {
          this.nfc.NFCSending = false;
          this.nfc.NFCStatus = Translation.t('userRequest.NFCSendSuccess');
          this.nfc.NFCSuccess = true;
          let that = this;
          setTimeout(() => {
            that.closeNFC()
          }, 3000)
        }).catch((error) => {
          this.nfc.NFCSending = false;
          this.nfc.NFCSuccess = false;
          if (error.code === 9) {
            this.nfc.NFCSupported = false;
            this.nfc.NFCStatus = Translation.t('userRequest.NFCNotSupported')
            let that = this;
            setTimeout(() => {
              that.closeNFC()
            }, 3000)
          } else if (error.code === 19) {
            this.nfc.NFCStatus = Translation.t('userRequest.NFCSendAborted')
            let that = this;
            setTimeout(() => {
              that.sendPaymentInfoNFC()
            }, 2000)
          } else if (error.code === 20) {
            // Handle error when a previous operation was canceled, but the device is still sending.
            this.nfc.NFCSending = true;
            this.nfc.NFCStatus = Translation.t('userRequest.NFCSending')
          } else {
            this.nfc.NFCStatus = Translation.t('userRequest.NFCSendError') + error.toString() + error.code;
          }
        })
      }
    },
		showQR: function () {
      this.cameraShown = true;
		},
		hideQr: function () {
			this.cameraShown = false;
		},
    formatBazoAccount: function (account) {
      if (account) {
        return `${account.bazoname} (${account.bazoaddress.slice(0, 10)}..)`
      }
      return false;
    }
  },
  watch: {
    paymentInfo: {
      handler () {
        this.formIsTouched = true;
      },
      deep: true
    }
  },
	mounted: function () {
    window.debug = this;
		this.isLoading = true;
		this.loadInitialData();
    this.checkNFCSupport();
    this.checkBTSupport();
    this.checkPlatform();
	}
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.user-send {
	.user-send-content {
		min-height: 300px;
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
	.fa.fa-info-circle {
		cursor: help;
	}
  // .payment-variant-btn {
  //   width: calc(100% / 3 - 3px);
  // }
  .transfer-link{
    color: $green-color;
  }
	.popover-element {
		display: inline-block;
		vertical-align: middle;
		margin-left: 5px;
		.fa-info-circle {
			color: #999;
		}
	}
	.camera, .nfc, .bt {
		font-size: 16px;
		position: absolute;
		right: 0;
		z-index: 99;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
		padding: 7px 6px;
	}
  .nfc {
    right: 50px;
  }
  .bt {
    right: 30px;
  }
  .nfc-status-wrapper {
    text-align: center;
    svg {
      fill: #FAA916;
      margin: 20px;
      height: 100px;
    }
    .nfc-watch-active {
      animation: roll 3s infinite forwards;
      transform: rotate(30deg);
    }
    .nfc-watch-success {
      fill: green;
    }
  }
  .unsupported{
    opacity: 0.3;
    cursor: not-allowed;
  }
	.camera-screen, .nfc-screen, .bt-screen {
		position: fixed;
    display: table;
		padding: 20px;
		background: rgba(0,0,0,0.9);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999999;
		opacity: 0;
		visibility: hidden;
		transition: 0.25s ease all;
		&.shown {
			opacity: 1;
			visibility: visible;
		}

		.bt-notice {
			display: block;
			position: absolute;
			top: 30%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70vmin;
			max-height: calc(100vh - 40px);
			overflow: hidden;
		}
    .camera-notice, .nfc-notice, .bt-notice, .nfc-status {
      color: white;
      font-size: 18px;
      font-weight: 300;
      text-align: center;
    }
		.camera-title, .nfc-title, .bt-title {
			position: absolute;
			bottom: 40px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 30px;
			color: white;
			font-weight: 300;
			text-shadow: 1px 1px 6px rgba(0,0,0,0.8);
			text-align: center;
			width: 90vw;
			z-index: 9999998;
		}
		.close {
			color: rgba(255, 255, 255, 0.91);
			font-size: 70px;
			z-index: 9999999;
			position: absolute;
			font-weight: 400;
			top: 10px;
			right: 15px;
			text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.63);
			opacity: 1;
		}

		.nfc-display-wrapper, .bt-display{
      display: table-cell;
      vertical-align: middle;
		}
    .qr-code-wrapper {
      padding: 5px;
      div{
        margin: 5px 0 5px 0;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .qr-code-container {
      display: table-cell;
      vertical-align: middle;
    }


	}
	.form-control.mono {
		font-size: 15px;
	}
	.form-group {
		margin-bottom: 10px;
	}
	.address-input,
	.posid-input {
		position: relative;
		z-index: 1;
	}
	.address-input {
		padding-right: 70px;
	}
	.description-forex-rate {
		margin-top: 6px;
		margin-left: 5px;
		padding-left: 10px;
		border-left: 2px solid #888;
		font-size: 14px;
		padding-bottom: 3px;
		padding-top: 3px;
		font-style: italic;
	}
	.description-fees {
		font-size: 90%;
	}
	.fees-included {
		text-align: center;
		width: 100%;

		label {
			display: inline-block;
		}
	}
	/deep/ {
		.dropdown-item {
			cursor: pointer;

			.currency + .fa-check {
				font-size: 60%;
				display: inline-block;
				vertical-align: middle;
				margin-left: 5px;
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
@media (max-width: $breakpoint-hide-header) {
  .user-send .camera-screen .camera-title {
    font-size: 24px;
  }
}
@keyframes roll {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
