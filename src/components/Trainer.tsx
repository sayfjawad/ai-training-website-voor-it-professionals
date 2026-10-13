import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { HeartHandshake } from "lucide-react";

export const Trainer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="trainer" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "ACADEMIE & TRAINERS" : "FACULTY & TRAINERS"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.trainer.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {t.trainer.subtitle}
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Trainer Profiles (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {t.trainer.trainers.map((trainer, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/60 shadow-xs flex flex-col space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="/omar-zahawi.jpg"
                    alt={trainer.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40 flex-shrink-0 shadow-xs"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{trainer.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-0.5">
                      {trainer.role}
                    </p>
                    <a
                      href={trainer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4"
                    >
                      {language === "nl" ? "Bekijk profiel op LinkedIn" : "View profile on LinkedIn"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Block: Stichting Duurzaam AI & Our Approach (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* About Foundation */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-xs text-left">
              <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2 mb-3.5">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                {t.trainer.aboutFoundationTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {t.trainer.aboutFoundationText}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
