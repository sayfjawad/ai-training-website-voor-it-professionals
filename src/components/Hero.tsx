import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Users, ChevronRight, Award } from "lucide-react";

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();

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
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
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

            {/* Quick Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 py-3 w-full"
            >
              {t.intro.whyJoinPoints.slice(1, 5).map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 mt-0.5 text-base">✔</span>
                  <span className="font-medium text-[13.5px] leading-snug">{point}</span>
                </div>
              ))}
            </motion.div>

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

          {/* Hero Promotional Info Card */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xs flex flex-col space-y-6"
            >
              {/* Early Bird Badge */}
              <div className="absolute top-0 right-0 bg-yellow-500 text-slate-950 font-black text-xs px-5 py-2 uppercase tracking-widest rounded-bl-2xl shadow-md animate-pulse">
                {language === "nl" ? "Vroegboekkorting!" : "Early Bird!"}
              </div>

              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                {language === "nl" ? "Praktijkdetails" : "Training Specifications"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-2xl text-emerald-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {t.practical.dateLabel}
                    </p>
                    <p className="text-sm font-bold text-slate-100">{t.practical.dateValue}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-2xl text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {t.practical.timeLabel}
                    </p>
                    <p className="text-sm font-bold text-slate-100">{t.practical.timeValue}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-2xl text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {t.practical.locationLabel}
                    </p>
                    <p className="text-sm font-bold text-slate-100">{t.practical.locationValue}</p>
                  </div>
                </div>

                {/* Group Size */}
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-2xl text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {t.practical.groupSizeLabel}
                    </p>
                    <p className="text-sm font-bold text-slate-100">{t.practical.groupSizeValue}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 line-through mb-1">
                    {language === "nl" ? `Normaal: ${t.practical.originalPrice}` : `Normal: ${t.practical.originalPrice}`}
                  </p>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-black text-emerald-400">
                      {t.practical.discountPrice}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {language === "nl" ? "(met vroegboekkortingscode)" : "(with early bird discount code)"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight mt-1.5">
                    {language === "nl" ? "* Excl. BTW / Inclusief lunch & drankjes" : "* Excl. VAT / Includes lunch & refreshments"}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 font-bold">
                    {language === "nl" ? "Bespaar 75% met jouw code!" : "Save 75% with your code!"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {language === "nl" ? "Slechts 10 plekken!" : "Only 10 slots!"}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Note */}
              <div className="text-center text-xs text-slate-400 italic">
                {language === "nl" ? "✔ Geen AI-voorkennis nodig" : "✔ No prior AI experience required"}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
