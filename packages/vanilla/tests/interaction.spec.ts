import { expect, test } from './utils/setup.ts';

type TestWindow = Window & {
  events?: string[];
  started?: boolean;
  beforeDrag?: number;
};

test('emits the drag lifecycle and maintains the selected elements', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => {
    const browserWindow = window as TestWindow;
    browserWindow.events = [];

    for (const name of ['beforestart', 'beforedrag', 'start', 'move', 'stop'] as const) {
      instance.on(name, () => browserWindow.events!.push(name));
    }
  });

  await selection.drag(selection.startArea, selection.items.nth(3));
  expect(await selection.selectedIndexes()).toContain('3');
  expect(await selection.run(() => (window as TestWindow).events)).toEqual(
    expect.arrayContaining(['beforestart', 'beforedrag', 'start', 'move', 'stop'])
  );

  expect(await selection.isAreaMounted()).toBe(false);
});

test('allows beforestart and beforedrag handlers to cancel interaction', async ({ selection }) => {
  await selection.setup();
  await selection.run((instance) => instance.on('beforestart', () => false));
  await selection.drag(selection.startArea, selection.items.nth(0));
  expect(await selection.selectedCount()).toBe(0);

  await selection.setup();
  await selection.run((instance) => {
    const browserWindow = window as TestWindow;
    browserWindow.started = false;
    instance.on('beforedrag', () => false).on('start', () => (browserWindow.started = true));
  });

  await selection.drag(selection.startArea, selection.items.nth(0));
  expect(await selection.run(() => (window as TestWindow).started)).toBe(false);
  expect(await selection.selectedCount()).toBe(0);
});

test('only starts interactions matching configured mouse-button modifiers', async ({ selection }) => {
  await selection.setup({ behaviour: { triggers: [{ button: 2, modifiers: ['ctrl'] }] } });
  await selection.items.nth(0).click({ button: 'right' });
  expect(await selection.selectedCount()).toBe(0);

  await selection.items.nth(0).click({ button: 'right', modifiers: ['Control'] });
  expect(await selection.selectedIndexes()).toEqual(['0']);
});

test('honours numeric and per-axis drag-start thresholds at their boundaries', async ({ page, selection }) => {
  await selection.setup({ behaviour: { startThreshold: 10 } });
  await selection.run((instance) => {
    const browserWindow = window as TestWindow;
    browserWindow.beforeDrag = 0;
    instance.on('beforedrag', () => {
      browserWindow.beforeDrag!++;
    });
  });

  const numericStart = await selection.startArea.boundingBox();

  if (!numericStart) throw new Error('Missing start area');
  await page.mouse.move(numericStart.x + 10, numericStart.y + 10);
  await page.mouse.down();
  await page.mouse.move(numericStart.x + 19, numericStart.y + 10);
  expect(await selection.run(() => (window as TestWindow).beforeDrag)).toBe(0);

  await page.mouse.move(numericStart.x + 20, numericStart.y + 10);
  expect(await selection.run(() => (window as TestWindow).beforeDrag)).toBe(1);

  await page.mouse.up();

  await selection.setup({ behaviour: { startThreshold: { x: 20, y: 5 } } });
  await selection.run((instance) => {
    const browserWindow = window as TestWindow;
    browserWindow.beforeDrag = 0;
    instance.on('beforedrag', () => {
      browserWindow.beforeDrag!++;
    });
  });

  const perAxisStart = await selection.startArea.boundingBox();
  if (!perAxisStart) throw new Error('Missing start area');

  await page.mouse.move(perAxisStart.x + 10, perAxisStart.y + 10);
  await page.mouse.down();
  await page.mouse.move(perAxisStart.x + 19, perAxisStart.y + 14);

  expect(await selection.run(() => (window as TestWindow).beforeDrag)).toBe(0);
  await page.mouse.move(perAxisStart.x + 10, perAxisStart.y + 15);

  expect(await selection.run(() => (window as TestWindow).beforeDrag)).toBe(1);
});

test('supports native and visual single-tap selection and can disable it', async ({ selection }) => {
  await selection.setup();
  await selection.items.nth(0).dblclick();
  expect(await selection.selectedCount()).toBe(0);

  await selection.setup({ features: { singleTap: { intersect: 'touch' } } });
  await selection.overlay.evaluate((element) => ((element as HTMLElement).style.pointerEvents = 'auto'));
  await selection.overlay.click();
  expect(await selection.selectedIndexes()).toEqual(['0']);

  await selection.setup({ features: { singleTap: { allow: false } } });
  await selection.items.nth(0).click();
  expect(await selection.selectedCount()).toBe(0);
});

test('extends a single-tap selection as a shift range when range is enabled', async ({ page, selection }) => {
  await selection.setup();
  await selection.items.nth(0).click();
  await page.keyboard.down('Shift');
  await selection.items.nth(3).click();
  await page.keyboard.up('Shift');
  expect(await selection.selectedIndexes()).toEqual(['0', '1', '2', '3']);

  await selection.setup({ features: { range: false } });
  await selection.items.nth(0).click();
  await page.keyboard.down('Shift');
  await selection.items.nth(3).click();
  await page.keyboard.up('Shift');
  expect(await selection.selectedIndexes()).toEqual(['0', '3']);
});
