var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
	loaders: (function() {
		var loaders = getCssLoaders();
		loaders.i18n = '@kazupon/vue-i18n-loader';
		return loaders;
	})()
}

function getCssLoaders() {
	return utils.cssLoaders({
		sourceMap: isProduction
			? config.build.productionSourceMap
			: config.dev.cssSourceMap,
		extract: isProduction
	});
}