import { expect, test } from './utils/setup.ts';

test('selects all elements when fast scrolling', async ({ page, selection }) => {
  await selection.setup({ itemCount: 12 });

  await selection.boundary.evaluate((element) => element.classList.add('scrollable'));
  expect(await selection.boundary.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);

  const start = await selection.items.nth(0).boundingBox();
  const end = await selection.items.nth(3).boundingBox();

  if (!start || !end) throw new Error('Could not measure drag targets');
  await page.mouse.move(start.x + 5, start.y + 5);
  await page.mouse.down();
  await page.mouse.move(start.x + 10, 500, { steps: 60 });

  await expect
    .poll(() =>
      selection.boundary.evaluate((element) => element.scrollTop + element.clientHeight >= element.scrollHeight)
    )
    .toBe(true);

  await page.mouse.up();
  expect(await selection.selectedCount()).toBe(6);
});

test('does not mount an area for a cancelled selection', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => instance.cancel());
  expect(await selection.isAreaMounted()).toBe(false);
});
