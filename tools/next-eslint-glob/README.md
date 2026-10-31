# Next ESLint literal-root adapter

The repository does not configure `settings.next.rootDir`: Next uses ESLint's cwd directly. `@next/eslint-plugin-next@16.3.8` nevertheless installs fast-glob solely for `getRootDirs` in `no-html-link-for-pages`, pulling in vulnerable braces (GHSA-vfj7-8cjw-p6xm). Latest stable and canary still use that dependency.

This private package removes that unused glob engine while retaining every Next lint rule. It is **not a general fast-glob replacement**. The override targets only this exact Next plugin version, via the root `fast-glob` file dependency so npm installs it reproducibly.

Supported contract: `globSync(string, { onlyDirectories: true })` with a literal directory path. Absolute and relative paths, Windows separators normalized by the plugin, and directory symlinks work. Missing paths/files return an empty list; unexpected filesystem errors remain visible. An array of literal roots works through the plugin's existing mapping.

Glob patterns are intentionally unsupported and throw a clear configuration error. Future monorepo/glob-root configuration must first remove this adapter or implement and review that new requirement. This is fail-closed: an unsupported pattern cannot silently disable link validation. Current default-cwd config is unchanged.

A direct tinyglobby alias was rejected during review: it expanded literal directories recursively and omitted directory symlinks, changing which pages the lint rule inspected. No glob library is used here.

`tests/eslint-root-dirs.test.ts` covers literal roots inside/outside cwd, relative paths, symlinks, Windows separators, arrays, missing roots/files, explicit glob rejection, and real rule diagnostics. The rule still flags links to real app pages without flagging fixture pages. Audit thresholds, hooks and allowlist are unchanged.

Sources checked 2026-10-05:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/vercel/next.js/tree/v16.3.8/packages/eslint-plugin-next
