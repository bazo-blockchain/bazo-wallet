import IndexedDB from 'idb-keyval';
import moment from 'moment';

const CACHE_PREFIX = 'cache-';
const MAXIMAL_CACHE_DURATION = 60 * 60 * 24 * 7;

const expired = (date) => {
	return moment().diff(date, 'seconds') > MAXIMAL_CACHE_DURATION;
};

export default {

	setCache (name, value, paramsArray) {
		paramsArray = paramsArray || [];
		return IndexedDB.set(CACHE_PREFIX + name + '-' + JSON.stringify(paramsArray), {
			date: new Date(),
			value: value
		});
	},

	getCache (name, paramsArray) {
		paramsArray = paramsArray || [];
		return IndexedDB.get(CACHE_PREFIX + name + '-' + JSON.stringify(paramsArray)).then((fullValue) => {
			// removes old, expired entries when fetched
			if (expired(fullValue.date)) {
				IndexedDB['delete'](CACHE_PREFIX + name + '-' + JSON.stringify(paramsArray));
				return Promise.reject();
			} else {
				return Promise.resolve(fullValue.value);
			}
		}, () => {
			return Promise.reject();
		});
	}

};
