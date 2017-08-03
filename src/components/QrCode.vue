<template>
<div class="qr-code-wrapper">
	<div class="qr-fade-out" @click.prevent="shown = false" :class="{ 'shown': shown }"></div>
	<i class="fa fa-qrcode increase-focus" @click.prevent="shown = !shown"></i>
	<div class="qr-image" :class="{ 'shown': shown }">
		<a class="close increase-focus" @click.prevent="shown = false">
			<i class="fa fa-times"></i>
		</a>
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
			// size is depending on the input length
			// an exception is thrown, if the size is not large enough
			try {
				qr = makeQR(1);
			} catch (e) {
				try {
					qr = makeQR(2);
				} catch (e) {
					try {
						qr = makeQR(3);
					} catch (e) {
						try {
							qr = makeQR(4);
						} catch (e) {
							qr = makeQR(5);
						}
					}
				}
			}
			this.$el.querySelector('.qr-image div').innerHTML = qr.createImgTag(5, 0);
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
	position: absolute;
	bottom: 2.3em;
	left: 50%;
	transform: translateX(-50%);
	background: white;
	box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
	border-radius: 5px;
	padding: 12px;
	z-index: 101;
	opacity: 0;
	visibility: hidden;
	transition: 0.2s ease all;
	z-index: 103;
	
	&.shown {
		opacity: 1;
		visibility: visible;
	}
	
	&:after {
		content: "";
		display: block;
		transform: translateX(-50%) rotate(45deg);
		width: 1em;
		height: 1em;
		position: absolute;
		bottom: -0.5em;
		background: white;
		left: 50%;
	}
	
	/deep/ svg {
		width: 164px;
		height: 164px;
		path {
			transform: scale(2);
		}
	}
	
	.close {
		display: block;
		position: absolute;
		right: -1.1em;
		top: 0.1em;
		font-size: 24px;
		color: black;
	}
}
</style>
