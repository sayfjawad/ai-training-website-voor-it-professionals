import React from "react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200">
      <button
        id="btn-lang-nl"
        onClick={() => setLanguage("nl")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
          language === "nl"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`}
        aria-label="Schakel naar Nederlands"
      >
        <span>NL</span>
      </button>
      <button
        id="btn-lang-en"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
          language === "en"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`}
        aria-label="Switch to English"
      >
        <span>EN</span>
      </button>
    </div>
  );
};
