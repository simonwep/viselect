import { expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createSetup } from './utils/createSetup.ts';

const { fixture } = createSetup();

it('selects and deselects elements without duplicates and reports manual changes', () => {
  const { items, selection } = fixture();
  const move = vi.fn();
  const stop = vi.fn();
  selection.on('move', move).on('stop', stop);

  expect(selection.select([items[0], '.selectable'])).toEqual(items);
  expect(selection.getSelection()).toEqual(items);
  expect(move).toHaveBeenCalledTimes(1);
  expect(stop).toHaveBeenCalledTimes(1);
  expect(move.mock.calls[0][0].store.changed.added).toEqual(items);

  selection.deselect([items[1], items[3]]);
  expect(selection.getSelection()).toEqual([items[0], items[2]]);
  expect(move.mock.calls[1][0].store.changed.removed).toEqual([items[1], items[3]]);

  selection.clearSelection();
  expect(selection.getSelection()).toEqual([]);
  expect(stop).toHaveBeenCalledTimes(3);
});

it('supports quiet manual updates and preserves stored values when requested', () => {
  const { items, selection } = fixture();
  const move = vi.fn();
  selection.on('move', move);

  selection.select(items[0], true);
  selection.clearSelection(false, true);

  expect(selection.getSelection()).toEqual([items[0]]);
  expect(move).not.toHaveBeenCalled();
});

it('deduplicates and removes event listeners', () => {
  const { items, selection } = fixture();
  const move = vi.fn();

  selection.on('move', move).on('move', move);
  selection.select(items[0]);
  expect(move).toHaveBeenCalledOnce();

  selection.off('move', move);
  selection.deselect(items[0]);
  expect(move).toHaveBeenCalledOnce();
});

it('optionally emits stop when cancelling an active selection', () => {
  const { startArea, selection } = fixture();
  const stop = vi.fn();
  selection.on('stop', stop);

  selection.cancel();
  expect(stop).not.toHaveBeenCalled();

  startArea.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 }));
  document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 21, clientY: 10 }));
  selection.cancel(true);
  expect(stop).toHaveBeenCalledOnce();
});

it('resolves dynamically-added selectables and exposes the selection-area location', () => {
  const { boundary, selection } = fixture();
  selection.resolveSelectables();
  expect(selection.getSelectables()).toHaveLength(4);

  const added = document.createElement('button');
  added.className = 'selectable';
  boundary.appendChild(added);
  selection.resolveSelectables();
  expect(selection.getSelectables()).toContain(added);

  selection.setAreaLocation({ x1: 12, y1: 18 });
  expect(selection.getAreaLocation()).toMatchObject({ x1: 12, y1: 18 });
  expect(selection.getSelectionArea().style.left).toBe('0px');
  expect(selection.getSelectionArea().style.top).toBe('0px');
});

it('can be disabled, re-enabled, and destroyed without retaining listeners', async () => {
  const { boundary, items, selection } = fixture();
  selection.disable();
  await userEvent.click(items[0]);
  expect(selection.getSelection()).toEqual([]);

  selection.enable();
  await userEvent.click(items[0]);
  expect(selection.getSelection()).toEqual([items[0]]);

  selection.destroy();
  await userEvent.click(boundary);
  expect(selection.getSelection()).toEqual([items[0]]);
});
