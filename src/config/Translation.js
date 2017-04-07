import Vue from 'vue';
import VueI18n from 'vue-i18n';
import globalTranslations from '../config/translations.json';

Vue.use(VueI18n);

const KEY_LANGUAGE = 'coinblesk_language';
const getLanguageFromStorage = () => {
	return window.localStorage.getItem(KEY_LANGUAGE);
};
const hasLanguageInStorage = () => {
	return !!getLanguageFromStorage();
};
const setLanguageToStorage = (language) => {
	window.localStorage.setItem(KEY_LANGUAGE, language);
};

const i18n = new VueI18n({
	locale: hasLanguageInStorage() ? getLanguageFromStorage() : 'en',
	fallbackLocale: 'en',
	messages: globalTranslations
});

Vue.prototype.$locale = {
	change: (language) => {
		i18n.locale = language;
		setLanguageToStorage(language);
	},
	current: () => {
		return i18n.locale;
	}
};

export default i18n;
