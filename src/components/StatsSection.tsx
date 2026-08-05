import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Users, Eye, BarChart3 } from "lucide-react";

interface StatsResponse {
  registrations: {
    total: number;
    capacity: number;
    seatsRemaining: number;
    experienceBreakdown: Record<string, number>;
    invoiceToOrganizationCount: number;
  };
  traffic: {
    hoofdwebsite: { pageviews: number; visits: number };
    training: { pageviews: number; visits: number };
  };
}

export const StatsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  const total = stats?.registrations.total ?? 0;
  const capacity = stats?.registrations.capacity ?? 10;
  const seatsRemaining = stats?.registrations.seatsRemaining ?? capacity;
  const fillPercent = Math.min(100, (total / capacity) * 100);

  const experienceEntries: [string, number][] = stats
    ? (Object.entries(stats.registrations.experienceBreakdown) as [string, number][]).sort((a, b) => b[1] - a[1])
    : [];
  const maxExperienceCount = experienceEntries.reduce((max, entry) => Math.max(max, entry[1]), 0);

  return (
    <section id="statistieken" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {t.stats.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.stats.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {t.stats.subtitle}
          </p>
        </div>

        {error ? (
          <p className="text-center text-sm text-slate-500">{t.stats.error}</p>
        ) : !stats ? (
          <p className="text-center text-sm text-slate-500">{t.stats.loading}</p>
        ) : (
          <div className="space-y-10">

            {/* Seats progress */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                  {t.stats.seatsLabel}
                </h3>
                <span className="text-sm font-bold text-emerald-700">
                  {seatsRemaining === 0
                    ? t.stats.seatsFull
                    : `${total} / ${capacity} ${t.stats.seatsFilled}`}
                </span>
              </div>
              <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>

            {/* Stat tiles */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">{total}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {t.stats.totalRegistrations}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {stats.traffic.training.pageviews.toLocaleString(language === "nl" ? "nl-NL" : "en-US")}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {t.stats.totalVisitors}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {stats.registrations.invoiceToOrganizationCount}
                  </p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {language === "nl" ? "Via werkgever" : "Via employer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience breakdown */}
            {experienceEntries.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/60">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-5">
                  {t.stats.experienceBreakdownTitle}
                </h3>
                <div className="space-y-3">
                  {experienceEntries.map(([label, count]) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="w-24 flex-shrink-0 text-xs font-semibold text-slate-600">{label}</span>
                      <div className="flex-grow h-3 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${maxExperienceCount ? (count / maxExperienceCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-6 flex-shrink-0 text-xs font-bold text-slate-700 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};
