import Bitcoin from 'coinblesk-frontend-bitcoinjs';
import properties from '@/properties';
import buffer from 'buffer';

const TransactionService = {};

TransactionService.calculateFees = function (dto) {
	validateDTO(dto);

	const keyPair = getKeyPairFromWif(dto.privateKeyWif);
	const redeemScriptObject = getRedeemScriptObject(dto.redeemScript);

	const calculatedBytes = (() => {
		const tempTx = new Bitcoin.TransactionBuilder(properties.BITCOIN_NETWORK);
		for (let i = 0; i < dto.inputs.length; i++) {
			tempTx.addInput(Bitcoin.Transaction.fromHex(dto.inputs[i].transaction), dto.inputs[i].index);
		}
		tempTx.addOutput(dto.output, dto.amount);
		if (dto.changeOutput) {
			tempTx.addOutput(dto.changeOutput, 1);
		}
		for (let i = 0; i < dto.inputs.length; i++) {
			tempTx.sign(i, keyPair, redeemScriptObject);
		}
		return tempTx.buildIncomplete().byteLength();
	})();

	const assumedBytesForSecondSignature = 75 * dto.inputs.length; // inkl. 4 bytes to spare
	const finalBytes = calculatedBytes + assumedBytesForSecondSignature;
	const totalFees = finalBytes * dto.feePerByte;

	return totalFees;
};

TransactionService.buildTransaction = function (dto) {
	validateDTO(dto);

	const keyPair = getKeyPairFromWif(dto.privateKeyWif);
	const redeemScriptObject = getRedeemScriptObject(dto.redeemScript);
	const totalFees = TransactionService.calculateFees(dto);

	const totalInputAmount = (() => {
		let sum = 0;
		for (let i = 0; i < dto.inputs.length; i++) {
			sum += dto.inputs[i].value;
		}
		return sum;
	})();

	const finalAmount = dto.feesIncluded ? (dto.amount - totalFees) : dto.amount;
	if (finalAmount <= 0) {
		throw new Error('Invalid Amount');
	}

	const changeAmount = (() => {
		if (dto.changeOutput) {
			return totalInputAmount - (dto.feesIncluded ? 0 : totalFees) - dto.amount;
		} else {
			return 0;
		}
	})();

	if (changeAmount < 0) {
		throw new Error('Not enough funds available');
	}

	const tx = new Bitcoin.TransactionBuilder(properties.BITCOIN_NETWORK);
	for (let i = 0; i < dto.inputs.length; i++) {
		tx.addInput(Bitcoin.Transaction.fromHex(dto.inputs[i].transaction), dto.inputs[i].index);
	}
	tx.addOutput(dto.output, finalAmount);
	if (dto.changeOutput) {
		tx.addOutput(dto.changeOutput, changeAmount);
	}
	for (let i = 0; i < dto.inputs.length; i++) {
		tx.sign(i, keyPair, redeemScriptObject);
	}

	return tx.build().toHex();
};

function getKeyPairFromWif (privateKeyWif) {
	return Bitcoin.ECPair.fromWIF(privateKeyWif, properties.BITCOIN_NETWORK);
}
function getRedeemScriptObject (redeemScript) {
	return buffer.Buffer.from(redeemScript, 'hex');
}
function validateDTO (dto) {
	let invalidInputs = false;
	for (let i = 0; i < dto.inputs.length; i++) {
		if (dto.inputs[i].value < 0 || dto.inputs[i].index < 0 || typeof dto.inputs[i].transaction === 'undefined' || dto.inputs[i] === null) {
			invalidInputs = true;
		}
	}
	if (!dto.privateKeyWif || !dto.inputs || dto.inputs.length < 1 || invalidInputs || !dto.output || dto.amount <= 0 || dto.feePerByte < 0 || !dto.redeemScript) {
		throw new Error('Validation: Invalid parameters');
	}
}

export default TransactionService;
