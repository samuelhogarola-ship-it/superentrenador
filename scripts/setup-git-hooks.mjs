import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const gitDir = join(process.cwd(), ".git");

if (!existsSync(gitDir)) {
  console.log("Skipping git hook setup because .git is not present in this folder.");
  process.exit(0);
}

const hooksDir = join(gitDir, "hooks");
const hookPath = join(hooksDir, "pre-commit");
const hook = `#!/bin/sh
npm run build
`;

mkdirSync(hooksDir, { recursive: true });
writeFileSync(hookPath, hook);
chmodSync(hookPath, 0o755);

console.log("Installed .git/hooks/pre-commit");
