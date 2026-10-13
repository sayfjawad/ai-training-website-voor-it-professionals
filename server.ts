import express from "express";
import path from "path";
import dotenv from "dotenv";

import * as store from "./server/store";
import type { Registration } from "./server/store";
import * as tikkie from "./server/tikkie";
import { sendRegistrationEmails, sendPaidEmails } from "./server/mail";
import { adminPageHtml } from "./server/admin";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const PRICE_IN_CENTS = parseInt(process.env.PRICE_IN_CENTS || "7500");
const TIKKIE_FALLBACK_URL =
  process.env.TIKKIE_FALLBACK_URL ||
  "https://tikkie.me/pay/Stichti5519/a1Nih6bHydBzAbyBsn7y64";
const EXPIRY_DAYS = parseInt(process.env.TIKKIE_EXPIRY_DAYS || "14");
const POLL_SECONDS = parseInt(process.env.TIKKIE_POLL_SECONDS || "60");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function expiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + EXPIRY_DAYS);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Create a per-registrant Tikkie payment request. On any failure (or when Tikkie
 * is not configured) we fall back to the shared link so the registrant can still
 * pay — that payment just can't be attributed automatically.
 */
async function createPaymentLink(
  reg: Registration,
): Promise<{ url: string; token?: string; fallback: boolean }> {
  const cfg = tikkie.tikkieConfigFromEnv();
  if (!cfg) return { url: TIKKIE_FALLBACK_URL, fallback: true };
  try {
    const pr = await tikkie.createPaymentRequest(cfg, {
      amountInCents: reg.amountInCents,
      description: `AI Governance — ${reg.firstName} ${reg.lastName} (${reg.id})`,
      referenceId: reg.id,
      expiryDate: expiryDate(),
    });
    return { url: pr.url, token: pr.paymentRequestToken, fallback: false };
  } catch (err) {
    console.error(`[tikkie] create failed for ${reg.id}, using fallback link:`, err);
    return { url: TIKKIE_FALLBACK_URL, fallback: true };
  }
}

/** Mark a registration paid (idempotent) and fire the confirmation emails once. */
async function markPaid(reg: Registration, totalPaid: number) {
  if (reg.paymentStatus === "paid") return;
  const updated = store.update(reg.id, {
    paymentStatus: "paid",
    paidAt: new Date().toISOString(),
    totalAmountPaidInCents: totalPaid,
  });
  console.log(`[tikkie] PAID: ${reg.id} (${reg.email})`);
  if (updated && !updated.confirmationSent) {
    await sendPaidEmails(updated);
    store.update(reg.id, { confirmationSent: true });
  }
}

/** Re-check a single pending registration's Tikkie payment request. */
async function checkRegistration(reg: Registration): Promise<void> {
  const cfg = tikkie.tikkieConfigFromEnv();
  if (!cfg || !reg.paymentRequestToken || reg.paymentStatus !== "pending") return;
  try {
    const pr = await tikkie.getPaymentRequest(cfg, reg.paymentRequestToken);
    if (tikkie.isPaid(pr, reg.amountInCents)) {
      await markPaid(reg, pr.totalAmountPaidInCents ?? reg.amountInCents);
    } else if (pr.status === "EXPIRED") {
      store.update(reg.id, { paymentStatus: "expired" });
      console.log(`[tikkie] EXPIRED: ${reg.id}`);
    }
  } catch (err) {
    console.error(`[tikkie] check failed for ${reg.id}:`, err);
  }
}

let polling = false;
async function pollOnce(): Promise<void> {
  if (polling) return;
  if (!tikkie.tikkieConfigFromEnv()) return;
  polling = true;
  try {
    const pending = store
      .loadAll()
      .filter((r) => r.paymentStatus === "pending" && r.paymentRequestToken);
    for (const reg of pending) await checkRegistration(reg);
  } finally {
    polling = false;
  }
}

function requireAdmin(req: express.Request, res: express.Response): boolean {
  if (!ADMIN_TOKEN) {
    res.status(503).json({ error: "Admin not configured (ADMIN_TOKEN unset)" });
    return false;
  }
  const auth = req.header("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  const token = bearer || (req.query.token as string | undefined);
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- Registration ---
  app.post("/api/register", async (req, res) => {
    try {
      const body = req.body ?? {};
      if (!body.firstName || !body.lastName || !body.email) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }
      const reg: Registration = {
        id: body.id || `GOV-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: body.createdAt || new Date().toISOString(),
        firstName: String(body.firstName),
        lastName: String(body.lastName),
        email: String(body.email),
        phone: body.phone || undefined,
        organization: body.organization || undefined,
        language: body.language === "en" ? "en" : "nl",
        amountInCents: PRICE_IN_CENTS,
        paymentStatus: "pending",
      };
      console.log(`[API] Registration: ${reg.firstName} ${reg.lastName} (${reg.email})`);

      const link = await createPaymentLink(reg);
      reg.tikkieUrl = link.url;
      reg.paymentRequestToken = link.token;
      reg.usedFallbackLink = link.fallback;

      try {
        store.add(reg);
      } catch (err) {
        console.error("[API] Failed to persist registration:", err);
      }

      await sendRegistrationEmails(reg, link.url);

      return res.status(200).json({ success: true, id: reg.id, tikkieUrl: link.url });
    } catch (error: any) {
      console.error("[API] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- Tikkie webhook: trigger an immediate re-check ---
  app.post("/api/tikkie/webhook", async (req, res) => {
    res.status(200).json({ received: true }); // ack fast
    try {
      const token = req.body?.paymentRequestToken;
      if (token) {
        const reg = store.findByToken(token);
        if (reg) await checkRegistration(reg);
      } else {
        await pollOnce();
      }
    } catch (err) {
      console.error("[webhook] error:", err);
    }
  });

  // --- Admin: who registered / who paid ---
  app.get("/api/admin/registrations", (req, res) => {
    if (!requireAdmin(req, res)) return;
    const list = store
      .loadAll()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const paid = list.filter((r) => r.paymentStatus === "paid");
    res.json({
      summary: {
        total: list.length,
        paid: paid.length,
        pending: list.filter((r) => r.paymentStatus === "pending").length,
        totalPaidInCents: paid.reduce(
          (s, r) => s + (r.totalAmountPaidInCents ?? r.amountInCents),
          0,
        ),
      },
      registrations: list,
    });
  });

  // Manual re-check trigger (admin)
  app.post("/api/admin/recheck", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    await pollOnce();
    res.json({ ok: true });
  });

  app.get("/admin", (_req, res) => {
    res.set("Content-Type", "text/html").send(adminPageHtml());
  });

  // --- Static site / dev server ---
  if (process.env.NODE_ENV !== "production") {
    // Lazy-load vite so the production bundle never requires this devDependency.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] AI Governance running on http://localhost:${PORT}`);
    const cfg = tikkie.tikkieConfigFromEnv();
    if (cfg) {
      console.log(`[tikkie] enabled (${cfg.sandbox ? "SANDBOX" : "PRODUCTION"}), polling every ${POLL_SECONDS}s`);
      pollOnce();
      setInterval(pollOnce, POLL_SECONDS * 1000);
    } else {
      console.log("[tikkie] not configured — using shared fallback link, no payment tracking");
    }
  });
}

startServer();
