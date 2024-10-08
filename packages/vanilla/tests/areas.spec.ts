import { expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createSetup } from './utils/createSetup.ts';

const { fixture } = createSetup();

it('only starts from a configured start area', async () => {
  const { items, selection } = fixture({ startAreas: ['#outside'] });

  await userEvent.click(items[0]);

  expect(selection.getSelection()).toEqual([]);
});

it('only starts inside a configured boundary', async () => {
  const { items, selection } = fixture({ boundaries: ['#outside'] });

  await userEvent.click(items[0]);

  expect(selection.getSelection()).toEqual([]);
});

it('accepts an interaction when its start area is inside its boundary', async () => {
  const { items, selection } = fixture();

  await userEvent.click(items[0]);

  expect(selection.getSelection()).toEqual([items[0]]);
});
