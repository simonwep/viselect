import { expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createSetup } from './utils/createSetup.ts';

const { fixture } = createSetup();

it.each([
  ['touch', true],
  ['center', false],
  ['cover', false]
] as const)('uses %s intersection mode for a browser drag', async (intersect, selected) => {
  const { items, selection } = fixture({
    behaviour: { intersect }
  });

  await userEvent.dragAndDrop(items[0], items[3]);

  expect(selection.getSelection().includes(items[1])).toBe(selected);
});

it.each([
  ['invert', false],
  ['drop', false],
  ['keep', true]
] as const)('applies the %s overlap mode to an already-stored element', async (overlap, keepsStoredElement) => {
  const { startArea, items, selection } = fixture({
    behaviour: { overlap }
  });
  selection.select(items[0], true);

  await userEvent.dragAndDrop(startArea, items[0]);

  expect(selection.getSelection()).toEqual(keepsStoredElement ? items : items.slice(1));
});
