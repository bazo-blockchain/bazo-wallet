const TransactionService = {
	buildTransaction: function (privateKeyWif, inputs, output, amountSatoshi, feePerByte) {
		const Bitcoin = window.bitcoin;
		const ECKey = Bitcoin.ECPair.fromWIF(privateKeyWif);
		const tx = new Bitcoin.TransactionBuilder();

		for (let i = 0; i < inputs.length; i++) {
			tx.addInput(inputs[i], i);
		}
		tx.addOutput(output, amountSatoshi);

		for (let i = 0; i < inputs.length; i++) {
			tx.sign(i, ECKey);
		}
		return tx.build().toHex();
	}
};

export default TransactionService;
