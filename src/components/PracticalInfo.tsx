import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { MapPin, Calendar, Clock, Sparkles, CheckSquare, Laptop, Landmark, Mail } from "lucide-react";

export const PracticalInfo: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="practical" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "ALLES OP EEN RIJTJE" : "PRACTICAL LOGISTICS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.practical.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {t.practical.subtitle}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Core Specs (Date, Location, Time, Group size) */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
            
            {/* Date Block */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">{t.practical.dateLabel}</h3>
                <p className="text-base font-bold text-slate-900 mt-1">{t.practical.dateValue}</p>
                <span className="inline-block bg-yellow-500/15 text-yellow-600 text-xs px-2.5 py-0.5 rounded-sm font-bold mt-2">
                  {language === "nl" ? "Gegarandeerde datum" : "Guaranteed date"}
                </span>
              </div>
            </div>

            {/* Time Block */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">{t.practical.timeLabel}</h3>
                <p className="text-base font-bold text-slate-900 mt-1">{t.practical.timeValue}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.practical.timeDetails}</p>
              </div>
            </div>

            {/* Location Block */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">{t.practical.locationLabel}</h3>
                <p className="text-base font-bold text-slate-900 mt-1">{t.practical.locationValue}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.practical.locationDetails}</p>
              </div>
            </div>

            {/* Group Size / Level Block */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                  {t.practical.groupSizeLabel} & {language === "nl" ? "Niveau" : "Level"}
                </h3>
                <p className="text-sm font-bold text-slate-900 mt-1">{t.practical.groupSizeValue}</p>
                <p className="text-xs text-slate-600 font-semibold mt-1">{t.practical.levelValue}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.practical.levelDetails}</p>
              </div>
            </div>

            {/* Inclusions Check list */}
            <div className="sm:col-span-2 p-8 rounded-3xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-950 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                {t.practical.includesLabel}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {t.practical.includesList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-bold">✔</span>
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Price Callout & Post-booking Flow (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            
            {/* Price investment details */}
            <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-900 shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-sm">
                  {language === "nl" ? "EARLY BIRD PRIJS" : "PROMOTION RATE"}
                </span>
                
                <p className="text-xs text-slate-400 line-through mt-5">
                  {language === "nl" ? `Normaal: ${t.practical.originalPrice}` : `Normal: ${t.practical.originalPrice}`}
                </p>
                
                <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
                  <span className="text-4xl font-black text-emerald-400">
                    {t.practical.discountPrice}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {language === "nl" ? "(met vroegboekkortingscode)" : "(with early bird discount code)"}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed mt-4">
                  {t.practical.priceDetails}
                </p>
              </div>

              {/* Laptop requirements */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {t.practical.bringLabel}
                </h4>
                <div className="space-y-2">
                  {t.practical.bringRecommended.map((item, idx) => (
                    <p key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5 font-light">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps (What happens after booking) */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/60 flex flex-col justify-center text-left">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                {t.practical.afterRegisterLabel}
              </h3>
              <div className="space-y-3">
                {t.practical.afterRegisterValue.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
