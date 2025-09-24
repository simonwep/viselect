<template>
  <div>
    <h3>Shadow DOM Selection</h3>
    <p>This demo shows selection functionality within a Shadow DOM. The orange items are inside a shadow root.</p>
    <div ref="shadowHost" class="shadow-host"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, useTemplateRef} from 'vue';
import SelectionArea from '@viselect/vanilla';

const shadowHost = useTemplateRef('shadowHost');

onMounted(() => {
  // Create shadow root
  const host = shadowHost.value;
  const shadowRoot = host.attachShadow({ mode: 'open' });
  
  // Add content to shadow root
  shadowRoot.innerHTML = `
    <style>
      .container { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 10px; 
        padding: 20px; 
        border: 2px solid #ff9800; 
        border-radius: 15px;
        user-select: none;
      }
      .item { 
        width: 50px; 
        height: 50px; 
        background: #fff3e0; 
        border: 1px solid #ffcc02; 
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
      }
      .item.selected { 
        background: #ff9800; 
        color: white;
      }
      .selection-area { 
        background: rgba(255, 152, 0, 0.2); 
        border: 1px solid #ff9800; 
        border-radius: 4px;
      }
    </style>
    <div class="container">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
      <div class="item">7</div>
      <div class="item">8</div>
      <div class="item">9</div>
      <div class="item">10</div>
      <div class="item">11</div>
      <div class="item">12</div>
    </div>
  `;
  
  // Initialize selection within shadow root
  const selection = new SelectionArea({
    selectables: ['.item'],
    boundaries: ['.container'],
    startAreas: ['.container'], // Important for shadow root context
    container: '.container',
    document: shadowRoot, // Pass the shadow root here
    selectionAreaClass: 'selection-area'
  });
  
  // Set up event handlers
  selection.on('start', ({ store, event }) => {
    console.log('Shadow root selection started');
    // Clear previous selection unless modifier key is pressed
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      store.stored.forEach(el => el.classList.remove('selected'));
      selection.clearSelection();
    }
  });
  
  selection.on('move', ({ store: { changed: { added, removed } } }) => {
    console.log('Shadow root selection moved:', { added: added.length, removed: removed.length });
    added.forEach(el => el.classList.add('selected'));
    removed.forEach(el => el.classList.remove('selected'));
  });
  
  selection.on('stop', () => {
    console.log('Shadow root selection stopped');
  });
});
</script>

<style scoped>
.shadow-host {
  margin: 20px 0;
  min-height: 200px;
}

h3 {
  margin-bottom: 10px;
  color: var(--vp-c-text-1);
}

p {
  margin-bottom: 15px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style> 