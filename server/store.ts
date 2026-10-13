import fs from "fs";
import path from "path";

export type PaymentStatus = "pending" | "paid" | "expired" | "error";

export interface Registration {
  id: string; // GOV-123456 — also used as the Tikkie referenceId
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  language: "nl" | "en";
  amountInCents: number;

  // Payment tracking
  paymentStatus: PaymentStatus;
  paymentRequestToken?: string; // Tikkie token (absent when the shared fallback link is used)
  tikkieUrl?: string; // the link emailed to this person
  usedFallbackLink?: boolean; // true = shared link, so this payment can't be attributed
  totalAmountPaidInCents?: number;
  paidAt?: string;
  confirmationSent?: boolean; // paid-confirmation email already sent
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "registrations.json");

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadAll(): Registration[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveAll(list: Registration[]) {
  ensureDir();
  // Atomic write: write to a temp file then rename, so a crash mid-write
  // can't leave a half-written (corrupt) registrations.json.
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}

export function add(reg: Registration) {
  const list = loadAll();
  list.push(reg);
  saveAll(list);
}

/** Merge a patch into the registration with the given id. Returns the updated record. */
export function update(
  id: string,
  patch: Partial<Registration>,
): Registration | undefined {
  const list = loadAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...patch };
  saveAll(list);
  return list[idx];
}

export function findByToken(token: string): Registration | undefined {
  return loadAll().find((r) => r.paymentRequestToken === token);
}
