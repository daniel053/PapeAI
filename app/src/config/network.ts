// Network allowlist (docs/seguranca/seguranca-web-headers-csp-robots.md).
// F01: only the app's own origin. Each new entry needs review in a PR and
// must match the CSP `connect-src` header.
export const NETWORK_ALLOWLIST: readonly string[] = ['self'];
