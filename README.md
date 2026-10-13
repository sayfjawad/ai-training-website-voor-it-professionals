# AI Governance training site — Stichting Duurzaam AI

Registration + payment site for the **AI Governance** training session.
React + Vite frontend and a small Express server (`server.ts`) that serves both
the static site and the API on port 3002.

- **Live:** https://governance.stichtingduurzaamai.nl
- **Admin ("who paid"):** https://governance.stichtingduurzaamai.nl/admin (needs `ADMIN_TOKEN`)

## How it works

A visitor pre-registers (name/email + optional phone/organization). The server
creates a **per-registrant Tikkie payment request** via the Tikkie API v2
(`referenceId` = the registration id), emails that unique payment link, and
tracks who actually paid:

- a background poller re-checks open payment requests (source of truth);
- `POST /api/tikkie/webhook` gives instant updates;
- on payment the registrant + org get a confirmation email and the `/admin`
  dashboard flips the row to **Betaald**.

If no Tikkie API credentials are configured it falls back to a single shared
link (`TIKKIE_FALLBACK_URL`) — the site keeps working, but payments can't be
attributed. All config is via env vars — see [.env.example](.env.example).

## Run locally

```bash
npm install
cp .env.example .env   # fill in SMTP + (optionally) Tikkie + ADMIN_TOKEN
npm run dev            # http://localhost:3002
npm run lint           # tsc --noEmit
npm run build          # vite build + esbuild server -> dist/
```

## Deploy

Containerized (`Dockerfile`) and running on the **k3s multicode cluster** (pod on
c4130, public edge = nginx on vmi2702091). Full runbook: **[k8s/README.md](k8s/README.md)**.
Infra docs: `infra-landscape/services/ai-governance.md`.

## Status / finishing later

✅ Built, deployed, SMTP live, admin dashboard live.

⏳ **One thing left:** Tikkie runs in **fallback mode** (shared link, no per-person
tracking) until Tikkie Business API credentials exist. To finish — get a sandbox
API key, run `npm run tikkie:apptoken` for an app token, put both in the
`ai-governance-env` secret and `rollout restart`. Step-by-step in
[k8s/README.md](k8s/README.md) and `infra-landscape/services/ai-governance.md`.
