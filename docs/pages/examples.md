---
outline: deep
---


<script setup>
import DemoSimple from '../demos/DemoSimple.vue';
import DemoScrollable from '../demos/DemoScrollable.vue';
</script>

# Examples

> [!TIP]
> This document provides a few examples of how this library can be used in practice.
> Head over to [Quickstart](./quickstart.md) to get started!

### Simple Selection

A single, simple box with a standard behaviour as you know it from your trusty file explorer.
Press `Ctrl` / `Cmd` to select multiple items, or deselect items by clicking on them again.
Press `Shift` to select a range of items after selecting one ore more before.

<DemoSimple />

> You can find the source code for this example [here](https://github.com/simonwep/viselect/blob/master/docs/demos/DemoSimple.vue).
> Under [Quickstart](./quickstart.md) you can find a step-by-step guide on how to create this example from scratch!

### Scrollable Container

A container that can be scrolled in both directions.
The selection area will automatically adjust to the scroll position and size of the container.

<DemoScrollable />

> You can find the source code for this example [here](https://github.com/simonwep/viselect/blob/master/docs/demos/DemoScrollable.vue)


