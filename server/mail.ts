import nodemailer, { type Transporter } from "nodemailer";
import type { Registration } from "./store";

const ORG_EMAIL = process.env.ORG_EMAIL || "info@stichtingduurzaamai.nl";

/** Returns a configured transporter, or null when SMTP env vars are missing. */
export function getTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = parseInt(process.env.SMTP_PORT || "587");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const SHELL = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#1e293b;">${inner}</div>`;

const footer = (ts: string) =>
  `<div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;">Stichting Duurzaam AI &bull; ${ts}</div>`;

/** Registration confirmation to the registrant (NL/EN). */
function traineeHtml(reg: Registration): string {
  const nl = reg.language !== "en";
  const body = nl
    ? `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Beste ${reg.firstName},</h2>
       <p style="font-size:14px;line-height:1.6;color:#475569;">Bedankt voor je aanmelding voor de <strong>AI Governance masterclass</strong> van Stichting Duurzaam AI. We hebben je aanmelding ontvangen.</p>
       <div style="margin:22px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
         Deelnemers ontvangen het leesmateriaal een week voorafgaand aan de masterclass en worden geacht dit vóór aanvang van de masterclass te hebben gelezen.</div>
       <table style="width:100%;border-collapse:collapse;font-size:13px;">
         <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Referentie:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
       </table>
       <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">Vragen? Mail naar <a href="mailto:${ORG_EMAIL}">${ORG_EMAIL}</a>.</p>
       <p style="font-size:14px;color:#475569;margin-top:16px;">Met vriendelijke groet,<br/><strong>Stichting Duurzaam AI</strong></p>
       ${footer(new Date(reg.createdAt).toLocaleString("nl-NL"))}`
    : `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Dear ${reg.firstName},</h2>
       <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for registering for the <strong>AI Governance masterclass</strong> by Stichting Duurzaam AI. We have received your registration.</p>
       <div style="margin:22px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
         Participants receive the reading material one week before the masterclass and are expected to have read it before the masterclass begins.</div>
       <table style="width:100%;border-collapse:collapse;font-size:13px;">
         <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Reference:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
       </table>
       <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">Questions? Email <a href="mailto:${ORG_EMAIL}">${ORG_EMAIL}</a>.</p>
       <p style="font-size:14px;color:#475569;margin-top:16px;">Kind regards,<br/><strong>Stichting Duurzaam AI</strong></p>
       ${footer(new Date(reg.createdAt).toLocaleString("en-US"))}`;
  return SHELL(body);
}

export async function sendRegistrationEmails(reg: Registration) {
  const t = getTransport();
  if (!t) {
    console.warn("[mail] SMTP not configured — registration emails skipped.");
    return;
  }
  const user = process.env.SMTP_USER as string;
  // Confirmation to the registrant, with the org in CC so we always know
  // someone registered and keep a copy.
  await t.sendMail({
    from: `"Stichting Duurzaam AI" <${user}>`,
    to: reg.email,
    cc: ORG_EMAIL,
    subject:
      reg.language === "en"
        ? "Your AI Governance masterclass registration"
        : "Je aanmelding voor de AI Governance masterclass",
    html: traineeHtml(reg),
    replyTo: ORG_EMAIL,
  });
  console.log(`[mail] Registration confirmation sent for ${reg.email} (cc ${ORG_EMAIL})`);
}
