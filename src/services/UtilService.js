import URIScheme from './URIScheme';

const UtilService = {
	EMAIL_REGEX: /^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
  HTTP_REGEX: /^(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/,
	TOKEN_LENGTH: 36,
	PASSWORD_MIN_LENGTH: 6,
	DATE_FORMAT: 'YYYY-MM-DD, HH:mm:ss',
	DATE_ONLY_FORMAT: 'YYYY-MM-DD',
	SATOSHI_PER_BITCOIN: 100000000
};

UtilService.validURL = function ValidURL (str) {
  const regex = UtilService.HTTP_REGEX;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}
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
UtilService.encodeAsCompleteURI = function (address, options, posid) {
  if (address) {
    let posidParam = '';
    if (posid) {
      posidParam = 'posid=' + posid + '&';
    } else {
      posidParam = ''
    }
    return encodeURI(location.origin + '/#/auth/user/send?' + posidParam + 'paymentinfo=' + URIScheme.encode(address, options))
  } return false;
};
UtilService.decodeFromCompleteURI = function (input) {
  let result = {};
  if (UtilService.validURL(input)) {
    let posidExists = input.match(/posid=(\S+)&/);
    if (posidExists) {
      result.posid = input.match(/posid=(\S+)&/)[1];
    }
    let bazoEncodedPayment = input.match(/paymentinfo=(\S+)/)[1]
    try {
      let decodedContent = URIScheme.decode(bazoEncodedPayment);
      result.bazoaddress = decodedContent.address;
      if (decodedContent.options.amount) {
        result.amount = decodedContent.options.amount;
      }
    } catch (e) {
      result.bazoaddress = bazoEncodedPayment;
    }
    return result;
  }
  return false;
}
export default UtilService;
