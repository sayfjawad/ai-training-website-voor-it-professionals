import express from "express";
import path from "path";
import dotenv from "dotenv";

import * as store from "./server/store";
import type { Registration } from "./server/store";
import { sendRegistrationEmails } from "./server/mail";
import { adminPageHtml } from "./server/admin";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

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

  // --- Registration (no payment) ---
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
      };
      console.log(`[API] Registration: ${reg.firstName} ${reg.lastName} (${reg.email})`);

      try {
        store.add(reg);
      } catch (err) {
        console.error("[API] Failed to persist registration:", err);
      }

      await sendRegistrationEmails(reg);

      return res.status(200).json({ success: true, id: reg.id });
    } catch (error: any) {
      console.error("[API] Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- Admin: who registered ---
  app.get("/api/admin/registrations", (req, res) => {
    if (!requireAdmin(req, res)) return;
    const list = store
      .loadAll()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    res.json({ summary: { total: list.length }, registrations: list });
  });

  app.get("/admin", (_req, res) => {
    res.set("Content-Type", "text/html").send(adminPageHtml());
  });

  // --- Static site / dev server ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] AI Governance masterclass running on http://localhost:${PORT}`);
  });
}

startServer();
