import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export const Faq: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "VEELGESTELDE VRAGEN" : "FREQUENTLY ASKED QUESTIONS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.faq.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {t.faq.items.map((item, idx) => {
            const isOpen = activeIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-250 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50 border-emerald-500 shadow-xs"
                    : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  id={`btn-faq-trigger-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="flex items-start gap-3.5">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isOpen ? "text-emerald-600" : "text-slate-400"
                    }`} />
                    <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div className="text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Accordion Answer */}
                <div
                  id={`faq-answer-${idx}`}
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-96 opacity-100 border-t border-slate-200/50" : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={!isOpen}
                >
                  <p className="px-6 py-5 text-sm text-slate-600 leading-relaxed font-light bg-white">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Question Form Support */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0 hidden sm:block">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {language === "nl" ? "Staat jouw vraag er niet tussen?" : "Still have questions?"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {language === "nl"
                  ? "Geen probleem! Stel je vraag gerust via ons registratieformulier of per mail."
                  : "No problem! Ask your question directly using the contact form or email us."}
              </p>
            </div>
          </div>
          <a
            id="lnk-faq-contact"
            href="#register"
            className="px-5 py-2.5 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold transition-all duration-150 flex-shrink-0"
          >
            {language === "nl" ? "Stel een vraag" : "Ask a question"}
          </a>
        </div>

      </div>
    </section>
  );
};
