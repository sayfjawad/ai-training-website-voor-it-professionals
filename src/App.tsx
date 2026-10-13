/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Introduction } from "./components/Introduction";
import { Objectives } from "./components/Objectives";
import { TargetAudience } from "./components/TargetAudience";
import { Program } from "./components/Program";
import { Trainer } from "./components/Trainer";
import { PreRegistrationForm } from "./components/PreRegistrationForm";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <LanguageProvider>
      <div id="landing-page-root" className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between">
        
        {/* Navigation Header */}
        <Header />

        {/* Content Body Sections */}
        <main id="app-main-content" className="flex-grow">
          {/* Hero Section */}
          <Hero />

          {/* Intro Section */}
          <Introduction />

          {/* Learning Objectives */}
          <Objectives />

          {/* Target Audience */}
          <TargetAudience />

          {/* What this session covers */}
          <Program />

          {/* Speaker & foundation */}
          <Trainer />

          {/* Pre-registration form → Tikkie payment link via email */}
          <PreRegistrationForm />
        </main>

        {/* Brand Information & Direct Contact Footer */}
        <Footer />
        
      </div>
    </LanguageProvider>
  );
}
