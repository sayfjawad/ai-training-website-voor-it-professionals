import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X, Calendar, MapPin, Award } from "lucide-react";

export const Header: React.FC = () => {
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#intro", label: language === "nl" ? "Over de training" : "About the Course" },
    { href: "#objectives", label: language === "nl" ? "Leerdoelen" : "Learning Objectives" },
    { href: "#audience", label: language === "nl" ? "Voor wie?" : "Target Audience" },
    { href: "#program", label: language === "nl" ? "Programma" : "Agenda" },
    { href: "#practical", label: language === "nl" ? "Praktisch" : "Practical Info" },
    { href: "#trainer", label: language === "nl" ? "Trainer" : "Trainer" },
    { href: "#faq", label: language === "nl" ? "FAQ" : "FAQ" },
    { href: "#statistieken", label: language === "nl" ? "Statistieken" : "Statistics" },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top bar for Language Switcher */}
      <div className="bg-slate-50/80 border-b border-slate-100/50 py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a id="lnk-header-logo" href="#" className="flex-shrink-0 transition-opacity hover:opacity-90">
            <Logo showTagline={true} />
          </a>

          {/* Desktop Nav */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                id={`lnk-nav-${link.href.replace("#", "")}`}
                href={link.href}
                className="px-3 py-2 rounded-lg text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA only on desktop */}
          <div className="hidden lg:flex items-center">
            <a
              id="lnk-header-cta"
              href="#register"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              {t.hero.ctaPrimary}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={language === "nl" ? "Hoofdmenu openen" : "Open main menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                id={`lnk-nav-mob-${link.href.replace("#", "")}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 px-4">
              <a
                id="lnk-header-cta-mob"
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center inline-flex items-center justify-center px-5 py-3 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                {t.hero.ctaPrimary}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
