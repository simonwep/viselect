import { expect, test } from './utils/setup.ts';

test('selects and deselects elements without duplicates and reports manual changes', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => instance.select([document.querySelector('.selectable')!, '.selectable']));
  expect(await selection.selectedIndexes()).toEqual(['0', '1', '2', '3']);

  await selection.run((instance) =>
    instance.deselect([document.querySelectorAll('.selectable')[1], document.querySelectorAll('.selectable')[3]])
  );
  expect(await selection.selectedIndexes()).toEqual(['0', '2']);

  await selection.run((instance) => instance.clearSelection());
  expect(await selection.selectedCount()).toBe(0);

  await expect(selection.items).toHaveCount(4);
});

test('supports quiet manual updates and preserves stored values when requested', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => instance.select(document.querySelector('.selectable')!, true));
  await selection.run((instance) => instance.clearSelection(false, true));

  expect(await selection.selectedIndexes()).toEqual(['0']);
});

test('can be disabled, re-enabled, and destroyed without retaining listeners', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => instance.disable());
  await selection.items.nth(0).click();
  expect(await selection.selectedCount()).toBe(0);

  await selection.run((instance) => instance.enable());
  await selection.items.nth(0).click();
  expect(await selection.selectedIndexes()).toEqual(['0']);

  await selection.run((instance) => instance.destroy());
  await selection.boundary.click();
  expect(await selection.selectedIndexes()).toEqual(['0']);
});
