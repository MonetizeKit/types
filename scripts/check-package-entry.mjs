/**
 * Package-entry guard for the type-only package: assert the built type
 * declarations exist and expose the core public types. Run after `pnpm build`.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const dts = path.join(dir, "..", "dist", "index.d.ts");

const problems = [];
if (!existsSync(dts)) {
  problems.push("dist/index.d.ts is missing — did `tsup` (dts) run?");
} else {
  const content = readFileSync(dts, "utf8");
  const expected = [
    "Customer",
    "Plan",
    "PricingTerm",
    "Subscription",
    "EntitlementResult",
    "UsageData",
    "CreditBalance",
  ];
  for (const name of expected) {
    if (!new RegExp(`\\b${name}\\b`).test(content)) {
      problems.push(`dist/index.d.ts does not export type "${name}"`);
    }
  }
}

if (problems.length > 0) {
  console.error("Package entry guard failed:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("Package entry guard passed: core types are exported.");
