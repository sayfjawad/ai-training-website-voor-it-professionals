import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Clock, BookOpen, Coffee, Utensils, Shield, Sparkles } from "lucide-react";

export const Program: React.FC = () => {
  const { language, t } = useLanguage();

  // Match icons dynamically based on schedule contents
  const getBlockIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("intro") || lowerTitle.includes("landschap")) {
      return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
    if (lowerTitle.includes("hoe ai werkt") || lowerTitle.includes("how ai works")) {
      return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
    if (lowerTitle.includes("pauze") || lowerTitle.includes("break")) {
      return <Coffee className="w-5 h-5 text-amber-600" />;
    }
    if (lowerTitle.includes("prompting")) {
      return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
    if (lowerTitle.includes("lunch")) {
      return <Utensils className="w-5 h-5 text-emerald-600" />;
    }
    if (lowerTitle.includes("assistent") || lowerTitle.includes("assistant")) {
      return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
    if (lowerTitle.includes("security") || lowerTitle.includes("governance") || lowerTitle.includes("privacy")) {
      return <Shield className="w-5 h-5 text-emerald-600" />;
    }
    return <BookOpen className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <section id="program" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "HET DAGPROGRAMMA" : "DAILY AGENDA"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.program.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4">
            {t.program.subtitle}
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-slate-200 pl-4 sm:pl-8 ml-2 sm:ml-6 space-y-8">
          {t.program.timeline.map((block, idx) => {
            const isSpecialBlock = block.title.toLowerCase().includes("pauze") || 
                                   block.title.toLowerCase().includes("break") || 
                                   block.title.toLowerCase().includes("lunch");

            return (
              <div key={idx} className="relative group">
                
                {/* Timeline Bullet */}
                <div className={`absolute -left-[25px] sm:-left-[41px] top-1.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 bg-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                  isSpecialBlock 
                    ? "border-amber-500 text-amber-500" 
                    : "border-emerald-600 text-emerald-600"
                }`}>
                  {getBlockIcon(block.title)}
                </div>

                {/* Event Card */}
                <div
                  className={`p-6 rounded-2xl border border-slate-200/60 bg-white shadow-2xs hover:shadow-xs transition-all duration-200 ${
                    isSpecialBlock ? "bg-amber-50/40 border-amber-100/70" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Time & Title */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{block.time}</span>
                      </div>
                      <h3 className={`text-base font-bold ${
                        isSpecialBlock ? "text-slate-700" : "text-slate-950"
                      }`}>
                        {block.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed font-light">
                    {block.description}
                  </p>



                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
