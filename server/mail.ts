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

function euro(cents: number): string {
  return `€${(cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 0 })}`;
}

const SHELL = (inner: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#1e293b;">${inner}</div>`;

const footer = (ts: string) =>
  `<div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:12px;">Stichting Duurzaam AI &bull; ${ts}</div>`;

/** Internal notification to the org that someone registered (payment still pending). */
function orgRegisteredHtml(reg: Registration, tikkieUrl: string): string {
  const row = (k: string, v: string, alt = false) =>
    `<tr${alt ? ' style="background:#f1f5f9;"' : ""}><td style="padding:8px;font-weight:bold;width:160px;border-bottom:1px solid #e2e8f0;">${k}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${v}</td></tr>`;
  return SHELL(
    `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Nieuwe aanmelding AI Governance</h2>
     <table style="width:100%;border-collapse:collapse;font-size:14px;">
       ${row("ID:", `<span style="font-family:monospace;">${reg.id}</span>`, true)}
       ${row("Naam:", `${reg.firstName} ${reg.lastName}`)}
       ${row("E-mail:", `<a href="mailto:${reg.email}">${reg.email}</a>`, true)}
       ${row("Telefoon:", reg.phone || "—")}
       ${row("Organisatie:", reg.organization || "—", true)}
       ${row("Taal:", reg.language === "en" ? "Engels" : "Nederlands")}
       ${row("Betaalstatus:", "⏳ nog niet betaald", true)}
     </table>
     <div style="margin-top:20px;padding:12px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;">
       <strong>Tikkie link (deze aanmelder):</strong> <a href="${tikkieUrl}">${tikkieUrl}</a><br/>
       <em style="color:#64748b;">Je krijgt automatisch bericht zodra deze persoon betaald heeft.</em>
     </div>
     ${footer(new Date(reg.createdAt).toLocaleString("nl-NL"))}`,
  );
}

/** Payment-link email to the registrant (NL/EN). */
function traineePaymentHtml(reg: Registration, tikkieUrl: string): string {
  const nl = reg.language !== "en";
  const price = euro(reg.amountInCents);
  const btn = `<div style="text-align:center;margin:28px 0;"><a href="${tikkieUrl}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:10px;">${nl ? `Betaal ${price} via Tikkie →` : `Pay ${price} via Tikkie →`}</a></div>`;
  const copy = `<p style="font-size:13px;line-height:1.5;color:#64748b;text-align:center;">${nl ? "Of kopieer de link:" : "Or copy the link:"} <a href="${tikkieUrl}" style="color:#059669;">${tikkieUrl}</a></p>`;
  const details = `<h3 style="color:#059669;font-size:14px;margin:20px 0 6px;">${nl ? "Jouw aanmelding" : "Your registration"}</h3>
     <table style="width:100%;border-collapse:collapse;font-size:13px;">
       <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">${nl ? "Referentie:" : "Reference:"}</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
       <tr><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${nl ? "Sessie:" : "Session:"}</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">AI Governance</td></tr>
       <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${nl ? "Prijs:" : "Price:"}</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;">${price} p.p. (${nl ? "excl. btw" : "excl. VAT"})</td></tr>
     </table>`;
  return SHELL(
    nl
      ? `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Beste ${reg.firstName},</h2>
         <p style="font-size:14px;line-height:1.6;color:#475569;">Bedankt voor je aanmelding voor de <strong>AI Governance</strong> sessie van Stichting Duurzaam AI!</p>
         <p style="font-size:14px;line-height:1.6;color:#475569;">Om je aanmelding definitief te maken, betaal je je deelname van <strong>${price}</strong> via onderstaande Tikkie link:</p>
         ${btn}${copy}
         <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
           <strong>Na betaling</strong> ontvang je automatisch een definitieve bevestiging met alle sessiedetails, inclusief locatie en voorbereidingsmateriaal.</div>
         ${details}
         <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">Vragen? Mail naar <a href="mailto:${ORG_EMAIL}">${ORG_EMAIL}</a>.</p>
         <p style="font-size:14px;color:#475569;margin-top:16px;">Met vriendelijke groet,<br/><strong>Stichting Duurzaam AI</strong></p>
         ${footer(new Date(reg.createdAt).toLocaleString("nl-NL"))}`
      : `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Dear ${reg.firstName},</h2>
         <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for registering for the <strong>AI Governance</strong> session by Stichting Duurzaam AI!</p>
         <p style="font-size:14px;line-height:1.6;color:#475569;">To complete your registration, please pay the <strong>${price}</strong> participation fee via the Tikkie link below:</p>
         ${btn}${copy}
         <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
           <strong>After payment</strong> you will automatically receive a final confirmation with all session details, including location and preparatory material.</div>
         ${details}
         <p style="font-size:13px;line-height:1.5;color:#475569;margin-top:20px;">Questions? Email <a href="mailto:${ORG_EMAIL}">${ORG_EMAIL}</a>.</p>
         <p style="font-size:14px;color:#475569;margin-top:16px;">Kind regards,<br/><strong>Stichting Duurzaam AI</strong></p>
         ${footer(new Date(reg.createdAt).toLocaleString("en-US"))}`,
  );
}

/** Confirmation email once payment is received (NL/EN). */
function traineePaidHtml(reg: Registration): string {
  const nl = reg.language !== "en";
  const price = euro(reg.amountInCents);
  return SHELL(
    nl
      ? `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Betaling ontvangen — je plek is bevestigd! 🎉</h2>
         <p style="font-size:14px;line-height:1.6;color:#475569;">Beste ${reg.firstName}, we hebben je betaling van <strong>${price}</strong> ontvangen. Je deelname aan de <strong>AI Governance</strong> sessie is hiermee definitief.</p>
         <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
           We sturen je ruim voor de sessie een e-mail met de exacte locatie, het programma en voorbereidingsmateriaal.</div>
         <table style="width:100%;border-collapse:collapse;font-size:13px;">
           <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Referentie:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
         </table>
         <p style="font-size:14px;color:#475569;margin-top:16px;">Tot binnenkort!<br/><strong>Stichting Duurzaam AI</strong></p>
         ${footer(new Date().toLocaleString("nl-NL"))}`
      : `<h2 style="color:#059669;border-bottom:2px solid #34d399;padding-bottom:10px;margin-top:0;">Payment received — your seat is confirmed! 🎉</h2>
         <p style="font-size:14px;line-height:1.6;color:#475569;">Dear ${reg.firstName}, we have received your payment of <strong>${price}</strong>. Your participation in the <strong>AI Governance</strong> session is now confirmed.</p>
         <div style="margin:24px 0;padding:14px;border-left:4px solid #10b981;background:#f0fdf4;font-size:13px;line-height:1.6;">
           Well before the session we'll email you the exact location, the programme and preparatory material.</div>
         <table style="width:100%;border-collapse:collapse;font-size:13px;">
           <tr style="background:#f1f5f9;"><td style="padding:7px;font-weight:bold;width:120px;border-bottom:1px solid #e2e8f0;">Reference:</td><td style="padding:7px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${reg.id}</td></tr>
         </table>
         <p style="font-size:14px;color:#475569;margin-top:16px;">See you soon!<br/><strong>Stichting Duurzaam AI</strong></p>
         ${footer(new Date().toLocaleString("en-US"))}`,
  );
}

export async function sendRegistrationEmails(reg: Registration, tikkieUrl: string) {
  const t = getTransport();
  if (!t) {
    console.warn("[mail] SMTP not configured — registration emails skipped.");
    return;
  }
  const user = process.env.SMTP_USER as string;
  await Promise.allSettled([
    t.sendMail({
      from: `"${reg.firstName} ${reg.lastName} via Duurzaam AI" <${user}>`,
      to: ORG_EMAIL,
      subject: `Nieuwe aanmelding AI Governance: ${reg.firstName} ${reg.lastName}`,
      html: orgRegisteredHtml(reg, tikkieUrl),
      replyTo: reg.email,
    }),
    t.sendMail({
      from: `"Stichting Duurzaam AI" <${user}>`,
      to: reg.email,
      subject:
        reg.language === "en"
          ? "Your AI Governance registration — payment link"
          : "Jouw aanmelding AI Governance — betaallink",
      html: traineePaymentHtml(reg, tikkieUrl),
      replyTo: ORG_EMAIL,
    }),
  ]);
  console.log(`[mail] Registration emails sent for ${reg.email}`);
}

export async function sendPaidEmails(reg: Registration) {
  const t = getTransport();
  if (!t) {
    console.warn("[mail] SMTP not configured — paid-confirmation emails skipped.");
    return;
  }
  const user = process.env.SMTP_USER as string;
  await Promise.allSettled([
    t.sendMail({
      from: `"Stichting Duurzaam AI" <${user}>`,
      to: reg.email,
      subject:
        reg.language === "en"
          ? "Payment received — your AI Governance seat is confirmed"
          : "Betaling ontvangen — je plek bij AI Governance is bevestigd",
      html: traineePaidHtml(reg),
      replyTo: ORG_EMAIL,
    }),
    t.sendMail({
      from: `"Stichting Duurzaam AI" <${user}>`,
      to: ORG_EMAIL,
      subject: `✅ Betaald: ${reg.firstName} ${reg.lastName} (${reg.id})`,
      html: SHELL(
        `<h2 style="color:#059669;margin-top:0;">Betaling ontvangen</h2>
         <p style="font-size:14px;color:#475569;"><strong>${reg.firstName} ${reg.lastName}</strong> (${reg.email}) heeft <strong>${euro(reg.amountInCents)}</strong> betaald voor AI Governance.</p>
         <p style="font-size:13px;color:#64748b;">Referentie: <span style="font-family:monospace;">${reg.id}</span></p>
         ${footer(new Date().toLocaleString("nl-NL"))}`,
      ),
      replyTo: reg.email,
    }),
  ]);
  console.log(`[mail] Paid-confirmation emails sent for ${reg.email}`);
}
