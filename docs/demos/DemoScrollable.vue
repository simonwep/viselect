<template>
  <div
    ref="root"
    :class="[$style.container, $style.purple]"
  />
</template>

<script setup lang="ts">
import {useCssModule, onMounted, useTemplateRef} from 'vue';
import SelectionArea from '@viselect/vanilla';

const styles = useCssModule();
const root = useTemplateRef('root');

onMounted(() => {
  const container = root.value;
  const boxes = 300;

  for (let i = 0; i < boxes; i++) {
    const div = document.createElement('div');;
    container.appendChild(div);
  }

  const selection = new SelectionArea({
    selectables: [`.${styles.container} > div`],
    boundaries: [`.${styles.container}`],
    selectionAreaClass: styles.selectionArea
  }).on('start', ({store, event}) => {
    if (!event.ctrlKey && !event.metaKey) {
      store.stored.forEach(el => el.classList.remove(styles.selected));
      selection.clearSelection();
    }
  }).on('move', ({store: {changed: {added, removed}}}) => {
    added.forEach(el => el.classList.add(styles.selected));
    removed.forEach(el => el.classList.remove(styles.selected));
  });
});
</script>

<style module>
.container {
  display: grid;
  grid-template: repeat(10, 1fr) / repeat(30, 1fr);
  border-radius: 15px;
  padding: 10px;
  margin: 15px 0;
  user-select: none;
  max-height: 300px;
  overflow: auto;
}

.container div {
  margin: 4px;
  width: 25px;
  height: 25px;
  background: rgba(66, 68, 90, 0.075);
  border-radius: 5px;
  cursor: pointer;
}

.container.purple {
  border: 2px dashed var(--vp-c-purple-1);
}

.container.purple div.selected {
  background: var(--vp-c-purple-2);
}

.selectionArea {
  background: var(--vp-c-indigo-soft);
  border: 1px solid var(--vp-c-indigo-3);
  border-radius: 3px;
}
</style>
