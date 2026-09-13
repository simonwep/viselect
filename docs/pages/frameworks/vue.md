# Using Viselect with Vue

<!--@include: ../../parts/custom-integration-note.md-->

## Source Code

You can find the source code for this component [here](https://github.com/simonwep/viselect/blob/master/packages/vue/src/SelectionArea.vue).
You can use it as template for your own implementation.

## Installation

To use Viselect with Vue, install its vue package with:

::: code-group

```sh [npm]
$ npm install @viselect/vue
```

```sh [pnpm]
$ pnpm install @viselect/vue
```

```sh [yarn]
$ yarn add @viselect/vue
```

:::

## Usage

You can use Viselect in your Vue project by importing the `SelectionArea` component from the `@viselect/vue` package.

> [!TIP]
> All options are exposed as `options` prop, events can be passed as props suffixed with `on`.
> The options are a one-to-one mapping of the original options describe [here](../api-reference.md#selectionoptions)!

> [!NOTE]
> Events are handled using props because you can’t return a value in events synchronously.

```vue [App.vue]
<template>
  <SelectionArea class="container"
                 selectionAreaClass="selection-area"
                 :options="{ selectables: '.selectable' }"
                 :onMove="onMove"
                 :onStart="onStart">
    <div v-for="id of 42"
         class="selectable"
         :key="id" 
         :data-key="id"
         :class="{ selected: selected.has(id) }"/>
  </SelectionArea>
</template>

<script lang="ts" setup>
import { SelectionArea, SelectionEvent } from '@viselect/vue';
import { reactive } from 'vue';

const selected = reactive<Set<number>>(new Set());

const extractIds = (els: Element[]): number[] => {
  return els.map(v => v.getAttribute('data-key'))
      .filter(Boolean)
      .map(Number);
};

const onStart = ({ event, selection }: SelectionEvent) => {
  if (!event?.ctrlKey && !event?.metaKey) {
    selection.clearSelection();
    selected.clear();
  }
};

const onMove = ({ store: { changed: { added, removed } } }: SelectionEvent) => {
  extractIds(added).forEach(id => selected.add(id));
  extractIds(removed).forEach(id => selected.delete(id));
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  border: 1px dashed #4f5276;
  border-radius: 15px;
  padding: 15px;
  margin: 15px 0;
  user-select: none;
}

.container div {
  height: 50px;
  width: 50px;
  margin: 3px;
  background: rgba(66, 68, 90, 0.075);
  border-radius: 10px;
  cursor: pointer;
}

.container.green div.selected {
  background: linear-gradient(45deg, #78b2ff, #218ad9);
}

.container.blue div.selected {
  background: linear-gradient(45deg, #9e91ef, #5c51b4);
}

.selection-area {
  background: rgba(46, 115, 252, 0.11);
  border: 1px solid rgba(98, 155, 255, 0.85);
  border-radius: 0.15em;
}
</style>
```

## API

### Props

The Vue component accepts one required prop for the selection options:

| Prop | Type |
| --- | --- |
| `options` | `Omit<PartialSelectionOptions, 'boundaries'>` |

`options` contains the following optional properties: `container: Quantify<string \| HTMLElement>`, `document: Document`, `selectables: Quantify<string>`, `startAreas: Quantify<string \| HTMLElement>`, `selectionAreaClass: string`, `selectionContainerClass: string`, `behaviour: DeepPartial<Behaviour>`, and `features: DeepPartial<Features>`.

The component supplies its root `<div>` as `boundaries`, so `boundaries` cannot be set through `options`.
    Standard Vue fallthrough attributes such as `class`, `style`, `id`, ARIA attributes, and native DOM listeners can be placed directly on `<SelectionArea>`.

### Events

The component emits the following events. Each event receives a `SelectionEvent`, except `init`, which receives the initialized `SelectionArea` instance.

| Event | Handler type |
| --- | --- |
| `before-start` | `(event: SelectionEvent) => void` |
| `before-drag` | `(event: SelectionEvent) => void` |
| `start` | `(event: SelectionEvent) => void` |
| `move` | `(event: SelectionEvent) => void` |
| `stop` | `(event: SelectionEvent) => void` |
| `init` | `(selection: SelectionArea) => void` |

In contrast to the vanilla, React, and Preact integrations, Vue event handlers cannot return a value synchronously.
Therefore, returning `false` from `before-start` or `before-drag` **does not cancel the selection**.

The option-related types (`PartialSelectionOptions`, `Behaviour`, `Features`, `DeepPartial`, and `Quantify`) and `SelectionEvent` are re-exported from `@viselect/vue`.
See the [API reference](../api-reference.md) for their definitions.


## Composables

It's possible to get the current `SelectionArea`-instance via [template refs](https://vuejs.org/guide/essentials/template-refs.html).

```vue
<template>
  <SelectionArea 
    class="container"
    :options="{selectables: '.selectable'}"
    ref="selectionAreaRef"
  >
    <div v-for="id of 42"
         class="selectable"
         :key="id" 
         :data-key="id"
         :class="{selected: selected.has(id)}"
    />
  </SelectionArea>
</template>

<script lang="ts" setup>
import { SelectionArea } from '@viselect/vue';
import { useTemplateRef, reactive, watchEffect } from 'vue';

const selected = reactive<Set<number>>(new Set());
const selectionAreaRef = useTemplateRef<InstanceType<typeof SelectionArea>>();

watchEffect(() => {
  // log selection instance
  console.log(selectionAreaRef.value?.selection)
});
</script>
```
