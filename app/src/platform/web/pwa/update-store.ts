// State of the "new version available" flow, independent of React and of the
// service worker API so it can be unit-tested in Node.

export type AppUpdateStatus = 'idle' | 'available' | 'updating' | 'dismissed';

export interface AppUpdateStore {
  getSnapshot(): AppUpdateStatus;
  subscribe(listener: () => void): () => void;
  /** Called when a new service worker is waiting. `apply` activates it. */
  markAvailable(apply: () => Promise<void>): void;
  /** Activates the waiting version; the page reloads once it takes control. */
  update(): Promise<void>;
  /** Hides the notice; the new version activates after all tabs are closed. */
  dismiss(): void;
}

export function createAppUpdateStore(): AppUpdateStore {
  let status: AppUpdateStatus = 'idle';
  let apply: (() => Promise<void>) | null = null;
  const listeners = new Set<() => void>();

  function set(next: AppUpdateStatus) {
    if (next === status) return;
    status = next;
    for (const listener of listeners) listener();
  }

  return {
    getSnapshot: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    markAvailable(nextApply) {
      apply = nextApply;
      set('available');
    },
    async update() {
      if (status !== 'available' || !apply) return;
      set('updating');
      try {
        await apply();
      } catch {
        // Could not reach the waiting worker: offer the button again.
        set('available');
      }
    },
    dismiss() {
      if (status === 'available') set('dismissed');
    },
  };
}

/** The app-wide instance used by the registration and the notice. */
export const appUpdateStore = createAppUpdateStore();
