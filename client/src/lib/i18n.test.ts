import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getStoredLanguage, setStoredLanguage, DEFAULT_LANGUAGE, LANGUAGES } from './i18n';
import { t } from './translations';
import type { Language } from './i18n';

describe('i18n - Internationalization System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Language Constants', () => {
    it('should have 8 supported languages', () => {
      const languages = Object.keys(LANGUAGES);
      expect(languages).toHaveLength(8);
    });

    it('should have correct language codes', () => {
      const expectedLanguages = ['en', 'it', 'fr', 'de', 'es', 'sv', 'pt', 'nl'];
      const actualLanguages = Object.keys(LANGUAGES);
      expectedLanguages.forEach(lang => {
        expect(actualLanguages).toContain(lang);
      });
    });

    it('should have correct language names', () => {
      expect(LANGUAGES.en).toBe('English');
      expect(LANGUAGES.it).toBe('Italiano');
      expect(LANGUAGES.fr).toBe('Français');
      expect(LANGUAGES.de).toBe('Deutsch');
      expect(LANGUAGES.es).toBe('Español');
      expect(LANGUAGES.sv).toBe('Svenska');
      expect(LANGUAGES.pt).toBe('Português');
      expect(LANGUAGES.nl).toBe('Nederlands');
    });

    it('should have English as default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });
  });

  describe('Language Storage', () => {
    it('should return default language when nothing is stored', () => {
      const lang = getStoredLanguage();
      expect(lang).toBe(DEFAULT_LANGUAGE);
    });

    it('should store and retrieve language preference', () => {
      const testLang: Language = 'it';
      setStoredLanguage(testLang);
      const retrieved = getStoredLanguage();
      expect(retrieved).toBe(testLang);
    });

    it('should persist language across multiple calls', () => {
      setStoredLanguage('fr');
      expect(getStoredLanguage()).toBe('fr');
      expect(getStoredLanguage()).toBe('fr');
    });

    it('should update language when set multiple times', () => {
      setStoredLanguage('de');
      expect(getStoredLanguage()).toBe('de');
      setStoredLanguage('es');
      expect(getStoredLanguage()).toBe('es');
    });
  });

  describe('Translation Function', () => {
    it('should return English translation for valid key', () => {
      const result = t('nav.properties', 'en');
      expect(result).toBe('Properties');
    });

    it('should return Italian translation for valid key', () => {
      const result = t('nav.properties', 'it');
      expect(result).toBe('Proprietà');
    });

    it('should return French translation for valid key', () => {
      const result = t('nav.properties', 'fr');
      expect(result).toBe('Propriétés');
    });

    it('should return German translation for valid key', () => {
      const result = t('nav.properties', 'de');
      expect(result).toBe('Immobilien');
    });

    it('should return Spanish translation for valid key', () => {
      const result = t('nav.properties', 'es');
      expect(result).toBe('Propiedades');
    });

    it('should return Swedish translation for valid key', () => {
      const result = t('nav.properties', 'sv');
      expect(result).toBe('Fastigheter');
    });

    it('should return Portuguese translation for valid key', () => {
      const result = t('nav.properties', 'pt');
      expect(result).toBe('Propriedades');
    });

    it('should return Dutch translation for valid key', () => {
      const result = t('nav.properties', 'nl');
      expect(result).toBe('Woningen');
    });

    it('should return English fallback for missing language', () => {
      const result = t('nav.properties', 'en' as Language);
      expect(result).toBe('Properties');
    });

    it('should return key itself if translation not found', () => {
      const result = t('nav.properties', 'en');
      expect(result).not.toBe('nav.properties');
    });

    it('should translate hero section correctly', () => {
      const enTitle = t('hero.title', 'en');
      const itTitle = t('hero.title', 'it');
      const frTitle = t('hero.title', 'fr');

      expect(enTitle).toBe('Find Your Perfect Coliving in Safety');
      expect(itTitle).toBe('Trova il tuo coliving perfetto in sicurezza');
      expect(frTitle).toBe('Trouvez votre colocation parfaite en sécurité');
    });

    it('should translate features correctly', () => {
      const enFeature = t('features.verification.title', 'en');
      const deFeature = t('features.verification.title', 'de');

      expect(enFeature).toBe('Complete Identity Verification');
      expect(deFeature).toBe('Vollständige Identitätsverifizierung');
    });

    it('should translate CTA section correctly', () => {
      const enCTA = t('cta.title', 'en');
      const esCTA = t('cta.title', 'es');

      expect(enCTA).toBe('Ready to Find Your Perfect Coliving?');
      expect(esCTA).toBe('¿Listo para encontrar tu coliving perfecto?');
    });

    it('should translate footer correctly', () => {
      const enFooter = t('footer.copyright', 'en');
      const nlFooter = t('footer.copyright', 'nl');

      expect(enFooter).toBe('© 2026 TrustNest. All rights reserved.');
      expect(nlFooter).toBe('© 2026 TrustNest. Alle rechten voorbehouden.');
    });
  });

  describe('Translation Completeness', () => {
    it('should have all keys translated in all languages', () => {
      const enKeys = Object.keys(require('./translations').translations.en);
      const languages = ['it', 'fr', 'de', 'es', 'sv', 'pt', 'nl'] as Language[];

      languages.forEach(lang => {
        const langKeys = Object.keys(require('./translations').translations[lang]);
        expect(langKeys.length).toBe(enKeys.length);
      });
    });
  });
});
