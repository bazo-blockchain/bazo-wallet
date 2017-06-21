import Vue from 'vue';
import VueI18n from 'vue-i18n';
import globalTranslations from '@/config/translations.json';
import Store from '@/config/Store';

Vue.use(VueI18n);

const getBrowserLanguageOrEnglish = () => {
	let browserLanguage = window.navigator.language || window.navigator.language;
	if (browserLanguage && /^de/i.test(browserLanguage)) {
		return 'de';
	} else {
		return 'en';
	}
};

const i18n = new VueI18n({
	locale: (() => {
		if (Store.state.language) {
			return Store.state.language;
		} else {
			const language = getBrowserLanguageOrEnglish();
			Store.dispatch('updateLanguage', language);
			return language;
		}
	})(),
	fallbackLocale: 'en',
	messages: globalTranslations,
	silentTranslationWarn: true
});

Vue.prototype.$locale = {
	change: (language) => {
		i18n.locale = language;
		Store.dispatch('updateLanguage', language);
	},
	current: () => {
		return i18n.locale;
	}
};

export default i18n;
