import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Route for Course Registration & Emailing
  app.post("/api/register", async (req, res) => {
    try {
      const reg = req.body;
      
      console.log(`[API] Received registration for ${reg.firstName} ${reg.lastName} (${reg.email})`);

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
          <h2 style="color: #059669; border-bottom: 2px solid #34d399; padding-bottom: 10px; margin-top: 0;">Bedankt voor je inschrijving, ${reg.firstName}!</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Je plaats voor de training <strong>"AI voor IT-professionals"</strong> is gereserveerd. Hieronder de belangrijkste gegevens:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0;">Referentie:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${reg.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Datum:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Zaterdag 26 september 2026</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Tijd:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">09:00 - 17:00 uur (inloop vanaf 08:45 uur)</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Locatie:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Noordenweg 24, Ridderkerk</td>
            </tr>
          </table>
          <p style="font-size: 13px; line-height: 1.5; color: #475569; margin-top: 20px;">
            Je ontvangt op een later moment nog exacte zaal- en route-informatie. Heb je vragen? Neem gerust contact op via
            <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("nl-NL")}
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #059669; border-bottom: 2px solid #34d399; padding-bottom: 10px; margin-top: 0;">Thank you for registering, ${reg.firstName}!</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Your seat for the <strong>"AI for IT Professionals"</strong> training has been reserved. Here are the key details:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0;">Reference:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${reg.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Saturday, September 26, 2026</td>
            </tr>
            <tr style="background-color: #f1f5f9;">
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">09:00 AM - 05:00 PM (doors open at 08:45 AM)</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Location:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Noordenweg 24, Ridderkerk (NL)</td>
            </tr>
          </table>
          <p style="font-size: 13px; line-height: 1.5; color: #475569; margin-top: 20px;">
            Exact room and route directions will follow separately. Questions? Feel free to reach out via
            <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("en-US")}
          </div>
        </div>
      `;

      const traineeText = isDutch ? `
Bedankt voor je inschrijving, ${reg.firstName}!

Je plaats voor de training "AI voor IT-professionals" is gereserveerd.

Referentie: ${reg.id}
Datum: Zaterdag 26 september 2026
Tijd: 09:00 - 17:00 uur (inloop vanaf 08:45 uur)
Locatie: Noordenweg 24, Ridderkerk

Je ontvangt op een later moment nog exacte zaal- en route-informatie.
Vragen? Neem contact op via info@stichtingduurzaamai.nl.

Stichting Duurzaam AI
      ` : `
Thank you for registering, ${reg.firstName}!

Your seat for the "AI for IT Professionals" training has been reserved.

Reference: ${reg.id}
Date: Saturday, September 26, 2026
Time: 09:00 AM - 05:00 PM (doors open at 08:45 AM)
Location: Noordenweg 24, Ridderkerk (NL)

Exact room and route directions will follow separately.
Questions? Reach out via info@stichtingduurzaamai.nl.

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
