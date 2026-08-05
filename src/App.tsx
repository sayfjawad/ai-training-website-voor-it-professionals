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
import { PracticalInfo } from "./components/PracticalInfo";
import { Trainer } from "./components/Trainer";
import { Faq } from "./components/Faq";
import { StatsSection } from "./components/StatsSection";
import { RegistrationForm } from "./components/RegistrationForm";
import { AdminPanel } from "./components/AdminPanel";
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

          {/* Program Timeline */}
          <Program />

          {/* Practical Info Specs */}
          <PracticalInfo />

          {/* Trainer and Academy Details */}
          <Trainer />

          {/* Frequently Asked Questions */}
          <Faq />

          {/* Live Statistics */}
          <StatsSection />

          {/* Action-Driving Registration Form */}
          <RegistrationForm />
        </main>

        {/* Real-time Administrative Registrations Reviewer (Export JSON/CSV) */}
        <AdminPanel />

        {/* Brand Information & Direct Contact Footer */}
        <Footer />
        
      </div>
    </LanguageProvider>
  );
}
