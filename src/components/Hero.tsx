import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { ChevronRight, Award } from "lucide-react";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24"
    >
      {/* Background Decorative Tech Grids */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#ffffff15 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Hero Main Copy */}
          <div className="lg:col-span-12 max-w-3xl flex flex-col items-start space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-emerald-950/75 text-emerald-300 border border-emerald-800/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans"
            >
              {t.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <a
                id="btn-hero-cta"
                href="#register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 shadow-lg hover:shadow-emerald-400/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t.hero.ctaPrimary}
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <a
                id="btn-hero-program"
                href="#program"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:bg-slate-950 transition-all duration-200"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
