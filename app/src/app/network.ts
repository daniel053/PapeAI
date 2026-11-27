import { NETWORK_ALLOWLIST } from '../config/network';
import { createGuardedFetch } from '../core/net';

/** The only fetch the app should use. Blocks origins off the allowlist. */
export const appFetch = createGuardedFetch({
  allowlist: NETWORK_ALLOWLIST,
  selfOrigin: window.location.origin,
});
