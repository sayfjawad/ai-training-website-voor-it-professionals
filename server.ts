import express from "express";
import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const TRAINING_CAPACITY = 10;
const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const GOATCOUNTER_DB = process.env.GOATCOUNTER_DB || "/home/sayf/goatcounter/db/goatcounter.sqlite3";
const GOATCOUNTER_SITE_HOOFDWEBSITE = 1;
const GOATCOUNTER_SITE_TRAINING = 2;
const STATS_ALLOWED_ORIGINS = new Set([
  "https://stichtingduurzaamai.nl",
  "https://www.stichtingduurzaamai.nl",
  "https://training.stichtingduurzaamai.nl",
]);

interface StoredRegistration {
  id: string;
  createdAt: string;
  experience: string;
  invoiceToOrganization: boolean;
  language: "nl" | "en";
  hasDiscountCode: boolean;
}

function loadRegistrations(): StoredRegistration[] {
  try {
    return JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function storeRegistration(reg: any) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const registrations = loadRegistrations();
  registrations.push({
    id: reg.id,
    createdAt: reg.createdAt,
    experience: reg.experience,
    invoiceToOrganization: !!reg.invoiceToOrganization,
    language: reg.language === "en" ? "en" : "nl",
    hasDiscountCode: !!reg.discountCode,
  });
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
}

function getRegistrationStats() {
  const registrations = loadRegistrations();
  const total = registrations.length;

  const experienceBreakdown: Record<string, number> = {};
  let invoiceToOrganizationCount = 0;
  for (const r of registrations) {
    experienceBreakdown[r.experience] = (experienceBreakdown[r.experience] || 0) + 1;
    if (r.invoiceToOrganization) invoiceToOrganizationCount++;
  }

  return {
    total,
    capacity: TRAINING_CAPACITY,
    seatsRemaining: Math.max(0, TRAINING_CAPACITY - total),
    experienceBreakdown,
    invoiceToOrganizationCount,
  };
}

function getGoatCounterPageviews(siteId: number): { pageviews: number; visits: number } {
  try {
    const query = `select coalesce(sum(total),0) as pageviews from hit_counts where site_id = ${siteId};`;
    const pvOut = execFileSync("sqlite3", ["-json", "-readonly", GOATCOUNTER_DB, query], { encoding: "utf-8" });
    const pageviews = JSON.parse(pvOut)[0]?.pageviews ?? 0;

    const visitQuery = `select count(*) as visits from hits where site_id = ${siteId} and first_visit = 1;`;
    const visitOut = execFileSync("sqlite3", ["-json", "-readonly", GOATCOUNTER_DB, visitQuery], { encoding: "utf-8" });
    const visits = JSON.parse(visitOut)[0]?.visits ?? 0;

    return { pageviews, visits };
  } catch (err) {
    console.error("[API] Failed to read GoatCounter stats:", err);
    return { pageviews: 0, visits: 0 };
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Route for Course Registration & Emailing
  app.post("/api/register", async (req, res) => {
    try {
      const reg = req.body;
      
      console.log(`[API] Received registration for ${reg.firstName} ${reg.lastName} (${reg.email})`);

      try {
        storeRegistration(reg);
      } catch (err) {
        console.error("[API] Failed to persist registration for stats:", err);
      }

      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn("[API] SMTP credentials not fully configured in environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping actual email dispatch. Registration is logged successfully.");
        return res.status(200).json({
          success: true,
          message: "Registration received! (SMTP credentials missing on server, email delivery was simulated).",
          id: reg.id
        });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465", // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Create custom HTML table for registration
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #059669; border-bottom: 2px solid #34d399; padding-bottom: 10px; margin-top: 0;">Nieuwe Inschrijving Cursus</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Er is een nieuwe inschrijving binnengekomen voor de cursus van <strong>Stichting Duurzaam AI</strong>. Hieronder vindt u de details van de cursist:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; width: 180px; border-bottom: 1px solid #e2e8f0;">ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${reg.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Voornaam:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.firstName}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Achternaam:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">E-mailadres:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${reg.email}">${reg.email}</a></td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Telefoonnummer:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.phone || "Niet ingevuld"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Organisatie / Bedrijf:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.organization}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Functie:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.functionName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">IT Ervaring:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.experience}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Factuur naar bedrijf:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.invoiceToOrganization ? "Ja" : "Nee"}</td>
            </tr>
            
            ${reg.invoiceToOrganization ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Bedrijfsnaam Factuur:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.companyName || ""}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Facturatie E-mailadres:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${reg.billingEmail}">${reg.billingEmail || ""}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Factuuradres:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.invoiceAddress || ""}</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Postcode & Plaats:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.postalCodeCity || ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">BTW-nummer:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${reg.vatNumber || "Niet opgegeven"}</td>
            </tr>
            ` : ""}

            ${reg.discountCode ? `
            <tr style="background-color: #ecfdf5;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0; color: #065f46;">Kortingscode:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #065f46; text-transform: uppercase;">${reg.discountCode}</td>
            </tr>
            ` : ""}
          </table>

          ${reg.remarks ? `
            <div style="margin-top: 20px; padding: 12px; border-left: 4px solid #10b981; background-color: #f0fdf4; font-style: italic; font-size: 13px;">
              <strong>Opmerkingen / Vragen:</strong><br/>
              "${reg.remarks}"
            </div>
          ` : ""}

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Verstuurd via de website van Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("nl-NL")}
          </div>
        </div>
      `;

      // Plain text version for safety
      const textContent = `
Nieuwe Inschrijving Cursus - Stichting Duurzaam AI
===================================================

Deelnemer Details:
-----------------
ID: ${reg.id}
Datum: ${new Date(reg.createdAt).toLocaleString("nl-NL")}
Voornaam: ${reg.firstName}
Achternaam: ${reg.lastName}
E-mailadres: ${reg.email}
Telefoonnummer: ${reg.phone || "Niet ingevuld"}
Organisatie/Bedrijf: ${reg.organization}
Functie: ${reg.functionName}
IT Ervaring: ${reg.experience}

Facturatie:
-----------
Factuur naar bedrijf: ${reg.invoiceToOrganization ? "Ja" : "Nee"}
${reg.invoiceToOrganization ? `Bedrijfsnaam Factuur: ${reg.companyName || ""}
Facturatie E-mailadres: ${reg.billingEmail || ""}
Factuuradres: ${reg.invoiceAddress || ""}
Postcode & Plaats: ${reg.postalCodeCity || ""}
BTW-nummer: ${reg.vatNumber || "Niet opgegeven"}` : ""}

Kortingscode:
-------------
Kortingscode: ${reg.discountCode || "Geen"}

Opmerkingen/Vragen:
-------------------
${reg.remarks || "Geen"}
      `;

      const recipient = "info@stichtingduurzaamai.nl";
      const isDutch = reg.language !== "en";

      const traineeSubject = isDutch
        ? "Bevestiging van je inschrijving - Training AI voor IT-professionals"
        : "Registration confirmation - AI for IT Professionals training";

      const traineeHtml = isDutch ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #059669; border-bottom: 2px solid #34d399; padding-bottom: 10px; margin-top: 0;">Beste ${reg.firstName},</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Hartelijk dank voor je reservering voor onze training <strong>AI voor IT-professionals</strong>.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Wij hebben je reservering in goede orde ontvangen.
          </p>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">Trainingsgegevens</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0;">Referentie:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${reg.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Training:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">AI voor IT-professionals</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Datum:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Zaterdag 26 september 2026</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Tijd:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">09:00 – 17:00 uur</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Locatie:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Noordenweg 24, Ridderkerk</td>
            </tr>
          </table>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">Wat gebeurt er nu?</h3>
          <div style="padding: 12px; border-left: 4px solid #10b981; background-color: #f0fdf4; font-size: 13px; line-height: 1.6; color: #1e293b;">
            <p style="margin: 0 0 10px;">Binnen 2 werkdagen ontvang je van ons een factuur voor de deelname aan de training.</p>
            <p style="margin: 0;">Je reservering wordt definitief zodra wij de betaling hebben ontvangen. Na ontvangst van de betaling sturen wij je een definitieve bevestiging van je inschrijving.</p>
          </div>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">Vragen?</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            Heb je in de tussentijd vragen? Neem gerust contact met ons op via
            <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>

          <p style="font-size: 14px; line-height: 1.5; color: #475569; margin-top: 20px;">
            Wij kijken ernaar uit je te verwelkomen tijdens de training.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Met vriendelijke groet,<br/>
            Stichting Duurzaam AI
          </p>

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("nl-NL")}
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #059669; border-bottom: 2px solid #34d399; padding-bottom: 10px; margin-top: 0;">Dear ${reg.firstName},</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Thank you for your reservation for our <strong>AI for IT Professionals</strong> training.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            We have successfully received your reservation.
          </p>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">Training details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0;">Reference:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${reg.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Training:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">AI for IT Professionals</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Saturday, September 26, 2026</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">09:00 AM – 05:00 PM</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Location:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Noordenweg 24, Ridderkerk (NL)</td>
            </tr>
          </table>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">What happens next?</h3>
          <div style="padding: 12px; border-left: 4px solid #10b981; background-color: #f0fdf4; font-size: 13px; line-height: 1.6; color: #1e293b;">
            <p style="margin: 0 0 10px;">Within 2 business days you will receive an invoice from us for your participation in the training.</p>
            <p style="margin: 0;">Your reservation becomes final once we have received payment. After receiving payment, we will send you a final confirmation of your registration.</p>
          </div>

          <h3 style="color: #059669; font-size: 15px; margin: 24px 0 8px;">Questions?</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            If you have any questions in the meantime, feel free to contact us via
            <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>

          <p style="font-size: 14px; line-height: 1.5; color: #475569; margin-top: 20px;">
            We look forward to welcoming you at the training.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Kind regards,<br/>
            Stichting Duurzaam AI
          </p>

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("en-US")}
          </div>
        </div>
      `;

      const traineeText = isDutch ? `
Beste ${reg.firstName},

Hartelijk dank voor je reservering voor onze training AI voor IT-professionals.

Wij hebben je reservering in goede orde ontvangen.

Trainingsgegevens
-----------------
Referentie: ${reg.id}
Training: AI voor IT-professionals
Datum: Zaterdag 26 september 2026
Tijd: 09:00 – 17:00 uur
Locatie: Noordenweg 24, Ridderkerk

Wat gebeurt er nu?
------------------
Binnen 2 werkdagen ontvang je van ons een factuur voor de deelname aan de training.

Je reservering wordt definitief zodra wij de betaling hebben ontvangen. Na ontvangst van de betaling sturen wij je een definitieve bevestiging van je inschrijving.

Vragen?
-------
Heb je in de tussentijd vragen? Neem gerust contact met ons op via info@stichtingduurzaamai.nl.

Wij kijken ernaar uit je te verwelkomen tijdens de training.

Met vriendelijke groet,
Stichting Duurzaam AI
      ` : `
Dear ${reg.firstName},

Thank you for your reservation for our AI for IT Professionals training.

We have successfully received your reservation.

Training details
----------------
Reference: ${reg.id}
Training: AI for IT Professionals
Date: Saturday, September 26, 2026
Time: 09:00 AM – 05:00 PM
Location: Noordenweg 24, Ridderkerk (NL)

What happens next?
-------------------
Within 2 business days you will receive an invoice from us for your participation in the training.

Your reservation becomes final once we have received payment. After receiving payment, we will send you a final confirmation of your registration.

Questions?
----------
If you have any questions in the meantime, feel free to contact us via info@stichtingduurzaamai.nl.

We look forward to welcoming you at the training.

Kind regards,
Stichting Duurzaam AI

Stichting Duurzaam AI
      `;

      const [orgResult, traineeResult] = await Promise.allSettled([
        transporter.sendMail({
          from: `"${reg.firstName} ${reg.lastName} via Duurzaam AI" <${smtpUser}>`,
          to: recipient,
          subject: `Nieuwe aanmelding: ${reg.firstName} ${reg.lastName} (${reg.organization})`,
          text: textContent,
          html: htmlContent,
          replyTo: reg.email,
        }),
        transporter.sendMail({
          from: `"Stichting Duurzaam AI" <${smtpUser}>`,
          to: reg.email,
          subject: traineeSubject,
          text: traineeText,
          html: traineeHtml,
          replyTo: recipient,
        }),
      ]);

      if (orgResult.status === "rejected") {
        console.error("[API] Error sending organization notification email:", orgResult.reason);
      } else {
        console.log(`[API] Registration email successfully sent to ${recipient}`);
      }

      if (traineeResult.status === "rejected") {
        console.error("[API] Error sending trainee confirmation email:", traineeResult.reason);
      } else {
        console.log(`[API] Confirmation email successfully sent to ${reg.email}`);
      }

      if (orgResult.status === "rejected" && traineeResult.status === "rejected") {
        return res.status(500).json({
          success: false,
          error: "Kon inschrijving niet verzenden per e-mail.",
        });
      }

      return res.status(200).json({ success: true, message: "Email sent successfully!", id: reg.id });

    } catch (error: any) {
      console.error("[API] Error sending email:", error);
      return res.status(500).json({
        success: false,
        error: "Kon inschrijving niet verzenden per e-mail.",
        details: error.message
      });
    }
  });

  // Public, read-only stats endpoint (no PII) combining registration and traffic data
  app.get("/api/stats", (req, res) => {
    const origin = req.headers.origin;
    if (origin && STATS_ALLOWED_ORIGINS.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    const registrations = getRegistrationStats();
    const hoofdwebsite = getGoatCounterPageviews(GOATCOUNTER_SITE_HOOFDWEBSITE);
    const training = getGoatCounterPageviews(GOATCOUNTER_SITE_TRAINING);

    return res.status(200).json({
      registrations,
      traffic: {
        hoofdwebsite,
        training,
      },
      generatedAt: new Date().toISOString(),
    });
  });

  // Vite middleware for development or serving build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
