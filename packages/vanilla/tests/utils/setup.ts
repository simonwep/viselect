import { expect, test as base, type Locator, type Page } from '@playwright/test';
import type SelectionArea from '../../src';
import type { PartialSelectionOptions } from '../../src';

declare global {
  interface Window {
    selection?: SelectionArea;
  }
}

type FixtureOptions = PartialSelectionOptions & { itemCount?: number };

type BrowserFixtureOptions = Record<string, unknown>;

export class SelectionFixture {
  private readonly page: Page;

  public readonly boundary: Locator;
  public readonly startArea: Locator;
  public readonly overlay: Locator;
  public readonly outside: Locator;
  public readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.boundary = this.page.locator('#boundary');
    this.startArea = this.page.locator('#start-area');
    this.overlay = this.page.locator('#tap-overlay');
    this.outside = this.page.locator('#outside');
    this.items = this.page.locator('.selectable');
  }

  async setup({ itemCount = 4, ...options }: FixtureOptions = {}): Promise<void> {
    await this.page.goto('/tests/utils/setup.html');

    await this.page.evaluate(
      async ({ options, itemCount }: { options: BrowserFixtureOptions; itemCount: number }) => {
        // Vite resolves this source module when the callback executes in the browser.
        // @ts-expect-error Vite serves this source module at runtime.
        const Area = (await import('/src/index.ts')).default as typeof SelectionArea;
        const startArea = document.querySelector<HTMLElement>('#start-area')!;

        for (let index = 0; index < itemCount; index++) {
          const item = document.createElement('div');
          item.className = 'selectable';
          item.dataset.index = String(index);
          item.textContent = String(index);
          startArea.appendChild(item);
        }

        const selection = new Area({
          startAreas: ['#start-area'],
          boundaries: ['#boundary'],
          selectables: ['.selectable'],
          behaviour: { startThreshold: 0 },
          ...(options as PartialSelectionOptions)
        });

        selection.on('move', ({ store: { changed } }) => {
          changed.added.forEach((element) => element.classList.add('selected'));
          changed.removed.forEach((element) => element.classList.remove('selected'));
        });

        window.selection = selection;
      },
      { options: options as BrowserFixtureOptions, itemCount }
    );
  }

  run<T>(callback: (selection: SelectionArea) => T): Promise<T> {
    return this.page.evaluate(
      ({ source }) => {
        const callback = eval(`(${source})`) as (selection: SelectionArea) => T;
        return callback(window.selection!);
      },
      { source: callback.toString() }
    );
  }

  selectedIndexes(): Promise<string[]> {
    return this.run((selection) => selection.getSelection().map((element) => (element as HTMLElement).dataset.index!));
  }

  selectedCount(): Promise<number> {
    return this.run((selection) => selection.getSelection().length);
  }

  isAreaMounted(): Promise<boolean> {
    return this.run((selection) => selection.getSelectionArea().isConnected);
  }

  async drag(from: Locator, to: Locator, fromEdge = false): Promise<void> {
    if (!fromEdge) {
      await from.dragTo(to, { steps: 60 });
      return;
    }

    const start = await from.boundingBox();
    const end = await to.boundingBox();

    if (!start || !end) {
      throw new Error('Could not measure drag targets');
    }

    await this.page.mouse.move(start.x + start.width, start.y + 1, { steps: 60 });
    await this.page.mouse.down();
    await this.page.mouse.move(end.x + 4, end.y + 4, { steps: 60 });
    await this.page.mouse.up();
  }
}

export const test = base.extend<{ selection: SelectionFixture }>({
  selection: async ({ page }, use) => use(new SelectionFixture(page))
});

export { expect };
