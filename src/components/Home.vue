<template>
  <div class="paynow">
    <div class="col-12">
      <img src="../assets/Oysy_Logo.png" alt="OySy" class="mainicon">
    </div>
    <div class="col-12">
      <div class="paynow-title">
        {{ this.Translation.t('home.title') }}
        <hr >
      </div>
      <b-button block class="paynow-btn">{{ this.Translation.t('home.paynow') }}</b-button>
    </div>
    <div class="col-12" style="margin-bottom:20px;">
      <div class="paynow-title">
        {{ this.Translation.t('home.marketplace') }}
        <hr >
      </div>
      <router-link :to="{ name: 'user-send' }">
        <b-button block class="oysy-button ">
          <i class="oysyicon">a</i>
          <span>{{ this.Translation.t('home.send') }}</span>
        </b-button>
      </router-link>

      <router-link :to="{ name: 'user-request' }">
        <b-button block class="oysy-button ">
          <i class="oysyicon">a</i>
          <span>{{ this.Translation.t('home.request') }}</span>
        </b-button>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
import Translation from '@/config/Translation';

export default {
  name: 'home',
  offline: true,
  data: function () {
    return {
      Translation: Translation
    }
  },
  components: {

  },
  computed: {

  },
  methods: {

  },
  mounted: function () {
    this.$emit('toggle-header', true);
    this.$emit('set-body-background', 'white');

    this.$emit('toggle-header-transparent', true);
    this.$emit('toggle-side-bar', true);
  },
  beforeDestroy: function () {
    this.$emit('toggle-header-transparent', false);
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.oysyicon {
  font-family: oysy;
  font-variant: normal;
  color: $purple-color;
  font-style: normal;
  font-size: 1em;
  font-weight: bold;
}
.paynow {
  position: absolute;
  height: 100%;
  background: #262626;
  width: 100%;
  overflow: scroll;
}

.mainicon {
  display: flex;
  height: 18em;
  margin: auto;
  padding: 4em;
  padding-top: 6em;
}

.paynow-btn {
  height: 4em;
  border-radius: 0px;
  font-size: 1.7em;
  background-color: $purple-color;
  border-color: $purple-color;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 30px;
}
// .link-btn{
//   border-radius: 0px;
//   border-color: #1a1a1a;
//   background-color: #1a1a1a;
//   color: white;
//   font-weight: bold;
//   font-size: 1em;
//   font-size: 1.5em;
//
//   .btn-text {
//     font-size: 1.5em;
//   }
// }

hr {
  color: black;

}
.paynow-title {
  color: #595959;
  font-weight: bold;
}

</style>
