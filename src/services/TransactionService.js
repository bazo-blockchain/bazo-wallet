﻿const TransactionService = {
	buildTransaction: function (dto) {
		// logging
		(() => {
			const deepCopyDTO = JSON.parse(JSON.stringify(dto));
			deepCopyDTO.privateKeyWif = deepCopyDTO.privateKeyWif ? '[privatekey]' : deepCopyDTO.privateKeyWif;
			console.info('Assemble transaction with the following information', deepCopyDTO);
		})();

		// dto params
		const privateKeyWif = dto.privateKeyWif;
		const keyPair = window.bitcoin.ECPair.fromWIF(privateKeyWif);
		const inputs = dto.inputs;
		const output = dto.output;
		const changeOutput = dto.changeOutput;
		const amount = dto.amount;
		const feePerByte = dto.feePerByte;
		const feesIncluded = !!dto.feesIncluded;
		const redeemScript = redeemScript;

		// validation
		(() => {
			let invalidInputs = false;
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].value < 0 || inputs[i].index < 0 || typeof inputs[i].transactionHash === 'undefined' || inputs[i] === null) {
					invalidInputs = true;
				}
			}
			if (!privateKeyWif || !inputs || inputs.length < 1 || invalidInputs || !output || amount <= 0 || feePerByte < 0 || !!redeemScript) {
				throw new Error('Validation: Invalid parameters');
			}
		})();

		const totalInputAmount = () => {
			let sum = 0;
			for (let i = 0; i < inputs.length; i++) {
				sum += inputs[i].value;
			}
			return sum;
		};

		const calculateBytes = () => {
			const randomKey = window.bitcoin.ECPair.makeRandom();
			const tempTx = new window.bitcoin.TransactionBuilder();
			for (let i = 0; i < inputs.length; i++) {
				tempTx.addInput(inputs[i].transactionHash, inputs[i].index);
			}
			tempTx.addOutput(output, amount);
			if (changeOutput) {
				tempTx.addOutput(changeOutput, 0);
			}
			for (let i = 0; i < inputs.length; i++) {
				tempTx.sign(i, keyPair, redeemScript);
				tempTx.sign(i, randomKey, redeemScript);
			}
			return tempTx.build().byteLength();
		};

		const totalFees = calculateBytes() * feePerByte;
		const finalAmount = feesIncluded ? (amount - totalFees) : amount;
		if (finalAmount <= 0) {
			throw new Error('Invalid Amount');
		}

		const changeAmount = (() => {
			if (changeOutput) {
				return totalInputAmount - finalAmount;
			} else {
				return 0;
			}
		})();

		if (changeAmount < 0) {
			throw new Error('Not enough funds available');
		}

		const tx = new window.bitcoin.TransactionBuilder();
		for (let i = 0; i < inputs.length; i++) {
			tx.addInput(inputs[i], i);
		}
		tx.addOutput(output, finalAmount);
		if (changeOutput) {
			tx.addOutput(changeOutput, changeAmount);
		}
		for (let i = 0; i < inputs.length; i++) {
			tx.sign(i, keyPair, redeemScript);
		}

		return tx.build().toHex();
	}
};

export default TransactionService;