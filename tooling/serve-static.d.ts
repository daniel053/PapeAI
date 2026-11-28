// Types for tooling/serve-static.js (used by the Vitest suite in app/src).
import type { Server } from 'node:http';

export function createStaticServer(rootDir: string, options?: { spa?: boolean }): Server;
