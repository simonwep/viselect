import { expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createSetup } from './utils/createSetup.ts';

const { fixture } = createSetup();

it('uses the real scrollable boundary for browser dragging and clips the selection area', async () => {
  const { boundary, items, selection } = fixture({
    _itemCount: 12,
    selectionAreaClass: 'test-area',
    selectionContainerClass: 'test-clip'
  });

  boundary.classList.add('scrollable');

  expect(boundary.scrollHeight).toBeGreaterThan(boundary.clientHeight);
  await userEvent.dragAndDrop(items[0], items[3]);

  expect(selection.getSelectionArea().classList).toContain('test-area');
  expect(selection.getSelectionArea().parentElement?.classList).toContain('test-clip');

  await userEvent.wheel(boundary, { delta: { y: 160 } });
  expect(boundary.scrollTop).toBeGreaterThan(0);
});

it('does not mount an area for a cancelled selection', () => {
  const { selection } = fixture();
  selection.cancel();

  expect(selection.getSelectionArea().isConnected).toBe(false);
});
