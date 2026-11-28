import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TOAST_DURATION_MS,
  MAX_VISIBLE_TOASTS,
  addToast,
  createToast,
  removeToast,
} from './toast-queue';

describe('createToast', () => {
  it('defaults to an info notice that disappears after a while', () => {
    expect(createToast(1, { message: 'Salvo' })).toEqual({
      id: 1,
      message: 'Salvo',
      tone: 'info',
      durationMs: DEFAULT_TOAST_DURATION_MS,
    });
  });

  it('keeps errors on screen until dismissed', () => {
    expect(createToast(2, { message: 'Falhou', tone: 'error' }).durationMs).toBeNull();
  });

  it('respects an explicit duration, including null', () => {
    expect(createToast(3, { message: 'x', tone: 'error', durationMs: 2000 }).durationMs).toBe(2000);
    expect(createToast(4, { message: 'x', durationMs: null }).durationMs).toBeNull();
  });
});

describe('addToast / removeToast', () => {
  it('appends in order and drops the oldest beyond the limit', () => {
    let list = [createToast(1, { message: 'a' })];
    for (let id = 2; id <= MAX_VISIBLE_TOASTS + 2; id += 1) {
      list = addToast(list, createToast(id, { message: String(id) }));
    }
    expect(list).toHaveLength(MAX_VISIBLE_TOASTS);
    expect(list.map((toast) => toast.id)).toEqual([3, 4, 5]);
  });

  it('removes by id and ignores unknown ids', () => {
    const list = [createToast(1, { message: 'a' }), createToast(2, { message: 'b' })];
    expect(removeToast(list, 1).map((toast) => toast.id)).toEqual([2]);
    expect(removeToast(list, 99)).toEqual(list);
  });

  it('does not mutate the original list', () => {
    const list = [createToast(1, { message: 'a' })];
    addToast(list, createToast(2, { message: 'b' }));
    removeToast(list, 1);
    expect(list).toHaveLength(1);
  });
});
