const UtilService = {
	EMAIL_REGEX: /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
	BTC_ADDRESS_REGEX: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
	TOKEN_LENGTH: 36,
	PASSWORD_MIN_LENGTH: 6,
	DATE_FORMAT: 'YYYY-MM-DD, HH:mm:ss',
	DATE_ONLY_FORMAT: 'YYYY-MM-DD',
	SATOSHI_PER_BITCOIN: 100000000
};

UtilService.formatCurrency = function (value) {
	// see http://stackoverflow.com/a/43208223/3233827
	let val = (value / 1).toFixed(2).replace('.', ',');
	return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
};
UtilService.formatSatoshi = function (value) {
	let val = (value / 1).toFixed(0);
	return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
};
UtilService.convertSatoshiToBitcoin = function (satoshi) {
	return window.parseInt(satoshi, 10) / UtilService.SATOSHI_PER_BITCOIN;
};
UtilService.convertBitcoinToSatoshi = function (bitcoin) {
	return Math.round(window.parseFloat(bitcoin) * UtilService.SATOSHI_PER_BITCOIN);
};

export default UtilService;
