// Types for tooling/headers-file.js (used by the Vitest suite in app/src).
export type HeaderOp =
  { type: 'set'; name: string; value: string } | { type: 'detach'; name: string };

export interface HeaderRule {
  path: string;
  ops: HeaderOp[];
}

export const MAX_RULES: number;
export const MAX_LINE_LENGTH: number;

export function parseHeadersFile(text: string): HeaderRule[];
export function pathMatches(pattern: string, pathname: string): boolean;
export function headersForPath(
  rules: HeaderRule[],
  pathname: string,
): Map<string, { name: string; value: string }>;
