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
	}

};

export default Crypto;
