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
            <div class="main-title display-7">{{ this.$t('settings.title') }}</div>
            <hr>
            <div class="col-md-12">
              <b-form-checkbox
              v-model="showAdvancedOptions"
              value="shown"
              unchecked-value="hidden">
              {{ this.$t('settings.advancedoptionsLabel') }}
            </b-form-checkbox>
          </div>
          <div class="col-md-12">
            {{ this.$t('settings.advancedoptionsDescription') }}
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
      showAdvancedOptions: 'hidden'
    }
  },
  components: {
    Spinner
  },
  computed: {
    configured: function () {
      return this.$store.getters.accountConfigured;
    }
    // showAdvancedOptions: function () {
    //   return this.$store.getters.showAdvancedOptions;
    // }
  },
  methods: {
    loadData: function () {
      this.isLoading = true;
      this.showAdvancedOptions = this.$store.getters.showAdvancedOptions;

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
        "advancedoptionsDescription": "When activating this option, advanced features will be displayed, such as having the possibility to include the ID of a Point-of-Sale System. This ID is used to retrieve payment information from a service."
      }
    },
    "de": {
      "settings": {
        "title": "Einstellungen",
        "advancedoptionsLabel": "Erweiterte Optionen anzeigen.",
        "advancedoptionsDescription": "Wenn Sie diese Option aktivieren werden Ihnen zusätzliche Funktionen angezeigt, wie die Möglichkeit eine ID, die ein POS System kennzeichnet in die Zahlungsinformationen zu integrieren. Diese ID kann genutzt werden um Zahlungsinformationen von einem Service abzurufen."
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

  .popover-element {
    color: #999;
    display: inline-block;
    vertical-align: middle;
    margin-left: 3px;
    cursor: help;
  }
}

</style>
