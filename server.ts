import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const TIKKIE_URL = "https://tikkie.me/pay/Stichti5519/a1Nih6bHydBzAbyBsn7y64";

interface Registration {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  language: "nl" | "en";
}

function storeRegistration(reg: Registration) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const existing: Registration[] = (() => {
    try { return JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, "utf-8")); } catch { return []; }
  })();
  existing.push(reg);
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(existing, null, 2));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/register", async (req, res) => {
    try {
      const reg: Registration = req.body;
      console.log(`[API] Registration: ${reg.firstName} ${reg.lastName} (${reg.email})`);

      try { storeRegistration(reg); } catch (err) {
        console.error("[API] Failed to persist registration:", err);
      }

      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn("[API] SMTP not configured — registration logged, email skipped.");
        return res.status(200).json({ success: true, id: reg.id });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465",
        auth: { user: smtpUser, pass: smtpPass },
      });

      const isDutch = reg.language !== "en";
      const timestamp = new Date(reg.createdAt).toLocaleString("nl-NL");

      // --- Email naar organisatie ---
      const orgHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#1e293b;">
          <h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Nieuwe aanmelding AI Governance</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="background:#f1f5f9;"><td style="padding:8px;font-weight:bold;width:160px;border-bottom:1px solid #e2e8f0;">ID:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Naam:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${reg.firstName} ${reg.lastName}</td></tr>
            <tr style="background:#f1f5f9;"><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">E-mail:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${reg.email}">${reg.email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Telefoon:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${reg.phone || "—"}</td></tr>
            <tr style="background:#f1f5f9;"><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Organisatie:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${reg.organization || "—"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Taal:</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${reg.language === "en" ? "Engels" : "Nederlands"}</td></tr>
          </table>
          <div style="margin-top:20px;padding:12px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;">
            <strong>Tikkie link:</strong> <a href="${TIKKIE_URL}">${TIKKIE_URL}</a><br/>
            <em style="color:#64748b;">Controleer of de betaling binnenkomt na aanmelding.</em>
          </div>
          <div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;">
            Stichting Duurzaam AI &bull; ${timestamp}
          </div>
        </div>`;

      // --- Bevestigingsmail naar deelnemer ---
      const traineeHtml = isDutch ? `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#1e293b;">
          <h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Beste ${reg.firstName},</h2>
          <p style="font-size:14px;line-height:1.6;color:#475569;">
            Bedankt voor je aanmelding voor de <strong>AI Governance</strong> sessie van Stichting Duurzaam AI!
          </p>
          <p style="font-size:14px;line-height:1.6;color:#475569;">
            Om je aanmelding definitief te maken, betaal je deelname van <strong>€75</strong> via onderstaande Tikkie link:
          </p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${TIKKIE_URL}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:10px;">
              Betaal €75 via Tikkie →
            </a>
          </div>
          <p style="font-size:13px;line-height:1.5;color:#64748b;text-align:center;">
            Of kopieer de link: <a href="${TIKKIE_URL}" style="color:#059669;">${TIKKIE_URL}</a>
          </p>
          <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;color:#1e293b;">
            <strong>Na betaling</strong> ontvang je een definitieve bevestiging met alle sessiedetails, inclusief locatie en voorbereidingsmateriaal.
          </div>
          <h3 style="color:#059669;font-size:14px;margin:20px 0 6px;">Jouw aanmelding</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Referentie:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
            <tr><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Sessie:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">AI Governance</td></tr>
            <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Prijs:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">€75 p.p. (excl. btw)</td></tr>
          </table>
          <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">
            Vragen? Mail naar <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>
          <p style="font-size:14px;color:#475569;margin-top:16px;">
            Met vriendelijke groet,<br/>
            <strong>Stichting Duurzaam AI</strong>
          </p>
          <div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;">
            Stichting Duurzaam AI &bull; ${timestamp}
          </div>
        </div>` : `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#1e293b;">
          <h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Dear ${reg.firstName},</h2>
          <p style="font-size:14px;line-height:1.6;color:#475569;">
            Thank you for registering for the <strong>AI Governance</strong> session by Stichting Duurzaam AI!
          </p>
          <p style="font-size:14px;line-height:1.6;color:#475569;">
            To complete your registration, please pay the <strong>€75</strong> participation fee via the Tikkie link below:
          </p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${TIKKIE_URL}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:10px;">
              Pay €75 via Tikkie →
            </a>
          </div>
          <p style="font-size:13px;line-height:1.5;color:#64748b;text-align:center;">
            Or copy the link: <a href="${TIKKIE_URL}" style="color:#059669;">${TIKKIE_URL}</a>
          </p>
          <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;color:#1e293b;">
            <strong>After payment</strong> you will receive a final confirmation with all session details, including location and preparatory reading material.
          </div>
          <h3 style="color:#059669;font-size:14px;margin:20px 0 6px;">Your registration</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Reference:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
            <tr><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Session:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">AI Governance</td></tr>
            <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Price:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">€75 p.p. (excl. VAT)</td></tr>
          </table>
          <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">
            Questions? Email <a href="mailto:info@stichtingduurzaamai.nl">info@stichtingduurzaamai.nl</a>.
          </p>
          <p style="font-size:14px;color:#475569;margin-top:16px;">
            Kind regards,<br/>
            <strong>Stichting Duurzaam AI</strong>
          </p>
          <div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;">
            Stichting Duurzaam AI &bull; ${new Date(reg.createdAt).toLocaleString("en-US")}
          </div>
        </div>`;

      await Promise.allSettled([
        transporter.sendMail({
          from: `"${reg.firstName} ${reg.lastName} via Duurzaam AI" <${smtpUser}>`,
          to: "info@stichtingduurzaamai.nl",
          subject: `Nieuwe aanmelding AI Governance: ${reg.firstName} ${reg.lastName}`,
          html: orgHtml,
          replyTo: reg.email,
        }),
        transporter.sendMail({
          from: `"Stichting Duurzaam AI" <${smtpUser}>`,
          to: reg.email,
          subject: isDutch
            ? "Jouw aanmelding AI Governance — betaallink"
            : "Your AI Governance registration — payment link",
          html: traineeHtml,
          replyTo: "info@stichtingduurzaamai.nl",
        }),
      ]);

      console.log(`[API] Emails sent for ${reg.email}`);
      return res.status(200).json({ success: true, id: reg.id });

    } catch (error: any) {
      console.error("[API] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] AI Governance running on http://localhost:${PORT}`);
  });
}

startServer();
