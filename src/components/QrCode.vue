<template>
<div class="qr-code-wrapper">
	<div class="qr-image" :class="{ 'shown': shown }">
		<div></div>
	</div>
</div>
</template>

<script>
import QrCodeGenerator from 'qrcode-generator';

export default {
	name: 'qr-code',
	data: function () {
		return {
			shown: false
		}
	},
	props: {
		content: String
	},
	mounted: function () {
		this.createQrImage();
	},
	methods: {
		createQrImage: function () {
			const errorCorrection = 'L';
			const makeQR = (size) => {
				qr = QrCodeGenerator(size, errorCorrection);
				qr.addData(this.content);
				qr.make();
				return qr;
			}

			let qr = null;
      try {
        qr = makeQR(5)
      } catch (e) {
        try {
          qr = makeQR(6)
        } catch (e) {
          try {
            qr = makeQR(10)
          } catch (e) {
            qr = makeQR(15)
          }
        }
      }
			this.$el.querySelector('.qr-image div').innerHTML = qr.createImgTag(5, 0);
		}
	},
  watch: {
    content: function (newVal) {
      this.createQrImage();
    }
  }
};
</script>

<style lang="scss" scoped>
.fa-qrcode {
	cursor: pointer;
}
.qr-code-wrapper {
	position: relative;
	display: inline-block;
}
.qr-fade-out {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 102;
	background: rgba(0,0,0,0.2);
	transition: 0.2s ease all;
	opacity: 0;
	visibility: hidden;

	&.shown {
		opacity: 1;
		visibility: visible;
	}
}
.qr-image {
	background: white;
	box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
	border-radius: 5px;
	padding: 12px;
	z-index: 101;
	transition: 0.2s ease all;
	z-index: 103;


	// /deep/ svg {
	// 	width: 500px;
	// 	height: 500px;
	// 	path {
	// 		transform: scale(2);
	// 	}
	// }

}
</style>
