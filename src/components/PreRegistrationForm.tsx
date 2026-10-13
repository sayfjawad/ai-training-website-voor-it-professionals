import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { User, Mail, Building2, Phone, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";

const TIKKIE_URL = "https://tikkie.me/pay/Stichti5519/a1Nih6bHydBzAbyBsn7y64";

export const PreRegistrationForm: React.FC = () => {
  const { language, t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !lastName || !email) {
      setErrorMsg(t.registration.validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `GOV-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          firstName,
          lastName,
          email,
          phone,
          organization,
          language,
        }),
      });

      if (!response.ok) throw new Error("API error");

      setIsSubmitting(false);
      setSubmitSuccess(true);
      document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setIsSubmitting(false);
      setErrorMsg(
        language === "nl"
          ? "Er is een fout opgetreden. Probeer het opnieuw of mail naar info@stichtingduurzaamai.nl."
          : "An error occurred. Please try again or email info@stichtingduurzaamai.nl."
      );
    }
  };

  return (
    <section id="register" className="py-20 bg-slate-100 scroll-mt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "AANMELDEN & BETALEN" : "ENROLL & PAY"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.registration.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            {language === "nl"
              ? "Vul je gegevens in en ontvang direct de betaallink per e-mail."
              : "Fill in your details and receive the payment link by email immediately."}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">

          {submitSuccess ? (
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-950">
                  {language === "nl" ? `Bedankt, ${firstName}!` : `Thank you, ${firstName}!`}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {language === "nl"
                    ? `We hebben je aanmelding ontvangen en een e-mail gestuurd naar ${email} met de betaallink.`
                    : `We've received your registration and sent an email to ${email} with the payment link.`}
                </p>
              </div>

              {/* Tikkie link direct zichtbaar als backup */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === "nl" ? "Of betaal direct via:" : "Or pay directly via:"}
                </p>
                <a
                  href={TIKKIE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  Betaal €75 via Tikkie
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                {language === "nl"
                  ? "E-mail niet ontvangen? Check je spammap of mail naar info@stichtingduurzaamai.nl."
                  : "Email not received? Check your spam folder or email info@stichtingduurzaamai.nl."}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 text-left">

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-950">
                  {language === "nl" ? "Jouw gegevens" : "Your details"}
                </h3>
                <span className="ml-auto text-xs text-slate-400 font-medium">
                  {language === "nl" ? "Je ontvangt de Tikkie link per e-mail" : "You'll receive the Tikkie link by email"}
                </span>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.registration.firstName}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={language === "nl" ? "bijv. Jan" : "e.g. John"}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.registration.lastName}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={language === "nl" ? "bijv. Jansen" : "e.g. Smith"}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.registration.email}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === "nl" ? "bijv. jan@bedrijf.nl" : "e.g. john@company.com"}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.registration.organization}
                    <span className="font-normal text-slate-400 ml-1">({language === "nl" ? "optioneel" : "optional"})</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={language === "nl" ? "bijv. Acme BV" : "e.g. Acme Ltd"}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.registration.phone}
                    <span className="font-normal text-slate-400 ml-1">({language === "nl" ? "optioneel" : "optional"})</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="bijv. 0612345678"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Price reminder */}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3">
                <span className="text-sm text-slate-700 font-medium">
                  {language === "nl" ? "Deelnamekosten:" : "Participation fee:"}
                </span>
                <span className="text-lg font-black text-emerald-600">€75 {language === "nl" ? "p.p." : "p.p."}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400">
                  {language === "nl" ? "* Verplichte velden" : "* Required fields"}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-200 disabled:text-slate-400 active:bg-emerald-500 transition-all duration-150 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">✦</span>
                      {language === "nl" ? "Versturen..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      {language === "nl" ? "Stuur mij de betaallink" : "Send me the payment link"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
};
