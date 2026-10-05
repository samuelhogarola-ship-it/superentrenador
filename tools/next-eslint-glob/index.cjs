// eslint-disable-next-line @typescript-eslint/no-require-imports -- Next loads this CommonJS adapter synchronously.
const { statSync } = require("node:fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node built-in required by the synchronous adapter.
const { normalize } = require("node:path");

// Deliberately restricted to this repo's Next ESLint root-directory contract.
// Unsupported configuration fails loudly instead of disabling a lint rule.
exports.globSync = function globSync(pattern, options) {
  if (typeof pattern !== "string" || options?.onlyDirectories !== true || Object.keys(options).some((key) => key !== "onlyDirectories")) {
    throw new TypeError("Next ESLint root discovery only supports a string and { onlyDirectories: true }.");
  }
  if (/[*?\[\]{}]|[!+@]\(/.test(pattern) || pattern.startsWith("!")) {
    throw new Error("Glob patterns in next.rootDir are unsupported in this repository. Use literal directory paths (or an array of them).");
  }
  try {
    return statSync(pattern).isDirectory() ? [normalize(pattern)] : [];
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return [];
    throw error;
  }
};
