import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Sparkles, HelpingHand } from "lucide-react";

export const Introduction: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="intro" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Context Narrative & Promise */}
          <div className="lg:col-span-12 max-w-3xl flex flex-col space-y-8 text-left">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                {language === "nl" ? "Over de masterclass" : "About the Masterclass"}
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

          </div>

        </div>
      </div>
    </section>
  );
};
