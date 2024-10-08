import { expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createSetup } from './utils/createSetup.ts';

const { fixture } = createSetup();

const dispatchMouseEvent = (target: EventTarget, type: string, options: MouseEventInit) =>
  target.dispatchEvent(new MouseEvent(type, { bubbles: true, composed: true, ...options }));

it('emits the drag lifecycle and maintains the selected elements', async () => {
  const { startArea, items, selection } = fixture();
  const events: string[] = [];
  selection
    .on('beforestart', () => void events.push('beforestart'))
    .on('beforedrag', () => void events.push('beforedrag'))
    .on('start', () => void events.push('start'))
    .on('move', () => void events.push('move'))
    .on('stop', () => void events.push('stop'));

  await userEvent.dragAndDrop(startArea, items[3]);

  expect(selection.getSelection()).toContain(items[3]);
  expect(events).toEqual(expect.arrayContaining(['beforestart', 'beforedrag', 'start', 'move', 'stop']));
  expect(selection.getSelectionArea().isConnected).toBe(false);
});

it('allows beforestart and beforedrag handlers to cancel interaction', async () => {
  const first = fixture();
  first.selection.on('beforestart', () => false);
  await userEvent.dragAndDrop(first.startArea, first.items[0]);
  expect(first.selection.getSelection()).toEqual([]);

  const second = fixture();
  const started = vi.fn();
  second.selection.on('beforedrag', () => false).on('start', started);
  await userEvent.dragAndDrop(second.startArea, second.items[0]);
  expect(started).not.toHaveBeenCalled();
  expect(second.selection.getSelection()).toEqual([]);
});

it('only starts interactions matching configured mouse-button modifiers', () => {
  const { items, selection } = fixture({
    behaviour: { triggers: [{ button: 2, modifiers: ['ctrl'] }] }
  });

  dispatchMouseEvent(items[0], 'mousedown', { button: 2 });
  dispatchMouseEvent(items[0], 'mouseup', { button: 2 });
  expect(selection.getSelection()).toEqual([]);

  dispatchMouseEvent(items[0], 'mousedown', { button: 2, ctrlKey: true });
  dispatchMouseEvent(items[0], 'mouseup', { button: 2, ctrlKey: true });
  expect(selection.getSelection()).toEqual([items[0]]);
});

it('honours numeric and per-axis drag-start thresholds at their boundaries', () => {
  const numeric = fixture({ behaviour: { startThreshold: 10 } });
  const numericBeforeDrag = vi.fn();
  numeric.selection.on('beforedrag', numericBeforeDrag);

  dispatchMouseEvent(numeric.startArea, 'mousedown', { clientX: 100, clientY: 100 });
  dispatchMouseEvent(document, 'mousemove', { clientX: 109, clientY: 100 });
  expect(numericBeforeDrag).not.toHaveBeenCalled();
  dispatchMouseEvent(document, 'mousemove', { clientX: 110, clientY: 100 });
  expect(numericBeforeDrag).toHaveBeenCalledOnce();
  dispatchMouseEvent(document, 'mouseup', { clientX: 110, clientY: 100 });

  numeric.selection.destroy();
  const perAxis = fixture({ behaviour: { startThreshold: { x: 20, y: 5 } } });
  const perAxisBeforeDrag = vi.fn();
  perAxis.selection.on('beforedrag', perAxisBeforeDrag);

  dispatchMouseEvent(perAxis.startArea, 'mousedown', { clientX: 100, clientY: 100 });
  dispatchMouseEvent(document, 'mousemove', { clientX: 119, clientY: 104 });
  expect(perAxisBeforeDrag).not.toHaveBeenCalled();
  dispatchMouseEvent(document, 'mousemove', { clientX: 100, clientY: 105 });
  expect(perAxisBeforeDrag).toHaveBeenCalledOnce();
  dispatchMouseEvent(document, 'mouseup', { clientX: 100, clientY: 105 });
});

it('supports native and visual single-tap selection and can disable it', async () => {
  const native = fixture();
  await userEvent.click(native.items[0]);
  expect(native.selection.getSelection()).toEqual([native.items[0]]);
  await userEvent.click(native.items[0]);
  expect(native.selection.getSelection()).toEqual([]);

  const visual = fixture({ features: { singleTap: { intersect: 'touch' } } });
  visual.overlay.style.pointerEvents = 'auto';
  await userEvent.click(visual.overlay);
  expect(visual.selection.getSelection()).toEqual([visual.items[0]]);

  const disabled = fixture({ features: { singleTap: { allow: false } } });
  await userEvent.click(disabled.items[0]);
  expect(disabled.selection.getSelection()).toEqual([]);
});

it('extends a single-tap selection as a shift range when range is enabled', async () => {
  const enabled = fixture();
  await userEvent.click(enabled.items[0]);
  await userEvent.keyboard('{Shift>}');
  await userEvent.click(enabled.items[3]);
  await userEvent.keyboard('{/Shift}');
  expect(enabled.selection.getSelection()).toEqual(enabled.items);

  const disabled = fixture({ features: { range: false } });
  await userEvent.click(disabled.items[0]);
  await userEvent.keyboard('{Shift>}');
  await userEvent.click(disabled.items[3]);
  await userEvent.keyboard('{/Shift}');
  expect(disabled.selection.getSelection()).toEqual([disabled.items[0], disabled.items[3]]);
});
