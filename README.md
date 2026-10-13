# AI Governance Masterclass — Stichting Duurzaam AI

Registration site for the **AI Governance masterclass**.

- **Live:** https://governance.stichtingduurzaamai.nl
- **Admin ("who registered"):** https://governance.stichtingduurzaamai.nl/admin (needs `ADMIN_TOKEN`)

## How it works

The page is the original source document's compact HTML/CSS (self-contained
`index.html`, inline styling, no framework). A visitor fills in the registration
form (name/email + optional phone/organization); the form POSTs to `/api/register`,
which stores the registrant and sends **one confirmation email** to them with the
org inbox (`info@stichtingduurzaamai.nl`) in **CC**, so the org always knows
someone registered and keeps a copy. No payment — it's sign-up only.

Config is via env vars — see [.env.example](.env.example).

> The `src/` React components are legacy and no longer used for the page; the
> server (`server.ts`) serves `dist/index.html`, the API and `/admin`.

## Run locally

```bash
npm install
cp .env.example .env   # fill in SMTP + ADMIN_TOKEN
npm run dev            # http://localhost:3002
npm run lint           # tsc --noEmit
npm run build          # vite (static index.html) + esbuild server -> dist/
```

## Deploy

Containerized (`Dockerfile`) and running on the **k3s multicode cluster** (pod on
c4130, public edge = nginx on vmi2702091). Full runbook: **[k8s/README.md](k8s/README.md)**.
Infra docs: `infra-landscape/services/ai-governance.md`.
