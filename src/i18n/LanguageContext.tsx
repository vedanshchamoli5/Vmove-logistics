import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageMeta, SUPPORTED_LANGUAGES } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageMeta[];
  currentMeta: LanguageMeta;
  isRTL: boolean;
}

const STORAGE_KEY = 'vmove_preferred_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
      // Check browser language preference if available
      const browserLang = (typeof navigator !== 'undefined' ? navigator.language : '').toLowerCase();
      const match = SUPPORTED_LANGUAGES.find((l) => browserLang.startsWith(l.code));
      if (match) return match.code;
    } catch {}
    return 'en';
  });

  const currentMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = Boolean(currentMeta.isRTL);

  // Synchronize document attributes whenever language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentMeta.bcp47 || language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('data-language', language);
      document.documentElement.setAttribute('data-script', currentMeta.script);

      if (isRTL) {
        document.body.classList.add('rtl-active');
      } else {
        document.body.classList.remove('rtl-active');
      }
    }
  }, [language, currentMeta, isRTL]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentMeta,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
