import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/types';
import { translations } from '../i18n/translations';
import { en } from '../i18n/locales/en';

describe('Multilingual i18n Suite - Indian Constitutional Languages', () => {
  it('supports exactly 23 languages (English + all 22 Eighth Schedule Indian Languages)', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(23);
  });

  it('contains all 22 official scheduled languages plus English with correct BCP 47 codes', () => {
    const requiredCodes: LanguageCode[] = [
      'en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'or',
      'ml', 'pa', 'as', 'mai', 'sat', 'ks', 'ne', 'sd', 'doi', 'kok',
      'mni', 'brx', 'sa'
    ];

    for (const code of requiredCodes) {
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === code);
      expect(match, `Language ${code} must be defined in SUPPORTED_LANGUAGES`).toBeDefined();
      expect(match?.nativeName.length).toBeGreaterThan(0);
      expect(match?.bcp47.length).toBeGreaterThan(0);
    }
  });

  it('correctly sets isRTL = true for Urdu, Kashmiri, and Sindhi, and false for others', () => {
    const urdu = SUPPORTED_LANGUAGES.find((l) => l.code === 'ur');
    const kashmiri = SUPPORTED_LANGUAGES.find((l) => l.code === 'ks');
    const sindhi = SUPPORTED_LANGUAGES.find((l) => l.code === 'sd');
    const hindi = SUPPORTED_LANGUAGES.find((l) => l.code === 'hi');
    const english = SUPPORTED_LANGUAGES.find((l) => l.code === 'en');

    expect(urdu?.isRTL).toBe(true);
    expect(kashmiri?.isRTL).toBe(true);
    expect(sindhi?.isRTL).toBe(true);
    expect(hindi?.isRTL).toBe(false);
    expect(english?.isRTL).toBe(false);
  });

  it('has valid translation dictionaries for all 23 languages without missing core keys', () => {
    const englishKeys = Object.keys(en);
    expect(englishKeys.length).toBeGreaterThan(50);

    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = translations[lang.code];
      expect(dict, `Dictionary for ${lang.code} should exist`).toBeDefined();

      // Ensure critical customer and operational keys exist
      expect(dict['brand.tagline']).toBeDefined();
      expect(dict['nav.home']).toBeDefined();
      expect(dict['hero.title1']).toBeDefined();
      expect(dict['hero.quoteBtn']).toBeDefined();
      expect(dict['form.submit']).toBeDefined();
    }
  });

  it('uses native scripts rather than romanised transliteration for Indian languages', () => {
    expect(translations.hi['nav.home']).toBe('होम');
    expect(translations.bn['nav.home']).toBe('হোম');
    expect(translations.ta['nav.home']).toBe('முகப்பு');
    expect(translations.te['nav.home']).toBe('హోమ్');
    expect(translations.ur['nav.home']).toBe('ہوم');
    expect(translations.sa['nav.home']).toBe('मुख्यपृष्ठम्');
  });
});
