import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { RegistrationData } from "../types";
import { Download, Trash2, Search, Eye, Filter, RefreshCw, Database, ShieldAlert, Key } from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { language } = useLanguage();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null);
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const loadRegistrations = () => {
    const raw = localStorage.getItem("duurzaam_ai_registrations");
    if (raw) {
      setRegistrations(JSON.parse(raw));
    } else {
      // Seed initial dummy data for realistic reviewing!
      const initialSeed: RegistrationData[] = [
        {
          id: "REG-839402",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          firstName: "Marc",
          lastName: "de Graaf",
          email: "m.degraaf@it-infra.nl",
          phone: "0629481039",
          organization: "IT-Infra Solutions",
          functionName: "Senior Network Engineer",
          experience: "5–10 jaar",
          invoiceToOrganization: true,
          companyName: "IT-Infra Solutions BV",
          invoiceAddress: "InnoDrive 44",
          postalCodeCity: "3521 AC Utrecht",
          vatNumber: "NL882940284B01",
          billingEmail: "finance@it-infra.nl",
          discountCode: "EARLYBIRD2026",
          remarks: "Ik wil graag extra focussen op de security-aspecten van Copilot.",
          agreeTerms: true,
          agreePrivacy: true,
          language: "nl",
        },
        {
          id: "REG-124058",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          firstName: "Sarah",
          lastName: "Albers",
          email: "sarah.albers@techforge.io",
          phone: "0677492039",
          organization: "TechForge",
          functionName: "Junior Software Developer",
          experience: "0–2 jaar",
          invoiceToOrganization: false,
          remarks: "Heel benieuwd naar de prompting technieken voor code review!",
          agreeTerms: true,
          agreePrivacy: true,
          language: "nl",
        },
      ];
      localStorage.setItem("duurzaam_ai_registrations", JSON.stringify(initialSeed));
      setRegistrations(initialSeed);
    }
  };

  useEffect(() => {
    loadRegistrations();

    // Listen for custom submit events from the RegistrationForm
    const handleNewSub = () => {
      loadRegistrations();
    };

    window.addEventListener("new_registration_submitted", handleNewSub);
    return () => {
      window.removeEventListener("new_registration_submitted", handleNewSub);
    };
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "admin" || passcode === "1234") {
      setIsUnlocked(true);
      setError("");
    } else {
      setError(language === "nl" ? "Ongeldig wachtwoord (gebruik 'admin')" : "Invalid passcode (use 'admin')");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(language === "nl" ? "Weet je zeker dat je deze inschrijving wilt verwijderen?" : "Are you sure you want to delete this registration?")) {
      const updated = registrations.filter((r) => r.id !== id);
      localStorage.setItem("duurzaam_ai_registrations", JSON.stringify(updated));
      setRegistrations(updated);
      if (selectedReg?.id === id) {
        setSelectedReg(null);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `registrations_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Registration Date",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Organization",
      "Function",
      "Experience",
      "Invoice to Company",
      "Company Name",
      "Billing Email",
      "Invoice Address",
      "Postal Code & City",
      "VAT Number",
      "Discount Code",
      "Remarks",
    ];

    const rows = registrations.map((r) => [
      r.id,
      r.createdAt.slice(0, 10),
      r.firstName,
      r.lastName,
      r.email,
      r.phone || "",
      r.organization || "",
      r.functionName || "",
      r.experience,
      r.invoiceToOrganization ? "Yes" : "No",
      r.companyName || "",
      r.billingEmail || "",
      r.invoiceAddress || "",
      r.postalCodeCity || "",
      r.vatNumber || "",
      r.discountCode || "",
      r.remarks || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredRegistrations = registrations.filter((r) => {
    const nameMatch = `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = r.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = r.functionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = nameMatch || companyMatch || emailMatch || roleMatch;
    const matchesFilter = experienceFilter === "All" || r.experience === experienceFilter;

    return matchesSearch && matchesFilter;
  });

  if (!isOpen) {
    return (
      <div className="py-6 text-center bg-slate-900 border-t border-slate-800">
        <button
          id="btn-open-admin"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === "nl" ? "Open Beheerderspaneel (Admin)" : "Open Admin Portal"}</span>
        </button>
      </div>
    );
  }

  return (
    <section id="admin-panel" className="bg-slate-950 text-slate-300 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                {language === "nl" ? "Registratiebeheer (Stichting Duurzaam AI)" : "Enrollment Admin Panel"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === "nl"
                ? "Beheer en exporteer de binnengekomen aanmeldingen via beveiligde client-state."
                : "Inspect, filter, and extract received enrollments via local storage."}
            </p>
          </div>
          
          <button
            id="btn-close-admin"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-850 hover:text-white transition-colors"
          >
            {language === "nl" ? "Sluit Paneel" : "Close Portal"}
          </button>
        </div>

        {!isUnlocked ? (
          /* UNLOCK FORM */
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Key className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {language === "nl" ? "Beveiligde Toegang" : "Secure Authentication"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === "nl"
                  ? "Vul het wachtwoord in om de cursistengegevens in te zien. Gebruik: admin"
                  : "Enter the administrative passcode to access data. Use: admin"}
              </p>
            </div>

            <form onSubmit={handleUnlock} className="flex flex-col gap-3">
              <input
                id="admin-passcode-input"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Wachtwoord (admin)"
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm focus:outline-hidden text-center text-white font-mono"
              />
              {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
              <button
                id="btn-admin-login"
                type="submit"
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-sm transition-colors cursor-pointer"
              >
                {language === "nl" ? "Ontgrendelen" : "Unlock Data"}
              </button>
            </form>
          </div>
        ) : (
          /* REALTIME ADMIN BOARD */
          <div className="space-y-6">
            
            {/* Actions Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="admin-search-field"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === "nl" ? "Zoek op naam, e-mail of bedrijf..." : "Search name, email, company..."}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-hidden text-white"
                />
              </div>

              {/* Filter */}
              <div className="md:col-span-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <select
                  id="admin-filter-experience"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-hidden text-white"
                >
                  <option value="All">{language === "nl" ? "Alle Ervaring" : "All Experience"}</option>
                  <option value="0–2 jaar">0–2 jaar</option>
                  <option value="3–5 jaar">3–5 jaar</option>
                  <option value="5–10 jaar">5–10 jaar</option>
                  <option value="10+ jaar">10+ jaar</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="md:col-span-4 flex justify-end gap-2.5">
                <button
                  id="btn-admin-export-json"
                  onClick={handleExportJSON}
                  disabled={filteredRegistrations.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white disabled:opacity-50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  id="btn-admin-export-csv"
                  onClick={handleExportCSV}
                  disabled={filteredRegistrations.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white disabled:opacity-50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Main split dashboard (Left list, Right details) */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* Registrations List (7 Columns) */}
              <div className="lg:col-span-7 bg-slate-900/40 rounded-2xl border border-slate-800/85 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800/80 text-slate-400 font-bold">
                        <th className="p-4">{language === "nl" ? "Deelnemer" : "Participant"}</th>
                        <th className="p-4">{language === "nl" ? "Organisatie" : "Company"}</th>
                        <th className="p-4">{language === "nl" ? "Ervaring" : "IT Exp"}</th>
                        <th className="p-4 text-center">{language === "nl" ? "Acties" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                            {language === "nl" ? "Geen registraties gevonden." : "No registrations found."}
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <tr
                            key={reg.id}
                            onClick={() => setSelectedReg(reg)}
                            className={`hover:bg-slate-850 transition-colors cursor-pointer ${
                              selectedReg?.id === reg.id ? "bg-slate-800/80 text-white" : ""
                            }`}
                          >
                            <td className="p-4">
                              <p className="font-bold">{reg.firstName} {reg.lastName}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{reg.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{reg.organization}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{reg.functionName}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-sm font-semibold">
                                {reg.experience}
                              </span>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  id={`btn-admin-view-${reg.id}`}
                                  onClick={() => setSelectedReg(reg)}
                                  className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white transition-colors"
                                  title="Inzien"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  id={`btn-admin-del-${reg.id}`}
                                  onClick={() => handleDelete(reg.id)}
                                  className="p-1.5 rounded-lg bg-red-950/45 text-red-400 hover:text-red-200 hover:bg-red-900/65 transition-colors"
                                  title="Verwijderen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Registration Detailed View (5 Columns) */}
              <div className="lg:col-span-5">
                {selectedReg ? (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-left text-xs">
                    
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                          {selectedReg.id}
                        </span>
                        <h3 className="text-sm font-black text-white mt-2">
                          {selectedReg.firstName} {selectedReg.lastName}
                        </h3>
                        <p className="text-[10px] text-slate-500">{selectedReg.functionName} @ {selectedReg.organization}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {selectedReg.createdAt.slice(0, 10)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Contact specifications */}
                      <div>
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact</h4>
                        <p><span className="text-slate-500">Email:</span> <span className="font-mono text-white select-all">{selectedReg.email}</span></p>
                        {selectedReg.phone && (
                          <p className="mt-1"><span className="text-slate-500">Phone:</span> <span className="font-mono text-white">{selectedReg.phone}</span></p>
                        )}
                      </div>

                      {/* Experience */}
                      <div>
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">IT Experience</h4>
                        <p className="text-white font-medium">{selectedReg.experience}</p>
                      </div>

                      {/* Invoicing details */}
                      <div>
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5">Invoicing</h4>
                        <p><span className="text-slate-500">Company Billing:</span> <span className="font-bold text-white">{selectedReg.invoiceToOrganization ? "Yes" : "No"}</span></p>
                        {selectedReg.invoiceToOrganization && (
                          <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                            <p><span className="text-slate-500">Company:</span> <span className="text-white">{selectedReg.companyName}</span></p>
                            <p><span className="text-slate-500">Billing Email:</span> <span className="font-mono text-white select-all">{selectedReg.billingEmail || selectedReg.email}</span></p>
                            <p><span className="text-slate-500">Address:</span> <span className="text-white">{selectedReg.invoiceAddress}</span></p>
                            <p><span className="text-slate-500">City:</span> <span className="text-white">{selectedReg.postalCodeCity}</span></p>
                            {selectedReg.vatNumber && (
                              <p><span className="text-slate-500">VAT:</span> <span className="font-mono text-white">{selectedReg.vatNumber}</span></p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Discount Code */}
                      {selectedReg.discountCode && (
                        <div>
                          <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Discount Code</h4>
                          <p className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/35 px-2.5 py-1 rounded-sm border border-emerald-900/40 inline-block uppercase">
                            {selectedReg.discountCode}
                          </p>
                        </div>
                      )}

                      {/* Remarks */}
                      {selectedReg.remarks && (
                        <div>
                          <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Remarks & Questions</h4>
                          <p className="text-slate-300 italic bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed font-light">
                            "{selectedReg.remarks}"
                          </p>
                        </div>
                      )}

                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        id="btn-admin-close-details"
                        onClick={() => setSelectedReg(null)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-white hover:bg-slate-850 text-[11px] font-semibold transition-colors"
                      >
                        {language === "nl" ? "Sluit Details" : "Close Details"}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 italic text-xs h-full flex flex-col items-center justify-center space-y-2">
                    <ShieldAlert className="w-5 h-5 text-slate-700" />
                    <span>{language === "nl" ? "Selecteer een cursist om alle gegevens te tonen." : "Select a student to view complete profile."}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
