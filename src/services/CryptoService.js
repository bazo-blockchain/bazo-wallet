import sjcl from 'sjcl';
import Bitcoin from 'coinblesk-frontend-bitcoinjs';
import properties from '@/properties';

const Crypto = {

	encrypt: function (password, message) {
		// encrypts the message with the password (AES-256)
		// the output is then converted to Base64
		return window.btoa(sjcl.encrypt(password, message));
	},

	decrypt: function (password, encryptedMessage) {
		// parses the Base64 input message and then
		// encrypts this message with the password (AES-256)
		// @throws DOMException (Base64)
		// @throws corrupt error (from decryption, probably wrong password)
		return sjcl.decrypt(password, window.atob(encryptedMessage));
	},

	createKey: function () {
		const newECKey = Bitcoin.ECPair.makeRandom({
			network: properties.BITCOIN_NETWORK
		});
		return {
			eckey: newECKey,
			privateKey: newECKey.toWIF(),
			publicKey: newECKey.getPublicKeyBuffer().toString('hex')
		};
	},

	signDTO: function (privateKeyWif, dto) {
		const sha256 = Bitcoin.crypto.sha256;
		const base64String = window.btoa(JSON.stringify(dto));
		const ecKey = Bitcoin.ECPair.fromWIF(privateKeyWif, properties.BITCOIN_NETWORK);
		const signature = ecKey.sign(sha256(base64String));
		return {
			payload: base64String,
			signature: {
				sigR: signature.r.toString(),
				sigS: signature.s.toString()
			}
		};
	},

	passwordStrength: function (password) {
		return {
			okay: {
				letters: /[A-Z]/.test(password) || /[a-z]/.test(password),
				numbers: true,
				special: true,
				size: password.length >= 16
			},
			good: {
				letters: /[A-Z]/.test(password) && /[a-z]/.test(password),
				numbers: /\d/.test(password),
				special: /[^0-9a-zA-Z]/.test(password),
				size: password.length >= 20
			}
		};
	},

	convertPrivateKeyWifToPublicKeyHex: function (privateKeyWif) {
		return Bitcoin.ECPair.fromWIF(privateKeyWif, properties.BITCOIN_NETWORK).getPublicKeyBuffer().toString('hex');
	}

};

export default Crypto;
