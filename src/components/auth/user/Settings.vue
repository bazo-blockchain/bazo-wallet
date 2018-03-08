<template>
  <div class="user-settings">
    <div class="compact">
      <h1 class="display-4">{{ this.$t('settings.title') }}
      </h1>
      <hr>
      <div class="pos-rel user-settings-content">
        <spinner :is-loading="isLoading"></spinner>
        <div class="box-wrapper" v-if="!isLoading && !loadingError && this.configured">
          <div class="box">
            <div class="col-md-12">
              <b-form-checkbox
              v-model="showAdvancedOptions"
              value="shown"
              unchecked-value="hidden">
              {{ this.$t('settings.advancedoptionsLabel') }}
            </b-form-checkbox>
            <div >
              {{ this.$t('settings.advancedoptionsDescription') }}
            </div>
          </div>
          <div class="col-md-12" v-if="this.advancedOptionsShown">
            <b-form-checkbox
            v-model="useCustomHost"
            value=true
            unchecked-value=false>
            {{ this.$t('settings.useCustomHost') }}
          </b-form-checkbox>
          <div >
            <b-form-fieldset :disabled="!this.usingCustomHost" :label="this.$t('settings.urlDescription')">
              <b-form-input class="oysy-input" v-model="customURL" :disabled="!this.usingCustomHost" type="text"></b-form-input>
            </b-form-fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';

export default {
  name: 'user-settings',
  data: function () {
    return {
      isLoading: true,
      loadingError: false,
      showAdvancedOptions: 'hidden',
      useCustomHost: 'false',
      customURL: 'https://somehost.com:8001/'
    }
  },
  components: {
    Spinner
  },
  computed: {
    configured: function () {
      return this.$store.getters.accountConfigured;
    },
    advancedOptionsShown: function () {
      return this.$store.getters.showAdvancedOptions === 'shown';
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
    loadData: function () {
      this.isLoading = true;
      this.showAdvancedOptions = this.$store.getters.showAdvancedOptions;
      this.useCustomHost = this.$store.getters.useCustomHost;
      this.customURL = this.$store.getters.customURL;

      return Promise.all([
      ]).then(responses => {
        this.loadingError = false;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
        this.loadingError = false;
      })
    }
  },
  mounted: function () {
    this.loadData();
  },
  watch: {
    showAdvancedOptions: function (val) {
      if (val !== this.$store.getters.showAdvancedOptions && !this.isLoading) {
        this.$store.dispatch('setAdvancedOptionsShown', val);
      }
    },
    useCustomHost: function (val) {
      this.$store.dispatch('setCustomHostUsed', val);
    },
    customURL: function (url) {
      this.$store.dispatch('setCustomURL', url)
    }
  }
};
</script>

<i18n>
  {
    "en": {
      "settings": {
        "title": "Settings",
        "advancedoptionsLabel": "Show advanced options.",
        "advancedoptionsDescription": "When activating this option, advanced features will be displayed, such as having the possibility to include the ID of a Point-of-Sale System. This ID is used to retrieve payment information from a service.",
        "useCustomHost": "Use a private server.",
        "urlDescription": "Fully qualified URL of your server:"
      }
    },
    "de": {
      "settings": {
        "title": "Einstellungen",
        "advancedoptionsLabel": "Erweiterte Optionen anzeigen.",
        "advancedoptionsDescription": "Wenn Sie diese Option aktivieren werden Ihnen zusätzliche Funktionen angezeigt, wie die Möglichkeit eine ID, die ein POS System kennzeichnet in die Zahlungsinformationen zu integrieren. Diese ID kann genutzt werden um Zahlungsinformationen von einem Service abzurufen.",
        "useCustomHost": "Eigenen Server verwenden",
        "urlDescription": "Vollständige URL Ihres Bazo Servers:"
      }
    }
  }
</i18n>

<style lang="scss" scoped>
@import '../../../styles/variables';

.user-settings {
  .form-control.mono {
    font-size: 15px;
  }
  .user-settings-content {
    min-height: 300px;
  }
  .box-wrapper {
    max-width: 650px;
    padding-top: 20px;
    .box {
      width: 100%;
      background: #292b2c;
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

  .popover-element {
    color: #999;
    display: inline-block;
    vertical-align: middle;
    margin-left: 3px;
    cursor: help;
  }
}

</style>
