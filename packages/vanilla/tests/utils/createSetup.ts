import SelectionArea from '../../src';
import type { PartialSelectionOptions } from '../../src';
import template from './template.html?raw';
import { afterEach } from 'vitest';

type Fixture = {
  boundary: HTMLElement;
  startArea: HTMLElement;
  overlay: HTMLElement;
  items: HTMLElement[];
  selection: SelectionArea;
};

type FixtureOptions = PartialSelectionOptions & {
  _itemCount?: number;
};

const createFixture = (options: PartialSelectionOptions = {}, itemCount = 4): Fixture => {
  document.body.innerHTML = template;

  const boundary = document.querySelector<HTMLElement>('#boundary')!;
  const startArea = document.querySelector<HTMLElement>('#start-area')!;
  const overlay = document.querySelector<HTMLElement>('#tap-overlay')!;

  const items = Array.from({ length: itemCount }, (_, index) => {
    const item = document.createElement('button');
    item.className = 'selectable';
    item.dataset.index = String(index);
    item.textContent = String(index);
    startArea.appendChild(item);
    return item;
  });

  const selection = new SelectionArea({
    startAreas: ['#start-area'],
    boundaries: ['#boundary'],
    selectables: ['.selectable'],
    behaviour: { startThreshold: 0 },
    ...options
  });

  return { boundary, startArea, overlay, items, selection };
};

export const createSetup = () => {
  const selections: SelectionArea[] = [];

  afterEach(() => {
    selections.forEach((selection) => selection.destroy());
    document.body.replaceChildren();
  });

  const fixture = ({ _itemCount = 4, ...options }: FixtureOptions = {}) => {
    const result = createFixture(options, _itemCount);
    selections.push(result.selection);
    return result;
  };

  return { fixture };
};
