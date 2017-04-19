import Vue from 'vue';

const Filters = {
	enumReadable: function (value) {
		if (!value) { return ''; }
		value = value.toString();

		value = value.replace(/_/g, ' ');
		value = value.replace(/\b(\w+)\b/g, function (match) {
			let firstCharacter = match.substring(0, 1).toUpperCase();
			let restCharacters = '';
			if (match.length > 1) {
				restCharacters = match.substring(1).toLowerCase();
			}
			return firstCharacter + restCharacters;
		});

		return value;
	}
};

for (let filterName in Filters) {
	if (Filters.hasOwnProperty(filterName)) {
		Vue.filter(filterName, Filters[filterName]);
	}
}
