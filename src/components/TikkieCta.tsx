import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { ExternalLink, CheckCircle2 } from "lucide-react";

// Update this URL once the Tikkie payment link is created
const TIKKIE_URL = "https://tikkie.me/pay/Stichti5519/a1Nih6bHydBzAbyBsn7y64";

export const TikkieCta: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="register" className="py-20 bg-slate-100 scroll-mt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "AANMELDEN & BETALEN" : "ENROLL & PAY"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.registration.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {t.registration.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden p-8 sm:p-12 text-center space-y-8">

          {/* Price block */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <p className="text-xs text-slate-400 line-through mb-1">
              {language === "nl" ? `Normaal: ${t.practical.originalPrice}` : `Normal: ${t.practical.originalPrice}`}
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black text-emerald-500">
                {t.practical.discountPrice}
              </span>
              <span className="text-sm text-slate-500">
                {language === "nl" ? "p.p. excl. btw" : "p.p. excl. VAT"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{t.practical.priceDetails}</p>
          </div>

          {/* What's included */}
          <div className="text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {t.practical.includesLabel}
            </p>
            {t.practical.includesList.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Tikkie CTA button */}
          <a
            id="btn-tikkie-pay"
            href={TIKKIE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 shadow-lg hover:shadow-emerald-400/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            {language === "nl" ? "Betaal via Tikkie →" : "Pay via Tikkie →"}
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>

          <p className="text-xs text-slate-400 leading-relaxed">
            {language === "nl"
              ? "Na betaling ontvang je direct een bevestigingsmail met alle details. Vragen? Mail naar info@stichtingduurzaamai.nl"
              : "After payment you will receive a confirmation email with all details. Questions? Email info@stichtingduurzaamai.nl"}
          </p>

        </div>
      </div>
    </section>
  );
};
