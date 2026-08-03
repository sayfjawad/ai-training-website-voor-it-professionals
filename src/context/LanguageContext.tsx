import React, { createContext, useContext, useState, useEffect } from "react";
import { TranslationContent } from "../types";
import { translations } from "../content";

type Language = "nl" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("duurzaam_ai_lang");
    if (saved === "nl" || saved === "en") return saved;
    
    // Check browser default language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith("nl")) return "nl";
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("duurzaam_ai_lang", lang);
  };

  useEffect(() => {
    // Synchronize HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
