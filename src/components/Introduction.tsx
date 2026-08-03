import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Sparkles, HelpingHand, CheckCircle2, AlertCircle } from "lucide-react";

export const Introduction: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="intro" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Context Narrative & Promise */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                {language === "nl" ? "Over de Training" : "About the Course"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
                {t.intro.title}
              </h2>
              <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4" />
            </div>

            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              {t.intro.lead}
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              {t.intro.description}
            </p>

            {/* "Our Promise" / "Onze Belofte" Visual callout */}
            <div className="relative p-6 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex gap-4 items-start shadow-sm">
              <div className="p-3 bg-emerald-600 text-white rounded-xl flex-shrink-0">
                <HelpingHand className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-1.5">
                  {t.intro.promiseTitle}
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mt-2 italic font-sans font-medium">
                  "{t.intro.promiseText}"
                </p>
              </div>
            </div>

            {/* Why Participate Checklist */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-slate-900 mb-5">
                {t.intro.whyJoinTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.intro.whyJoinPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pain Points Card (Empathy Builder) */}
          <div className="lg:col-span-5 w-full">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-md flex flex-col space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2.5 bg-yellow-500/15 text-yellow-600 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.intro.painPointsTitle}
                </h3>
              </div>

              <div className="space-y-4">
                {t.intro.painPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow duration-150"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-600 leading-relaxed font-medium">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              {/* Responsive closing prompt */}
              <div className="bg-emerald-600 text-white p-5 rounded-2xl text-center shadow-md flex flex-col items-center space-y-2 mt-4">
                <p className="text-sm font-bold leading-snug">
                  {language === "nl"
                    ? "Klinkt dit herkenbaar? Dan is deze training de sleutel tot jouw AI-toekomst."
                    : "Sound familiar? Then this training is the key to your AI future."}
                </p>
                <a
                  id="lnk-intro-register"
                  href="#register"
                  className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors mt-1 shadow-sm"
                >
                  {language === "nl" ? "Direct aanmelden" : "Register now"}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
