import Vue from 'vue';
import VueI18n from 'vue-i18n';
import globalTranslations from '@/config/translations.json';
import Store from '@/config/Store';

Vue.use(VueI18n);

// improves accessibility for screenreaders
const setHtmlLanguage = (language) => {
	document.querySelector('html').setAttribute('lang', language);
};

const getBrowserLanguageOrEnglish = () => {
	let browserLanguage = window.navigator.language || window.navigator.language;
	if (browserLanguage && /^de/i.test(browserLanguage)) {
		return 'de';
	} else {
		return 'en';
	}
};

const initialLanguage = () => {
	let language = getBrowserLanguageOrEnglish();

	if (Store.state.language) {
		language = Store.state.language;
	} else {
		// if the language is not taken from the store,
		// it needs to be sent to the store
		Store.dispatch('updateLanguage', language);
	}
	setHtmlLanguage(language);

	return language;
};

const i18n = new VueI18n({
	locale: initialLanguage(),
	fallbackLocale: 'en',
	messages: globalTranslations,
	silentTranslationWarn: true
});

Vue.prototype.$locale = {
	change: (language) => {
		i18n.locale = language;
		Store.dispatch('updateLanguage', language);
		setHtmlLanguage(language);
	},
	current: () => {
		return i18n.locale;
	}
};

export default i18n;
