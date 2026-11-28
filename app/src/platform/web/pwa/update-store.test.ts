import { describe, expect, it, vi } from 'vitest';
import { createAppUpdateStore } from './update-store';

describe('app update store', () => {
  it('starts idle and ignores update/dismiss with nothing waiting', async () => {
    const store = createAppUpdateStore();
    await store.update();
    store.dismiss();
    expect(store.getSnapshot()).toBe('idle');
  });

  it('becomes available and notifies subscribers', () => {
    const store = createAppUpdateStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.markAvailable(() => Promise.resolve());
    expect(store.getSnapshot()).toBe('available');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('applies the waiting version once, even on double click', async () => {
    const store = createAppUpdateStore();
    const apply = vi.fn(() => new Promise<void>(() => undefined)); // page reloads, never resolves
    store.markAvailable(apply);
    void store.update();
    void store.update();
    expect(store.getSnapshot()).toBe('updating');
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('offers the update again if applying fails', async () => {
    const store = createAppUpdateStore();
    store.markAvailable(() => Promise.reject(new Error('no waiting worker')));
    await store.update();
    expect(store.getSnapshot()).toBe('available');
  });

  it('can be dismissed and shows again for a newer version', () => {
    const store = createAppUpdateStore();
    store.markAvailable(() => Promise.resolve());
    store.dismiss();
    expect(store.getSnapshot()).toBe('dismissed');
    store.markAvailable(() => Promise.resolve());
    expect(store.getSnapshot()).toBe('available');
  });

  it('stops notifying after unsubscribe', () => {
    const store = createAppUpdateStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.markAvailable(() => Promise.resolve());
    expect(listener).not.toHaveBeenCalled();
  });
});
