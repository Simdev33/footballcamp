"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, type Locale, type Translations } from "./i18n";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  dbContent?: { hu: unknown; en: unknown } | null;
}

export function LanguageProvider({ children, dbContent }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>("hu");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "hu" ? "en" : "hu"));
  }, []);

  const t = (dbContent ? dbContent[locale] : translations[locale]) as Translations;

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
