/**
 * Published-package install smoke: pack the real tarball, install it into a
 * clean project, and type-check a consumer that imports the public types.
 * Guards the package entry + build output + d.ts for real external consumers.
 */
import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = mkdtempSync(path.join(tmpdir(), "mk-types-smoke-"));

function run(cmd, cwd) {
  execSync(cmd, { cwd, stdio: "inherit" });
}

try {
  run("pnpm build", repo);
  run(`npm pack --pack-destination "${work}"`, repo);
  const tarball = readdirSync(work).find((f) => f.endsWith(".tgz"));
  if (!tarball) throw new Error("npm pack produced no tarball");

  writeFileSync(path.join(work, "package.json"), JSON.stringify({ name: "smoke", private: true }, null, 2));
  writeFileSync(
    path.join(work, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: { strict: true, noEmit: true, moduleResolution: "Bundler", module: "ESNext", skipLibCheck: true },
        files: ["consumer.ts"],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    path.join(work, "consumer.ts"),
    `import type { Customer, Plan, PricingTerm } from "@monetizekit/types";\n` +
      `const c: Customer = {} as Customer;\nconst p: Plan = {} as Plan;\nconst t: PricingTerm = {} as PricingTerm;\nvoid c; void p; void t;\n`,
  );

  run(`npm install --no-save "${path.join(work, tarball)}" typescript`, work);
  run("npx tsc --noEmit", work);
  console.log("Install smoke passed: @monetizekit/types imports + type-checks in a clean project.");
} finally {
  rmSync(work, { recursive: true, force: true });
}
