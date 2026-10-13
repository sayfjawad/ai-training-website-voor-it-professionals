import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Users2, ShieldAlert, GraduationCap } from "lucide-react";

export const TargetAudience: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="audience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "DOELGROEP & VOORKENNIS" : "TARGET AUDIENCE & PREREQUISITES"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.audience.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-base text-slate-600 mt-6 leading-relaxed">
            {t.audience.description}
          </p>
        </div>

        {/* Audience Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Roles / domains */}
          <div className="lg:col-span-8">

            {/* Roles Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/60 shadow-xs flex flex-col h-full">
              <h3 className="text-lg font-bold text-slate-950 mb-5 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-emerald-600" />
                {t.audience.tasksTitle}
              </h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5 flex-1">
                {t.audience.tasksList.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-500 mt-1 flex-shrink-0 text-xs">●</span>
                    <span className="text-sm font-medium text-slate-700 leading-snug">{task}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Prerequisites & Exclusions */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
            
            {/* Prerequisites */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/60 shadow-xs flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">
                  {t.audience.requirementsTitle}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {t.audience.requirementsText}
              </p>
            </div>

            {/* When not suitable */}
            <div className="p-8 rounded-3xl bg-red-50/50 border border-red-100 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-red-50 rounded-xl text-red-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">
                  {t.audience.notForTitle}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {t.audience.notForText}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
