import { expect, test } from './utils/setup.ts';

for (const [intersect, selected] of [
  ['touch', true],
  ['center', false],
  ['cover', false]
] as const) {
  test(`uses ${intersect} intersection mode for a browser drag`, async ({ selection }) => {
    await selection.setup({ behaviour: { intersect } });
    await selection.drag(selection.items.nth(0), selection.items.nth(3), true);
    const selectedIndexes = await selection.selectedIndexes();
    if (selected) {
      expect(selectedIndexes).toContain('1');
    } else {
      expect(selectedIndexes).not.toContain('1');
    }
  });
}

for (const [overlap, keepsStoredElement] of [
  ['invert', false],
  ['drop', false],
  ['keep', true]
] as const) {
  test(`applies the ${overlap} overlap mode to an already-stored element`, async ({ selection }) => {
    await selection.setup({ behaviour: { overlap } });
    await selection.run((instance) => instance.select(document.querySelector('.selectable')!, true));
    expect(await selection.selectedIndexes()).toEqual(['0']);

    await selection.drag(selection.startArea, selection.items.nth(0));
    expect(await selection.selectedIndexes()).toEqual(keepsStoredElement ? ['0', '1', '2', '3'] : ['1', '2', '3']);
  });
}
