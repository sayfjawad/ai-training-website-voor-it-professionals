import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { MessagesSquare, Cpu, Terminal, Code, ShieldCheck, Lightbulb } from "lucide-react";

export const Objectives: React.FC = () => {
  const { t } = useLanguage();

  // Match icons to the index of objectives
  const icons = [
    <MessagesSquare className="w-6 h-6 text-emerald-600" />,
    <Cpu className="w-6 h-6 text-emerald-600" />,
    <Terminal className="w-6 h-6 text-emerald-600" />,
    <Code className="w-6 h-6 text-emerald-600" />,
    <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    <Lightbulb className="w-6 h-6 text-emerald-600" />,
  ];

  return (
    <section id="objectives" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {t.objectives.title.toUpperCase()}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-sans tracking-tight">
            {t.objectives.subtitle}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
        </div>

        {/* 3x2 Grid layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.objectives.items.map((item, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-3xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col text-left space-y-4"
            >
              {/* Icon Frame */}
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <div className="group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  {icons[idx] || <Cpu />}
                </div>
              </div>

              {/* Text elements */}
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-700 transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
