import { expect, test } from './utils/setup.ts';

test('only starts from a configured start area', async ({ selection }) => {
  await selection.setup({ startAreas: ['#outside'] });
  await selection.items.nth(0).click();

  expect(await selection.selectedCount()).toBe(0);
});

test('only starts inside a configured boundary', async ({ selection }) => {
  await selection.setup({ boundaries: ['#outside'] });
  await selection.items.nth(0).click();

  expect(await selection.selectedCount()).toBe(0);
});

test('accepts an interaction when its start area is inside its boundary', async ({ selection }) => {
  await selection.setup();
  await selection.items.nth(0).click();

  expect(await selection.selectedIndexes()).toEqual(['0']);
});
