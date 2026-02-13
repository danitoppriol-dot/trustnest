// i18n configuration and translation management
export type Language = 'en' | 'it' | 'fr' | 'de' | 'es' | 'sv' | 'pt' | 'nl';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  sv: 'Svenska',
  pt: 'Português',
  nl: 'Nederlands',
};

export const DEFAULT_LANGUAGE: Language = 'en';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem('trustnest-language');
  return (stored as Language) || DEFAULT_LANGUAGE;
};

export const setStoredLanguage = (lang: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('trustnest-language', lang);
  }
};

export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs = Object.keys(LANGUAGES) as Language[];
  return supportedLangs.includes(browserLang as Language) ? (browserLang as Language) : DEFAULT_LANGUAGE;
};
