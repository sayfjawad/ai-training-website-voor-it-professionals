// One-off helper: create a Tikkie *sandbox* App Token from your sandbox API key.
//   TIKKIE_API_KEY=xxxxx npx tsx scripts/tikkie-apptoken.ts
// Copy the printed token into TIKKIE_APP_TOKEN (and keep TIKKIE_SANDBOX=true).
import "dotenv/config";
import { createSandboxAppToken } from "../server/tikkie";

const apiKey = process.env.TIKKIE_API_KEY;
if (!apiKey) {
  console.error("Set TIKKIE_API_KEY (your sandbox API key) first.");
  process.exit(1);
}

createSandboxAppToken(apiKey)
  .then((token) => {
    console.log("\nSandbox App Token:\n" + token + "\n");
    console.log("→ Put this in .env as TIKKIE_APP_TOKEN=\"" + token + "\"");
  })
  .catch((err) => {
    console.error("Failed to create sandbox app token:", err.message);
    process.exit(1);
  });
