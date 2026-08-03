import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Star, ShieldAlert, Award, BookmarkCheck, HeartHandshake } from "lucide-react";

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
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-700 font-extrabold text-lg font-sans shadow-xs">
                      {trainer.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-xs">
                      <Award className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      <a
                        href={trainer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-600 transition-colors group"
                        title={language === "nl" ? `Bekijk LinkedIn-profiel van ${trainer.name}` : `View LinkedIn profile of ${trainer.name}`}
                      >
                        <span className="group-hover:underline underline-offset-4 decoration-emerald-500">{trainer.name}</span>
                      </a>
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-0.5">
                      {trainer.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {trainer.bio}
                </p>

                <div className="flex gap-2 items-center text-xs text-slate-400 font-medium pt-3 border-t border-slate-100">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                  <span>{trainer.experience}</span>
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

            {/* Our Methodology & Core Beliefs */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-md text-left flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2 mb-4">
                  <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                  {t.trainer.approachTitle}
                </h3>
                
                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  {t.trainer.approachIntro}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {t.trainer.approachPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-sm">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-200 font-medium leading-relaxed text-[13px]">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Philosophy Callout */}
              <div className="mt-8 border-t border-slate-800 pt-5 flex items-start gap-3 text-slate-400 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {language === "nl"
                    ? "Wij verkopen geen hype of marketingverhalen. Wij rusten IT-professionals uit met direct toepasbare vaardigheden en ethisch verantwoorde richtlijnen."
                    : "We do not sell hypes or marketing stories. We arm IT professionals with immediately actionable engineering skills and secure guidelines."}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
