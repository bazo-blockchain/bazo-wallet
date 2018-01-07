<template>
  <div class="user-send">
    <div class="compact">
      <h1 class="display-4">{{ Translation.t('userSend.title') }}</h1>
      <hr>
      <div class="pos-rel user-send-content">
        <spinner :is-loading="isLoading"></spinner>
        <div v-if="successfulTransaction">
          <div class="alert alert-success">{{ Translation.t('userSend.transactionSuccessful') }}</div>
        </div>
        <div v-else>
          <div class="box-wrapper" v-if="!isLoading && !loadingError">
            <div class="box">
              <div class="main-title display-7">{{ Translation.t('userSend.boxTitle') }}</div>
              <hr>
              <form>
                <b-form-fieldset>
                  <label class="col-form-label" for="send-receiver">
                    {{ Translation.t('userSend.receiver') }}
                    <b-popover :triggers="['hover']" :content="Translation.t('userSend.receiverDescription')" class="popover-element">
                      <i class="fa fa-info-circle increase-focus"></i>
                    </b-popover>
                  </label>
                  <div class="pos-rel">
                    <b-form-input id="send-receiver" v-model="address" type="text" class="address-input" :placeholder="Translation.t('userSend.receiverPlaceholder')" :class="{ 'form-error': formIsTouched && !validAddress }"></b-form-input>
                    <span
                    class="nfc "
                    :class="{ unsupported: !nfc.NFCSupported  }"
                    @click="openNFC"
                    :title="Translation.t('userSend.openNFCTitle')">
                    <i class="fa fa-rss"></i>
                  </span>
                  <span
                  class="bt"
                  :class="{ unsupported: !bluetooth.BTSupported}"
                  @click="openBT"
                  :title="Translation.t('userSend.openBTTitle')">
                  <i class="fa fa-bluetooth-b"></i>
                </span>
                <span class="camera" @click="openCamera" :title="Translation.t('userSend.openCameraTitle')">
                  <i class="fa fa-camera"></i>
                </span>

                <div class="nfc-screen" :class="{'shown': nfc.NFCShown}" @click="closeNFC">
                  <div class="close" @click="closeNFC">&times;</div>
                  <div class="nfc-title" @click.stop>
                    <i class="fa fa-rss"></i>
                    {{ Translation.t('userSend.NFCTitle') }}
                  </div>

                  <div class="nfc-notice">{{ Translation.t('userSend.NFCNotice') }}
                    <div class="nfc-status-wrapper">
                      <svg :class="{'nfc-watch-active': nfc.NFCWatching, 'nfc-watch-success': nfc.NFCSuccess}" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"/></svg>

                    </div>
                    <div class="nfc-status">
                      {{ nfc.NFCStatus }}
                    </div>
                  </div>
                  <div class="video-wrapper" @click.stop>
                    <video></video>
                  </div>
                </div>

                <div class="bt-screen" :class="{'shown': bluetooth.BTShown}"
                @click="closeBT">
                <div class="close" @click="closeBT">&times;</div>
                <div class="bt-title" @click.stop>
                  <i class="fa fa-bluetooth-b"></i>
                  {{ Translation.t('userSend.BTTitle') }}
                </div>

                <div class="bt-notice">{{ Translation.t('userSend.BTNotice') }}
                  <div class="bt-status-wrapper">

                  </div>
                  <div class="bt-status">
                    {{ bluetooth.BTStatus }}
                  </div>
                </div>
                <div class="video-wrapper" @click.stop>
                  <video></video>
                </div>
              </div>

              <div class="camera-screen" :class="{'shown':cameraShown}" @click="closeCamera">
                <div class="close" @click="closeCamera">&times;</div>
                <div class="camera-title" @click.stop>
                  <i class="fa fa-qrcode"></i>
                  {{ Translation.t('userSend.cameraTitle') }}
                </div>
                <div class="camera-notice">{{ Translation.t('userSend.cameraNotice') }}</div>
                <div class="video-wrapper" @click.stop>
                  <video></video>
                </div>
              </div>
            </div>
          </b-form-fieldset>

          <div class="row">
            <div class="col-md-8">
              <b-form-fieldset :label="Translation.t('userSend.amount')">
                <b-input-group>
                  <b-form-input v-model="amount" class="mono amount-input" type="number" min="0" :class="{ 'form-error': formIsTouched && !validAmount }"></b-form-input>
                  <!-- <b-input-group-button slot="right">
                    <b-dropdown :text="selectedCurrency" variant="default" right>
                      <b-dropdown-item v-for="currency in allowedCurrencies" @click="selectedCurrency = currency" :key="currency">
                        <span class="currency">{{ currency }}</span>
                        <i class="fa fa-check" v-if="currency === selectedCurrency"></i>
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-input-group-button> -->
                </b-input-group>
              </b-form-fieldset>
            </div>
            <div class="col-md-4">
              <b-form-fieldset>
                <label class="col-form-label">{{ Translation.t('userSend.maxAmount') }}
                  <b-popover :triggers="['hover']" :content="(addressIsBitcoin || addressIsEmail) ? Translation.t('userSend.maxAmountDescription') : '<b>'+Translation.t('userSend.maxAmountDescriptionIntro')+'</b><hr>' + Translation.t('userSend.maxAmountDescription')" class="popover-element">
                    <i class="fa fa-info-circle increase-focus"></i>
                  </b-popover>
                </label>
                <div class="form-control disabled mono" :class="{ 'form-error': formIsTouched && maximumAmountExceeded }">
                  <span v-if="accountsConfigured">
                    {{ maximumAmount }} Bazo
                  </span>
                  <span v-else>
                    <i class="fa fa-minus"></i>
                  </span>
                </div>
              </b-form-fieldset>
            </div>
            <div class="col-12">
              <b-form-fieldset>
                <label class="col-form-label" for="selection">{{ Translation.t('userSend.accountUsed') }}
                  <b-popover :triggers="['hover']" :content="Translation.t('userSend.accountUsedDescription')" class="popover-element">
                    <i class="fa fa-info-circle increase-focus"></i>
                  </b-popover>
                </label>
                <div class="pos-rel">
                  <b-input-group-button class="accountSelectionWrap">
                    <b-dropdown :disabled="!multipleAccountsConfigured" id="account-selection" :text="formatBazoAccount(selectedAccount) || formatBazoAccount(defaultBazoAccount) " variant="default">
                      <b-dropdown-item v-for="bazoAccount in bazoAccounts" @click="selectedAccount = bazoAccount" :key="bazoAccount">
                        <span class="currency">{{ formatBazoAccount(bazoAccount) }}</span>
                        <i class="fa fa-check" v-if="bazoAccount === selectedAccount || (selectedAccount === '' && bazoAccount === defaultBazoAccount )"></i>
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-input-group-button slot="right">
                </div>

              </b-form-fieldset>
            </div>
            <div class="col-12">
              <div class="description-forex-rate" v-html="Translation.t('userSend.descriptionForexRate', { forex: forexRates[selectedCurrency].rate, currency: selectedCurrency })" v-if="selectedCurrency !== 'Bazo'"></div>
              <hr>
            </div>
            <div class="fees-included">
              <label>
                <b-form-checkbox v-model="feesIncluded">{{ Translation.t('userSend.feesIncluded') }}
                  <b-popover :triggers="['hover']" :content="Translation.t('userSend.feesIncludedDescription')" class="popover-element">
                    <i class="fa fa-info-circle increase-focus"></i>
                  </b-popover>
                </b-form-checkbox>
              </label>
            </div>
            <div class="col-12">
              <!-- warning threshold is 0.01 BTC fees per transaction, if above: crazy world -->
              <div class="description-fees alert alert-info" v-if="feesIncluded && btcAmount != 0 && btcAmount < 0.01">{{ Translation.t('userSend.lowAmountFeeDescription') }}</div>
              <div class="description-fees alert alert-info" v-if="!feesIncluded && btcAmount != 0 && btcMaximumAmount - btcAmount - 0.01 < 0">{{ Translation.t('userSend.descriptionFees') }}</div>
              <b-button class="submit-button" :block="true" variant="primary" @click.prevent="submitPreparation" :disabled="formIsTouched && !validForm || false">{{ Translation.t('userSend.button', { amount: btcAmount }) }}</b-button>
            </div>
          </div>
        </form>
      </div>

      <user-transfer @remove-transaction-data="resetAllTransactionData"  :transactionHash="this.transaction.hash" :amount="Number(this.amount)"></user-transfer>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script>
import UtilService from '@/services/UtilService';
import HttpService from '@/services/HttpService';
import UserTransfer from '@/components/auth/user/UserTransfer';
import Spinner from '@/components/Spinner';
import URIScheme from '@/services/URIScheme'
import Translation from '@/config/Translation';

export default {
	name: 'user-send',
	data: function () {
		return {
			isLoading: true,
			loadingError: false,
			qrScanner: null,
			cameraShown: false,
      nfc: {
        NFCStatus: 'not watching..',
        NFCWatching: false,
        NFCSuccess: false,
        NFCShown: false,
        // TODO: detect NFC browser support and set this programmatically
        NFCSupported: true
      },
      bluetooth: {
        BTStatus: 'not watching..',
        BTSupported: false,
        BTShown: false,
        BTSuccess: false
      },
      transaction: {
        hash: null
      },
			selectedCurrency: 'Bazo',
			allowedCurrencies: ['Bazo', 'USD', 'EUR', 'CHF'],
      selectedAccount: '',
			amount: 0,
      posid: '',
			feesIncluded: true,
      currentFee: 1,
			address: '',
			forexRates: {
				USD: {},
				EUR: {},
				CHF: {}
			},
			formIsTouched: false,
			successfulTransaction: false,
			lockedAddress: {},
			currentTransaction: {},
      Translation: Translation
		}
	},
	components: {
		Spinner,
		UserTransfer
	},
	computed: {
    bazoAccounts: function () {
      return this.$store.getters.bazoAccounts;
    },
    defaultBazoAccount: function () {
      return this.bazoAccounts.find(function (bazoaccount) {
        return bazoaccount.isPrime;
      })
    },
    accountsConfigured: function () {
      return this.bazoAccounts.length > 0;
    },
    multipleAccountsConfigured: function () {
      return this.bazoAccounts.length > 1;
    },
    usingCustomHost: function () {
      return this.$store.getters.useCustomHost === 'true';
    },
    customURLUsed: function () {
      if (this.usingCustomHost) {
        return this.$store.getters.customURL;
      } return null;
    },
		btcAmount: function () {
			if (!this.amount) {
				return 0;
			}
			let value = 0;
			if (this.selectedCurrency !== 'Bazo') {
				value = (this.amount / this.forexRates[this.selectedCurrency].rate);
			} else {
				value = this.amount;
			}
			return Math.round(value * UtilService.SATOSHI_PER_BITCOIN) / UtilService.SATOSHI_PER_BITCOIN;
		},
		validAmount: function () {
			if (this.amount <= 0) {
				return false;
			}
			if (this.maximumAmountExceeded) {
				return false;
			}
			return true;
		},
		maximumAmount: function () {
      let account = this.selectedAccount ? this.selectedAccount : this.defaultBazoAccount;

			if (!this.accountsConfigured) {
				return 0;
			}
      return account.balance;
		},
    maximumAmountExceeded: function () {
      return this.amount > this.maximumAmount;
    },
    addressIsEmail: function () {
      if (this.address === '') {
        return false;
      }
      return UtilService.EMAIL_REGEX.test(this.address);
    },
    addressIsBitcoin: function () {
      if (this.address === '') {
        return false;
      }
      let result = false;
      try {
        result = true;
      } catch (e) {
        result = false;
      }
      return result;
    },
    validAddress: function () {
      const isHex = (hexString) => {
        let pattern = /^[a-fA-F0-9]+$/
        return pattern.test(hexString)
      }

      return isHex(this.address) && (this.address.length >= 127)
    },
    validForm: function () {
      return this.validAmount && this.validAddress;
		}
	},
	methods: {
		loadInitialData: function () {
			return Promise.all([
				HttpService.queryTransactionAmount()
			]).then(responses => {
        try {
          const ipNumbers = responses[0].body.origin.split('.').join('')
          const randIndex = Math.floor(Math.random() * ipNumbers.length) + 1
          this.amount = ipNumbers[randIndex];
        } catch (e) {
          this.amount = 0
        }
				this.loadingError = false;
				this.isLoading = false;
			}, () => {
				this.loadingError = true;
				this.isLoading = false;
			});
		},
    parseProps: function () {
      const paymentinfo = this.$route.query.paymentinfo;
      if (paymentinfo) {
        try {
          const decodedContent = URIScheme.decode(paymentinfo);
          this.address = decodedContent.address;
          if (decodedContent.options.amount) {
            this.amount = decodedContent.options.amount;
          }
        } catch (e) {
          this.address = paymentinfo;
        }
      }
      const posid = this.$route.query.posid;
      if (posid) {
        this.posid = posid;
        HttpService.queryTransactionAmount().then((response) => {
          // TODO implement actual querying of transaction amount.
          try {
            const ipNumbers = response.body.origin.split('.').join('')
            const randIndex = Math.floor(Math.random() * ipNumbers.length) + 1
            const res = ipNumbers[randIndex].toString() + this.posid;
            if (res && Number(res)) {
              this.amount = res;
            } else {
              this.amount = 0;
              this.$toasted.global.warn(Translation.t('userSend.amountQueryError'));
            }
            this.isLoading = false;
            this.loadingError = false;
          } catch (e) {
            this.isLoading = false;
            this.loadingError = false;
            this.amount = 0
            this.$toasted.global.warn(Translation.t('userSend.amountQueryError'));
          }
        }).catch(() => {
          this.isLoading = false
          this.loadingError = true
        })
      } else {
        this.posid = '';
        this.isLoading = false;
        this.loadingError = false;
      }
    },
    parseDecodedUrlPayment: function (decodedPaymentInfo) {
      this.address = decodedPaymentInfo.bazoaddress;
      this.amount = decodedPaymentInfo.amount;
      if (decodedPaymentInfo.posid) {
        HttpService.queryTransactionAmount().then((response) => {
          try {
            const ipNumbers = response.body.origin.split('.').join('')
            const randIndex = Math.floor(Math.random() * ipNumbers.length) + 1
            const res = ipNumbers[randIndex].toString() + decodedPaymentInfo.posid;
            this.amount = res;
          } catch (e) {
            this.amount = 0
          }
        })
      }
    },
    resetTransactionData: function () {
      this.transaction.hash = null;
      this.amount = 0;
      this.posid = '';
      this.address = '';
    },
    resetAllTransactionData: function () {
      this.amount = 0;
      this.posid = '';
      this.address = '';
      this.formIsTouched = false;
      this.resetTransactionData();
    },
    checkBTSupport: function () {
      if ('bluetooth' in navigator) {
        this.bluetooth.BTSupported = true;
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
        this.$toasted.global.warn(Translation.t('userSend.BTNotSupported'));
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
        this.startWatchingNFC();
      } else {
        this.nfc.NFCShown = false;
        this.$toasted.global.warn(Translation.t('userSend.NFCNotSupported'));
      }
    },
    closeNFC: function () {
      this.nfc.NFCShown = false;
      this.nfc.NFCWatching = false;
      this.nfc.NFCSuccess = false;
      try {
        navigator.nfc.cancelWatch();
      } catch (e) {
        console.log(e);
      }
    },
    startWatchingNFC: function () {
      if (this.nfc.NFCSupported) {
        navigator.nfc.watch((message) => {
          this.nfc.NFCWatching = false;
          this.nfc.NFCSuccess = true;

          var paymentinfo = '';
          paymentinfo = message.records[0].data;

          if (paymentinfo.length > 0) {
            try {
              let result = UtilService.decodeFromCompleteURI(paymentinfo);
              if (result) {
                this.parseDecodedUrlPayment(result);
              } else {
                console.log('Unable to decode from complete URI.');
                this.address = paymentinfo;
              }
            } catch (e) {
              this.address = paymentinfo;
            }
          } else {
            this.address = paymentinfo;
          }
          setTimeout(() => {
            this.closeNFC();
          }, 500);
        }).then(() => {
          this.nfc.NFCWatching = true;
          this.nfc.NFCStatus = 'Started watching NFC tags..'
        }).catch((error) => {
          this.nfc.NFCWatching = false;
          this.nfc.NFCSuccess = false;
          if (error.code === 9) {
            this.nfc.NFCStatus = 'Your device or browser does not support the operation..';
            this.nfc.NFCSupported = false;
            setTimeout(() => {
              this.closeNFC();
            }, 2000)
          } else if (error.code === 1000) {
            this.nfc.NFCStatus = 'The operation was not successfull.. Retry?'
          } else {
            this.nfc.NFCStatus = 'Error encountered: ' + error.toString() + error.code;
          }
        });
      }
    },
		openCamera: function () {
			this.qrScanner = new window.Instascan.Scanner({
				video: this.$el.querySelector('.camera-screen video')
			});
			this.qrScanner.addListener('scan', (content) => {
				if (content.length > 0) {
					try {
            let result = UtilService.decodeFromCompleteURI(content);
            if (result) {
              this.parseDecodedUrlPayment(result);
            } else {
              console.log('Unable to decode from complete URI.');
              this.address = content;
            }
					} catch (e) {
						this.address = content;
					}
				} else {
					this.address = content;
				}
				this.closeCamera();
			});
			window.Instascan.Camera.getCameras().then((cameras) => {
				if (cameras.length > 0) {
          let cameraUsed = cameras.length === 2 ? cameras[1] : cameras[0];
					this.qrScanner.start(cameraUsed);
					this.cameraShown = true;
				} else {
					this.$toasted.global.warn(Translation.t('userSend.cameraError'));
					this.closeCamera();
					console.warn('no cameras found');
				}
			}, (error) => {
				this.$toasted.global.warn(Translation.t('userSend.cameraError'));
				this.closeCamera();
				console.warn('error occurred:', error);
			});
		},
		closeCamera: function () {
			if (this.qrScanner !== null) {
				this.qrScanner.stop();
				this.qrScanner = null;
			}
			this.cameraShown = false;
		},
    formatBazoAccount: function (account) {
      if (account) {
        return `${account.bazoname} (${account.bazoaddress.slice(0, 5)}..${account.bazoaddress.slice(-5)})`
      }
      return false;
    },
    triggerBalanceUpdate () {
      this.$store.dispatch('updateUserBalance', this.customURLUsed);
    },
		submitPreparation: function () {
			this.formIsTouched = true;
      let that = this;

			if (this.validForm) {
				this.isLoading = true;

				HttpService.queryTxInfo(
          this.selectedAccount.bazoaddress || this.defaultBazoAccount.bazoaddress,
          this.customURLUsed
        )
        .then((response) => {
					this.currentTransaction = {
						txCnt: response.body.txCnt,
            amount: this.amount,
            recipient: this.address,
            sender: this.selectedAccount.bazoaddress || this.defaultBazoAccount.bazoaddress
					};
          let fee, amount;
          if (this.feesIncluded) {
            amount = Number(this.currentTransaction.amount) - this.currentFee;
            fee = this.currentFee;
          } else {
            amount = this.currentTransaction.amount;
            fee = this.currentFee;
          }

          HttpService.createFundsTx(
            this.currentTransaction.recipient,
            this.currentTransaction.sender,
            amount,
            this.currentTransaction.txCnt,
            fee,
            this.customURLUsed
          ).then((res) => {
            that.transaction.hash = res.content[0].detail
            this.$nextTick(() => {
              this.$root.$emit('show::modal', 'user-transfer');
            });
          }).catch(() => {
            // this.$toasted.global.warn(Translation.t('userSend.preparationError'));
            this.resetTransactionData();
          })
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
          this.resetTransactionData();
          this.$toasted.global.warn(Translation.t('userSend.preparationError'));
				});
			}
		}
	},
	mounted: function () {
		this.isLoading = true;
    this.parseProps();
    this.triggerBalanceUpdate();
    this.checkNFCSupport();
    this.checkBTSupport();
  }
};
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

		.camera-notice, .nfc-notice, .bt-notice {
			color: white;
			font-size: 18px;
			font-weight: 300;
			text-align: center;
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70vmin;
			max-height: calc(100vh - 40px);
			overflow: hidden;
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

		.video-wrapper {
			transform: translate(-50%, -50%);
			position: absolute;
			top: 50%;
			left: 50%;
			padding: 25px;
			video {
				width: calc(100vw - 50px);
				height: calc(100vh - 50px);
			}
		}
	}
	.form-control.mono {
		font-size: 15px;
	}
	.form-group {
		margin-bottom: 10px;
	}
	.address-input,
	.amount-input {
		position: relative;
		z-index: 10;
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
