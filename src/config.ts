// Single source of truth for the training's price and the Tikkie fallback link
// used by the frontend. The server generates a per-registrant Tikkie link via
// the Tikkie API; this static link is only a backup shown on the success screen
// (and used by the server when the Tikkie API is not configured).

export const PRICE_EUR = 75;

// Shared Tikkie link — fallback only. Per-person links come from /api/register.
export const TIKKIE_FALLBACK_URL =
  "https://tikkie.me/pay/Stichti5519/a1Nih6bHydBzAbyBsn7y64";
