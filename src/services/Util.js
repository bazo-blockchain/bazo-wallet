const Util = {
	EMAIL_REGEX: /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
	TOKEN_LENGTH: 36,
	PASSWORD_MIN_LENGTH: 6,
	DATE_FORMAT: 'YYYY-MM-DD, HH:mm:ss',

	formatCurrency: function (value) {
		// see http://stackoverflow.com/a/43208223/3233827
		let val = (value / 1).toFixed(2).replace('.', ',');
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
	},
	formatSatoshi: function (value) {
		let val = (value / 1).toFixed(0);
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
	}

};

export default Util;
