// Minimal client for the Tikkie API v2 (ABN AMRO).
// Contract verified against the official client libraries:
//   base    sandbox  https://api-sandbox.abnamro.com/v2/tikkie/
//           prod     https://api.abnamro.com/v2/tikkie/
//   headers Api-Key, X-App-Token, Accept/Content-Type: application/json
//   POST sandboxapps                         -> { appToken }         (only Api-Key)
//   POST paymentrequests                     -> { paymentRequestToken, url, status, ... }
//   GET  paymentrequests/{token}             -> payment request incl. totalAmountPaidInCents
//   POST paymentrequestssubscription {url}   -> { subscriptionId }   (webhook)

export interface TikkieConfig {
  apiKey: string;
  appToken: string;
  sandbox: boolean;
}

export interface PaymentRequest {
  paymentRequestToken: string;
  url: string;
  amountInCents?: number;
  description?: string;
  referenceId?: string;
  createdDateTime?: string;
  expiryDate?: string;
  status?: string; // OPEN | CLOSED | EXPIRED | MAX_YIELD_REACHED | MAX_SUCCESSFUL_PAYMENTS_REACHED
  numberOfPayments?: number;
  totalAmountPaidInCents?: number;
}

function baseUrl(sandbox: boolean): string {
  return sandbox
    ? "https://api-sandbox.abnamro.com/v2/tikkie/"
    : "https://api.abnamro.com/v2/tikkie/";
}

/** Returns a config from env vars, or null when Tikkie is not (fully) configured. */
export function tikkieConfigFromEnv(): TikkieConfig | null {
  const apiKey = process.env.TIKKIE_API_KEY;
  const appToken = process.env.TIKKIE_APP_TOKEN;
  if (!apiKey || !appToken) return null;
  return {
    apiKey,
    appToken,
    // Defaults to sandbox for safety; set TIKKIE_SANDBOX=false for production.
    sandbox: process.env.TIKKIE_SANDBOX !== "false",
  };
}

async function request<T>(
  cfg: TikkieConfig,
  method: "GET" | "POST",
  pathStr: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(baseUrl(cfg.sandbox) + pathStr, {
    method,
    headers: {
      "Api-Key": cfg.apiKey,
      "X-App-Token": cfg.appToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Tikkie ${method} ${pathStr} -> ${res.status}: ${text}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

export interface CreatePaymentRequestInput {
  amountInCents: number;
  description: string;
  referenceId: string;
  /** YYYY-MM-DD */
  expiryDate?: string;
}

export async function createPaymentRequest(
  cfg: TikkieConfig,
  input: CreatePaymentRequestInput,
): Promise<PaymentRequest> {
  return request<PaymentRequest>(cfg, "POST", "paymentrequests", {
    amountInCents: input.amountInCents,
    currency: "EUR",
    description: input.description,
    referenceId: input.referenceId,
    ...(input.expiryDate ? { expiryDate: input.expiryDate } : {}),
  });
}

export async function getPaymentRequest(
  cfg: TikkieConfig,
  token: string,
): Promise<PaymentRequest> {
  return request<PaymentRequest>(cfg, "GET", `paymentrequests/${token}`);
}

export async function createSubscription(
  cfg: TikkieConfig,
  url: string,
): Promise<{ subscriptionId?: string }> {
  return request(cfg, "POST", "paymentrequestssubscription", { url });
}

/**
 * Create a sandbox App Token. Only needs the Api-Key (no X-App-Token yet), so
 * this is a thin one-off helper used by `npm run tikkie:apptoken`.
 */
export async function createSandboxAppToken(apiKey: string): Promise<string> {
  const res = await fetch(baseUrl(true) + "sandboxapps", {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Tikkie sandboxapps -> ${res.status}: ${text}`);
  const data = JSON.parse(text) as { appToken: string };
  return data.appToken;
}

/** A payment request is considered fully paid once the received total covers the amount. */
export function isPaid(pr: PaymentRequest, amountInCents: number): boolean {
  return (pr.totalAmountPaidInCents ?? 0) >= amountInCents;
}
