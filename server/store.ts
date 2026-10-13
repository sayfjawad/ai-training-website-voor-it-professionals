import fs from "fs";
import path from "path";

export interface Registration {
  id: string; // GOV-123456
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  language: "nl" | "en";
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "registrations.json");

export function loadAll(): Registration[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveAll(list: Registration[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  // Atomic write: temp file + rename, so a crash mid-write can't corrupt the file.
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}

export function add(reg: Registration) {
  const list = loadAll();
  list.push(reg);
  saveAll(list);
}
