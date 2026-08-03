import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      
      {/* Background Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      {/* Modal Window */}
      <div className="relative bg-white rounded-3xl text-left shadow-xl transform transition-all max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 z-10">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200/60 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-900 font-sans" id="modal-title">
            {language === "nl" ? "Privacyverklaring (AVG)" : "Privacy Statement (GDPR)"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Sluit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-6 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-6 flex-grow">
            {language === "nl" ? (
              <>
                <p className="font-semibold text-slate-800">Basisversie - Stichting Duurzaam AI</p>

                <div>
                  <h4 className="font-bold text-slate-900">Welke gegevens verwerken wij?</h4>
                  <p className="mt-1">Bij inschrijving voor een training kunnen wij de volgende gegevens verwerken:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Naam (voor- en achternaam);</li>
                    <li>E-mailadres;</li>
                    <li>Telefoonnummer;</li>
                    <li>Organisatie;</li>
                    <li>Functie;</li>
                    <li>Factuurgegevens;</li>
                    <li>Dieetwensen of praktische opmerkingen.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Waarom verwerken wij deze gegevens?</h4>
                  <p className="mt-1">Wij gebruiken deze gegevens uitsluitend voor de volgende doeleinden:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Registratie en administratieve verwerking van deelnemers;</li>
                    <li>Communicatie en praktische afstemming rondom de training;</li>
                    <li>Boekhouding en facturatie;</li>
                    <li>Organisatie van de trainingsdag (zoals cateringbeheer via dieetwensen).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Hoe beschermen wij gegevens?</h4>
                  <p className="mt-1">
                    Stichting Duurzaam AI neemt passende technische en organisatorische maatregelen om persoonsgegevens te beveiligen tegen verlies, onbevoegde toegang, wijziging of misbruik. Wij maken uitsluitend gebruik van beveiligde verbindingen en versleutelde gegevensopslag.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Bewaartermijn</h4>
                  <p className="mt-1">
                    Wij bewaren persoonsgegevens niet langer dan strikt noodzakelijk is voor de doeleinden waarvoor deze zijn verzameld, tenzij wettelijke verplichtingen (zoals de fiscale bewaarplicht van 7 jaar voor administratieve gegevens) een langere bewaartermijn vereisen.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Jouw rechten</h4>
                  <p className="mt-1">Volgens de AVG heb je wettelijke rechten met betrekking tot jouw persoonsgegevens:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Inzage:</strong> Je kunt opvragen welke gegevens we van je hebben;</li>
                    <li><strong>Correctie:</strong> Je kunt onjuiste gegevens laten aanpassen;</li>
                    <li><strong>Verwijdering:</strong> Je kunt verzoeken om verwijdering van je persoonsgegevens;</li>
                    <li><strong>Bezwaar:</strong> Je kunt bezwaar maken tegen bepaalde verwerkingen.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Contact & Vragen</h4>
                  <p className="mt-1">
                    Heb je vragen over ons privacybeleid, jouw rechten, of deze voorwaarden? Neem gerust contact met ons op via: <strong className="text-emerald-600">info@stichtingduurzaamai.nl</strong>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">Standard Version - Sustainable AI Foundation</p>

                <div>
                  <h4 className="font-bold text-slate-900">What data do we process?</h4>
                  <p className="mt-1">Upon registering for a training course, we may process the following data:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Full Name (first and last name);</li>
                    <li>Email Address;</li>
                    <li>Phone Number;</li>
                    <li>Organization / Employer;</li>
                    <li>Job Title / Function;</li>
                    <li>Billing and invoicing details;</li>
                    <li>Dietary requirements or general remarks.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Why do we process this data?</h4>
                  <p className="mt-1">We use this data exclusively for the following purposes:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Registration and administrative management of participants;</li>
                    <li>Communication and logistical coordination regarding the training course;</li>
                    <li>Accounting and professional invoicing;</li>
                    <li>Day-of organization (such as catering coordination via dietary preferences).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">How do we secure your data?</h4>
                  <p className="mt-1">
                    Stichting Duurzaam AI implements suitable technical and organizational structures to safeguard personal data against loss, unapproved access, modifications, or abuse. We employ exclusively secure HTTPS connections and encrypted databases.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Retention Period</h4>
                  <p className="mt-1">
                    We preserve personal data no longer than strictly necessary to fulfill the goals for which they were gathered, unless statutory legal regulations (such as the standard 7-year fiscal bookkeeping directive for invoices) mandate a longer retention.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Your Rights</h4>
                  <p className="mt-1">In compliance with GDPR laws, you hold the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Access:</strong> Review what records we keep of your profile;</li>
                    <li><strong>Correction:</strong> Instruct us to modify inaccurate elements;</li>
                    <li><strong>Erasure:</strong> Instruct us to delete your personal records;</li>
                    <li><strong>Objection:</strong> Opine or object against specific data uses.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">Contact & Enquiries</h4>
                  <p className="mt-1">
                    If you have any questions regarding privacy, your legal rights, or these conditions, please contact us at: <strong className="text-emerald-600">info@stichtingduurzaamai.nl</strong>.
                  </p>
                </div>
              </>
            )}
          </div>

        {/* Footer Action */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/60 flex justify-end flex-shrink-0">
          <button
            id="btn-privacy-modal-close"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {language === "nl" ? "Sluiten" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      
      {/* Background Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" aria-hidden="true" />

      {/* Modal Window */}
      <div className="relative bg-white rounded-3xl text-left shadow-xl transform transition-all max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 z-10">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200/60 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-900 font-sans" id="modal-title">
            {language === "nl" ? "Algemene Voorwaarden Trainingen" : "General Terms & Conditions"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Sluit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-6 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-6 flex-grow">
            {language === "nl" ? (
              <>
                <p className="font-semibold text-slate-800">Volledige Versie - Stichting Duurzaam AI</p>

                <div>
                  <h4 className="font-bold text-slate-900">1. Organisatie</h4>
                  <p className="mt-1">
                    Deze algemene voorwaarden zijn van toepassing op alle trainingen en workshops die worden georganiseerd door:
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">Stichting Duurzaam AI</p>
                  <p className="text-xs text-slate-500">
                    E-mailadres: info@stichtingduurzaamai.nl
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">2. Inschrijving</h4>
                  <p className="mt-1">
                    Een inschrijving voor de training wordt definitief en bindend nadat:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Het online inschrijfformulier volledig en naar waarheid is ingevuld;</li>
                    <li>De deelnemer een automatische of handmatige bevestiging per e-mail heeft ontvangen;</li>
                    <li>De betaling is voldaan of de facturatie door onze administratie is verwerkt.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">3. Deelnamekosten</h4>
                  <p className="mt-1">
                    De deelnamekosten staan vermeld op de trainingspagina.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">4. Betaling</h4>
                  <p className="mt-1">
                    Betaling vindt plaats nadat de factuur per e-mail aan de deelnemer of diens organisatie is verzonden. De betalingstermijn staat expliciet vermeld op de factuur (standaard binnen 7 dagen).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">5. Annulering door deelnemer</h4>
                  <p className="mt-1">Annulering dient schriftelijk te geschieden via e-mail aan Stichting Duurzaam AI. Hierbij gelden de volgende voorwaarden:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Tot 14 kalenderdagen vóór de trainingsdatum:</strong> Volledig kosteloos annuleren;</li>
                    <li><strong>Binnen 14 kalenderdagen vóór de trainingsdatum:</strong> 50% van het deelnamebedrag wordt in rekening gebracht;</li>
                    <li><strong>Binnen 7 kalenderdagen vóór de trainingsdatum of bij niet verschijnen (no-show):</strong> Het volledige deelnamebedrag (100%) blijft verschuldigd.</li>
                    <li><strong>Vervanging:</strong> Indien je verhinderd bent, mag je te allen tijde kosteloos een vervangende deelnemer aanwijzen. Meld dit uiterlijk één werkdag voor aanvang per e-mail aan ons.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">6. Annulering of wijziging door Stichting Duurzaam AI</h4>
                  <p className="mt-1">Stichting Duurzaam AI behoudt zich het recht voor om:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>De trainingsdatum of -locatie aan te passen;</li>
                    <li>De training te annuleren of uit te stellen bij overmacht of onvoldoende deelnemers.</li>
                  </ul>
                  <p className="mt-2">
                    Indien de training door overmacht wordt geannuleerd, stellen we je direct op de hoogte en storten we het reeds betaalde deelnamebedrag onverwijld en volledig terug. Stichting Duurzaam AI is niet aansprakelijk voor indirecte schade of bijkomende gemaakte kosten (zoals reis- of verblijfskosten).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">7. Inhoud van de training</h4>
                  <p className="mt-1">
                    De training is gericht op het vergroten van praktische vaardigheden rondom AI binnen IT. Stichting Duurzaam AI streeft naar actuele informatie, maar kan de permanente beschikbaarheid van specifieke AI-tools niet garanderen wegens snelle technologische evoluties.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">8. Intellectueel Eigendom</h4>
                  <p className="mt-1">
                    Alle tijdens de training verstrekte presentaties, oefeningen en overige materialen zijn auteursrechtelijk beschermd en uitsluitend bestemd voor persoonlijk gebruik door de deelnemer. Het is ten strengste verboden deze materialen te kopiëren, verspreiden of te exploiteren voor commerciële of concurrerende doeleinden zonder uitdrukkelijke schriftelijke toestemming.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">9. Aansprakelijkheid</h4>
                  <p className="mt-1">
                    Stichting Duurzaam AI besteedt uiterste zorg aan de inhoud en uitvoering. De deelnemer blijft echter te allen tijde zelf verantwoordelijk voor de concrete toepassing van de opgedane kennis binnen diens eigen werkomgeving of organisatie.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">Complete Version - Sustainable AI Foundation</p>

                <div>
                  <h4 className="font-bold text-slate-900">1. Organization</h4>
                  <p className="mt-1">
                    These general terms and conditions govern all educational courses and seminars organized by:
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">Stichting Duurzaam AI (Sustainable AI Foundation)</p>
                  <p className="text-xs text-slate-500">
                    Email Enquiries: info@stichtingduurzaamai.nl
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">2. Registration</h4>
                  <p className="mt-1">
                    An enrollment for a course becomes legally binding and final once:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>The online registration form is filled in completely and truthfully;</li>
                    <li>The applicant receives an automated or manual confirmation via email;</li>
                    <li>Full payment is completed or invoicing has been logged by our finance department.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">3. Tuition & Catering Fees</h4>
                  <p className="mt-1">
                    The registration fee is designated on the course portal.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">4. Payment Terms</h4>
                  <p className="mt-1">
                    Payment takes place after the invoice is sent by email to the participant or their organization. The payment term is explicitly stated on the invoice (standard within 7 days).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">5. Cancellation by Participant</h4>
                  <p className="mt-1">Cancellations must be filed in writing via email to Stichting Duurzaam AI. The following structures apply:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Up to 14 calendar days prior to the course date:</strong> Free of charge cancellation;</li>
                    <li><strong>Within 14 calendar days prior to the course date:</strong> A 50% cancellation fee is billed;</li>
                    <li><strong>Within 7 calendar days prior to the course date or no-show:</strong> Full 100% tuition is due.</li>
                    <li><strong>Replacements:</strong> If you cannot attend, you may assign a colleague to take your slot for free. Notify us via email at least one business day before the course.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">6. Postponement or Cancellation by Foundation</h4>
                  <p className="mt-1">Stichting Duurzaam AI preserves the right to:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Reschedule the course date or venue;</li>
                    <li>Cancel or delay the course due to force majeure or insufficient applicants.</li>
                  </ul>
                  <p className="mt-2">
                    If we cancel a course, we will notify you immediately and return your paid registration fee in full. Stichting Duurzaam AI is not liable for secondary damages or external expenses (such as travel or lodging costs).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">7. Course Content</h4>
                  <p className="mt-1">
                    The course aims to build real, practical skills on AI inside IT. Stichting Duurzaam AI guarantees up-to-date curricula, but cannot guarantee permanent API access to third-party tools due to high pace technical developments.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">8. Intellectual Property</h4>
                  <p className="mt-1">
                    All handouts, exercises, slides, and files provided during the course are proprietary and copyrighted. They are solely for personal use. Copying, republishing, or distributing them for commercial or educational competition is strictly prohibited.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">9. Liability Limit</h4>
                  <p className="mt-1">
                    Stichting Duurzaam AI carries out training with professional rigor. However, the participant remains solely responsible for the technical application of the knowledge inside their corporate systems.
                  </p>
                </div>
              </>
            )}
          </div>

        {/* Footer Action */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/60 flex justify-end flex-shrink-0">
          <button
            id="btn-terms-modal-close"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {language === "nl" ? "Sluiten" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
