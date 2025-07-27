---
outline: deep
---


<script setup>
import DemoSimple from '../demos/DemoSimple.vue';
import DemoScrollable from '../demos/DemoScrollable.vue';
import DemoShadowRoot from '../demos/DemoShadowRoot.vue';
</script>

# Examples

This page contains various examples of how to use Viselect in different scenarios.

## Basic Usage

The most basic usage involves selecting elements within a container:

<DemoSimple />

> You can find the source code for this example [here](https://github.com/simonwep/viselect/blob/master/docs/demos/DemoSimple.vue).

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container']
});

selection.on('move', ({ store: { changed: { added, removed } } }) => {
  added.forEach(el => el.classList.add('selected'));
  removed.forEach(el => el.classList.remove('selected'));
});
```

## Shadow Root Support

Viselect fully supports shadow DOM. You can pass a `ShadowRoot` instance as the `document` option. This is particularly useful for web components and encapsulated UI elements.

<DemoShadowRoot />

> You can find the source code for this example [here](https://github.com/simonwep/viselect/blob/master/docs/demos/DemoShadowRoot.vue).

### Key Points for Shadow Root Usage:

1. **Pass the ShadowRoot**: Use the `document` option to specify the shadow root
2. **Set startAreas**: Important to specify start areas within the shadow root context
3. **Element Creation**: ShadowRoot is used for querying, but element creation still happens through Document
4. **Event Handling**: Events are properly bound to the shadow root for seamless interaction

```ts
import SelectionArea from '@viselect/vanilla';

// Create a shadow root
const host = document.getElementById('my-host');
const shadowRoot = host.attachShadow({ mode: 'open' });

// Add content to shadow root
shadowRoot.innerHTML = `
  <style>
    .container { display: flex; flex-wrap: wrap; gap: 10px; }
    .item { width: 50px; height: 50px; background: #f0f0f0; }
    .item.selected { background: #4CAF50; }
  </style>
  <div class="container">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
  </div>
`;

// Initialize selection within shadow root
const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container'],
  startAreas: ['.container'], // Important for shadow root context
  document: shadowRoot, // Pass the shadow root here
  selectionAreaClass: 'selection-area'
});

selection.on('move', ({ store: { changed: { added, removed } } }) => {
  added.forEach(el => el.classList.add('selected'));
  removed.forEach(el => el.classList.remove('selected'));
});
```

## Multiple Selection Areas

You can have multiple selection areas on the same page:

```ts
import SelectionArea from '@viselect/vanilla';

// First selection area
const selection1 = new SelectionArea({
  selectables: ['.area1 .item'],
  boundaries: ['.area1'],
  selectionAreaClass: 'selection-area-1'
});

// Second selection area
const selection2 = new SelectionArea({
  selectables: ['.area2 .item'],
  boundaries: ['.area2'],
  selectionAreaClass: 'selection-area-2'
});

// Handle events for both
[selection1, selection2].forEach(selection => {
  selection.on('move', ({ store: { changed: { added, removed } } }) => {
    added.forEach(el => el.classList.add('selected'));
    removed.forEach(el => el.classList.remove('selected'));
  });
});
```

## Custom Triggers

You can customize which mouse buttons trigger selection:

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container'],
  behaviour: {
    // Only right-click triggers selection
    triggers: [2],
    // Or require modifier keys
    // triggers: [{ button: 0, modifiers: ['ctrl'] }]
  }
});
```

## Touch Support

Viselect has built-in touch support for mobile devices:

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container'],
  features: {
    touch: true, // Enable touch support (default: true)
    singleTap: {
      allow: true, // Allow single tap selection
      intersect: 'touch' // Use touch intersection instead of native
    }
  }
});
```

## Scrollable Containers

Viselect automatically handles scrollable containers. Try scrolling and selecting in the demo below:

<DemoScrollable />

> You can find the source code for this example [here](https://github.com/simonwep/viselect/blob/master/docs/demos/DemoScrollable.vue).

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.scrollable-container'],
  behaviour: {
    scrolling: {
      speedDivider: 10, // Scroll speed divisor
      manualSpeed: 750, // Manual scroll speed
      startScrollMargins: { x: 20, y: 20 } // Margins to start scrolling
    }
  }
});
```

## Range Selection

Enable range selection with Shift+Click:

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container'],
  features: {
    range: true // Enable range selection (default: true)
  }
});

selection.on('start', ({ store, event }) => {
  // Clear previous selection unless modifier key is pressed
  if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
    store.stored.forEach(el => el.classList.remove('selected'));
    selection.clearSelection();
  }
});
```

## Custom Overlap Behavior

Control how overlapping selections behave:

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container'],
  behaviour: {
    overlap: 'invert' // 'invert', 'keep', or 'drop'
  }
});
```

## Event Handling

Complete example with all events:

```ts
import SelectionArea from '@viselect/vanilla';

const selection = new SelectionArea({
  selectables: ['.item'],
  boundaries: ['.container']
});

selection
  .on('beforestart', ({ event }) => {
    console.log('About to start selection', event);
    // Return false to cancel selection
  })
  .on('beforedrag', ({ event }) => {
    console.log('About to start dragging', event);
    // Return false to cancel drag
  })
  .on('start', ({ store, event }) => {
    console.log('Selection started', store, event);
  })
  .on('move', ({ store: { changed: { added, removed } } }) => {
    console.log('Selection changed', { added, removed });
    added.forEach(el => el.classList.add('selected'));
    removed.forEach(el => el.classList.remove('selected'));
  })
  .on('stop', ({ store, event }) => {
    console.log('Selection stopped', store, event);
  });
```


