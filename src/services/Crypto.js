import sjcl from 'sjcl';

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
		const newECKey = window.bitcoin.ECPair.makeRandom();
		return {
			eckey: newECKey,
			privateKey: newECKey.toWIF(),
			publicKey: newECKey.getPublicKeyBuffer().toString('hex')
		};
	},

	signDTO: function (privateKeyWif, dto) {
		const sha256 = window.bitcoin.crypto.sha256;
		const base64String = window.btoa(JSON.stringify(dto));
		const ecKey = window.bitcoin.ECPair.fromWIF(privateKeyWif);
		const signature = ecKey.sign(sha256(base64String));
		return {
			payload: base64String,
			signature: {
				sigR: signature.r.toString(),
				sigS: signature.s.toString()
			}
		};
	}

};

export default Crypto;
