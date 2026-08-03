import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PrivacyModal, TermsModal } from "./LegalModals";
import { Mail, MapPin, ExternalLink, Calendar } from "lucide-react";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Column 1: Organization brand (6 Columns) */}
          <div className="md:col-span-6 space-y-6 text-left">
            <Logo className="text-white invert filter brightness-200" showTagline={true} />
            <p className="text-sm text-slate-400 font-light max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex gap-2">
              <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs px-3 py-1 rounded-md border border-emerald-500/20 font-semibold italic">
                {language === "nl" ? "Duurzaam gebruik van AI. Voor een betere toekomst." : "Sustainable use of AI. For a better future."}
              </span>
            </div>
          </div>

          {/* Column 2: Legal / Links (3 Columns) */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
              {language === "nl" ? "Informatie" : "Information"}
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm">
              <button
                id="btn-footer-terms"
                onClick={() => setTermsOpen(true)}
                className="text-left text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.footer.terms}</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </button>
              <button
                id="btn-footer-privacy"
                onClick={() => setPrivacyOpen(true)}
                className="text-left text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.footer.privacy}</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </button>
              <a
                id="lnk-footer-website"
                href="https://www.stichtingduurzaamai.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <span>www.stichtingduurzaamai.nl</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </div>
          </div>

          {/* Column 3: Contact Info (3 Columns) */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
              {t.footer.contact}
            </h4>
            <div className="flex flex-col space-y-3.5 text-sm font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 leading-snug">
                  Noordenweg 24<br />
                  2984 AG Ridderkerk
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  id="lnk-footer-email"
                  href="mailto:info@stichtingduurzaamai.nl"
                  className="text-slate-400 hover:text-white hover:underline font-mono text-[13px]"
                >
                  info@stichtingduurzaamai.nl
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="bg-slate-950 py-6 border-t border-slate-850/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            {t.footer.rights}
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="font-mono text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-sm">
              v1.0.0 (Production)
            </span>
          </div>
        </div>
      </div>

      {/* Legal Modals Handles */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </footer>
  );
};
