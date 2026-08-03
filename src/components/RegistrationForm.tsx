import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PrivacyModal, TermsModal } from "./LegalModals";
import { FileText, Building2, User, Phone, Mail, ChevronRight, CheckCircle2, HelpCircle } from "lucide-react";
import { RegistrationData } from "../types";

export const RegistrationForm: React.FC = () => {
  const { language, t } = useLanguage();
  
  // Modals state
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Form Fields State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [experience, setExperience] = useState("0–2 jaar");
  const [invoiceToOrganization, setInvoiceToOrganization] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [postalCodeCity, setPostalCodeCity] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation - Note that organization and functionName are no longer required
    if (!firstName || !lastName || !email || !agreeTerms || !agreePrivacy) {
      setErrorMsg(t.registration.validationError);
      return;
    }

    if (invoiceToOrganization && (!companyName || !invoiceAddress || !postalCodeCity || !billingEmail)) {
      setErrorMsg(t.registration.validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const newReg: RegistrationData = {
        id: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        firstName,
        lastName,
        email,
        phone,
        organization,
        functionName,
        experience,
        invoiceToOrganization,
        companyName: invoiceToOrganization ? companyName : undefined,
        invoiceAddress: invoiceToOrganization ? invoiceAddress : undefined,
        postalCodeCity: invoiceToOrganization ? postalCodeCity : undefined,
        vatNumber: invoiceToOrganization ? vatNumber : undefined,
        billingEmail: invoiceToOrganization ? billingEmail : undefined,
        discountCode: discountCode || undefined,
        remarks,
        agreeTerms,
        agreePrivacy,
      };

      // Send the registration to the backend server to dispatch an email notification
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReg),
      });

      if (!response.ok) {
        throw new Error("Registration API call failed");
      }

      // Save in localStorage for the Admin Panel
      const existingRaw = localStorage.getItem("duurzaam_ai_registrations");
      const existing: RegistrationData[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(newReg);
      localStorage.setItem("duurzaam_ai_registrations", JSON.stringify(existing));

      // Dispatch a custom event to notify other components (like AdminPanel) that a new registration occurred!
      window.dispatchEvent(new Event("new_registration_submitted"));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      scrollToFormTop();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(
        language === "nl"
          ? "Er is een fout opgetreden bij het verzenden van uw inschrijving. Probeer het opnieuw of neem contact op via info@stichtingduurzaamai.nl."
          : "An error occurred while sending your registration. Please try again or contact us at info@stichtingduurzaamai.nl."
      );
    }
  };

  const scrollToFormTop = () => {
    const el = document.getElementById("register");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setOrganization("");
    setFunctionName("");
    setExperience("0–2 jaar");
    setInvoiceToOrganization(true);
    setCompanyName("");
    setInvoiceAddress("");
    setPostalCodeCity("");
    setVatNumber("");
    setBillingEmail("");
    setDiscountCode("");
    setRemarks("");
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setSubmitSuccess(false);
  };

  return (
    <section id="register" className="py-20 bg-slate-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {language === "nl" ? "VEILIG EN SNEL RESERVEREN" : "SECURE ENROLLMENT"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {t.registration.title}
          </h2>
          <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-4 mx-auto" />
          <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            {t.registration.subtitle}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
          
          {submitSuccess ? (
            /* SUCCESS STATE */
            <div id="registration-success" className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-950 font-sans">
                  {t.registration.successTitle}
                </h3>
                <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  {t.registration.successText}
                </p>
              </div>

              {/* What happens next blocks */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/50 max-w-xl mx-auto text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-2">
                  {language === "nl" ? "Wat gebeurt er nu?" : "What happens next?"}
                </h4>
                <div className="space-y-3">
                  {t.registration.successSteps.map((step, idx) => (
                    <p key={idx} className="text-xs text-slate-600 leading-relaxed font-medium">
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="btn-register-new"
                  onClick={handleResetForm}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
                >
                  {language === "nl" ? "Nieuwe inschrijving invoeren" : "Register another participant"}
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form id="enrollment-form" onSubmit={handleFormSubmit} className="p-6 sm:p-10 space-y-8 text-left">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-950">
                  {t.registration.formTitle}
                </h3>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600 text-center">
                  {errorMsg}
                </div>
              )}

              {/* SECTION 1: Personal Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-l-4 border-emerald-500 pl-2.5">
                  {t.registration.personalData}
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.firstName}</label>
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
                        placeholder="bijv. Jan"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.lastName}</label>
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
                        placeholder="bijv. Jansen"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.email}</label>
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
                        placeholder="bijv. jan@bedrijf.nl"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.phone}</label>
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
              </div>

              {/* SECTION 2: Work & Experience */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-l-4 border-emerald-500 pl-2.5">
                  {t.registration.workData}
                </h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label htmlFor="organization" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.organization}</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <input
                        id="organization"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="bijv. Stichting Duurzaam AI"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="functionName" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.function}</label>
                    <input
                      id="functionName"
                      type="text"
                      value={functionName}
                      onChange={(e) => setFunctionName(e.target.value)}
                      placeholder="bijv. Systeembeheerder"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="experience" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.experience}</label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 text-sm focus:outline-hidden bg-white"
                    >
                      {t.registration.experienceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Invoice Info (AVG PDF requirements) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-l-4 border-emerald-500 pl-2.5">
                  {t.registration.invoiceData}
                </h4>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">{t.registration.invoiceRequired}</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={invoiceToOrganization === true}
                        onChange={() => setInvoiceToOrganization(true)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{t.registration.invoiceRequiredYes}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={invoiceToOrganization === false}
                        onChange={() => setInvoiceToOrganization(false)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{t.registration.invoiceRequiredNo}</span>
                    </label>
                  </div>
                </div>

                {invoiceToOrganization && (
                  <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/50">
                    <div>
                      <label htmlFor="companyName" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.companyName}</label>
                      <input
                        id="companyName"
                        type="text"
                        required={invoiceToOrganization}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="bijv. Innovatie IT BV"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:outline-hidden text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="billingEmail" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {language === "nl" ? "E-mailadres voor facturatie *" : "Billing email address *"}
                      </label>
                      <input
                        id="billingEmail"
                        type="email"
                        required={invoiceToOrganization}
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        placeholder="bijv. administratie@bedrijf.nl"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:outline-hidden text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="invoiceAddress" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.invoiceAddress}</label>
                      <input
                        id="invoiceAddress"
                        type="text"
                        required={invoiceToOrganization}
                        value={invoiceAddress}
                        onChange={(e) => setInvoiceAddress(e.target.value)}
                        placeholder="bijv. Stationsplein 12"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:outline-hidden text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCodeCity" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.postalCodeCity}</label>
                      <input
                        id="postalCodeCity"
                        type="text"
                        required={invoiceToOrganization}
                        value={postalCodeCity}
                        onChange={(e) => setPostalCodeCity(e.target.value)}
                        placeholder="bijv. 3011 GA Rotterdam"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:outline-hidden text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="vatNumber" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.vatNumber}</label>
                      <input
                        id="vatNumber"
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="bijv. NL123456789B01"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:outline-hidden text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: Kortingscode & Opmerkingen */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-l-4 border-emerald-500 pl-2.5">
                  {language === "nl" ? "Kortingscode" : "Discount Code"}
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="discountCode" className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === "nl" ? "Kortingscode" : "Discount Code"}
                    </label>
                    <input
                      id="discountCode"
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder={language === "nl" ? "Vul hier je kortingscode in..." : "Enter your discount code here..."}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm uppercase"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      {language === "nl"
                        ? "Heb je een kortingscode ontvangen? Vul deze dan hier in."
                        : "Did you receive a discount code? Enter it here."}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="remarks" className="block text-xs font-bold text-slate-700 mb-1.5">{t.registration.remarksLabel}</label>
                    <textarea
                      id="remarks"
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder={t.registration.remarksPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Acceptances (Terms & Privacy AVG) */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="space-y-3">
                  
                  {/* General Terms Agreement */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="chk-agree-terms"
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500 h-4 w-4 rounded-sm border-slate-300"
                    />
                    <span className="text-xs text-slate-600 select-none">
                      {language === "nl" ? (
                        <>
                          Ik ga akkoord met de{" "}
                          <button
                            id="btn-link-terms"
                            type="button"
                            onClick={() => setTermsOpen(true)}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            algemene voorwaarden
                          </button>{" "}
                          van Stichting Duurzaam AI. *
                        </>
                      ) : (
                        <>
                          I agree to the{" "}
                          <button
                            id="btn-link-terms-en"
                            type="button"
                            onClick={() => setTermsOpen(true)}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            general terms and conditions
                          </button>{" "}
                          of Stichting Duurzaam AI. *
                        </>
                      )}
                    </span>
                  </label>

                  {/* Privacy Statement Agreement */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="chk-agree-privacy"
                      type="checkbox"
                      required
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500 h-4 w-4 rounded-sm border-slate-300"
                    />
                    <span className="text-xs text-slate-600 select-none">
                      {language === "nl" ? (
                        <>
                          Ik heb de{" "}
                          <button
                            id="btn-link-privacy"
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            privacyverklaring
                          </button>{" "}
                          gelezen en ga akkoord met de verwerking van mijn gegevens voor deze inschrijving. *
                        </>
                      ) : (
                        <>
                          I have read the{" "}
                          <button
                            id="btn-link-privacy-en"
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            privacy policy
                          </button>{" "}
                          and consent to the processing of my data for this registration. *
                        </>
                      )}
                    </span>
                  </label>

                </div>
              </div>

              {/* SECTION 6: Submit */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400">
                  {language === "nl" ? "* Verplichte velden" : "* Required fields"}
                </p>
                <button
                  id="btn-form-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-200 disabled:text-slate-400 active:bg-emerald-500 transition-all duration-150 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">✦</span>
                      {t.registration.submitting}
                    </>
                  ) : (
                    <>
                      {t.registration.submitBtn}
                      <ChevronRight className="w-4.5 h-4.5 ml-2" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* Embedded Legal Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </section>
  );
};
