<template>
  <div>
    <h3>Shadow DOM with Transformed Elements</h3>
    <p>This demo shows selection functionality within a Shadow DOM with transformed/zoomed elements. The canvas is zoomed and translated, and elements can overflow outside the canvas boundaries.</p>
    
    <div class="demo-container">
      <div class="test-section">
        <h4>Test 1: Canvas as Boundary</h4>
        <p>Uses the transformed canvas as both start area and boundary.</p>
        <div ref="shadowHost1" class="shadow-host"></div>
        <div class="status" :class="status1.class">{{ status1.message }}</div>
      </div>
      
      <div class="test-section">
        <h4>Test 2: Wrapper as Boundary</h4>
        <p>Uses the wrapper as boundary, allowing selection from both wrapper and canvas.</p>
        <div ref="shadowHost2" class="shadow-host"></div>
        <div class="status" :class="status2.class">{{ status2.message }}</div>
      </div>
      
      <div class="test-section">
        <h4>Test 3: Automatic Defaults</h4>
        <p>No explicit configuration - relies on automatic defaults for shadow DOM.</p>
        <div ref="shadowHost3" class="shadow-host"></div>
        <div class="status" :class="status3.class">{{ status3.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, useTemplateRef, ref} from 'vue';
import SelectionArea from '@viselect/vanilla';

const shadowHost1 = useTemplateRef('shadowHost1');
const shadowHost2 = useTemplateRef('shadowHost2');
const shadowHost3 = useTemplateRef('shadowHost3');

const status1 = ref({ message: 'Initializing...', class: '' });
const status2 = ref({ message: 'Initializing...', class: '' });
const status3 = ref({ message: 'Initializing...', class: '' });

function createShadowDOM(host: HTMLElement, status: any, config: any) {
  // Create shadow root
  const shadowRoot = host.attachShadow({ mode: 'open' });
  
  // Add content to shadow root
  shadowRoot.innerHTML = `
    <style>
      .wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        border-radius: 8px;
      }
      
      .canvas {
        width: 100%;
        height: 100%;
        transform-origin: top left;
        will-change: transform;
        backface-visibility: hidden;
        -webkit-font-smoothing: subpixel-antialiased;
        display: flex;
        flex-direction: column;
        transform: translate(-30px, 20px) scale(1.1);
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 15px;
        user-select: none;
      }
      
      .item {
        width: 35px;
        height: 35px;
        margin: 3px;
        background: #4CAF50;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
        transition: background-color 0.2s;
      }
      
      .item.selected {
        background: #2196F3;
        box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
      }
      
      .item:hover {
        background: #45a049;
      }
      
      .item.selected:hover {
        background: #1976D2;
      }
      
      .selection-area {
        background: rgba(102, 110, 255, 0.16);
        border: 1px solid rgb(62, 99, 221);
        border-radius: 0.15em;
      }
    </style>
    <div class="wrapper">
      <div class="canvas">
        <div class="item" data-id="1">1</div>
        <div class="item" data-id="2">2</div>
        <div class="item" data-id="3">3</div>
        <div class="item" data-id="4">4</div>
        <div class="item" data-id="5">5</div>
        <div class="item" data-id="6">6</div>
        <div class="item" data-id="7">7</div>
        <div class="item" data-id="8">8</div>
        <div class="item" data-id="9">9</div>
        <div class="item" data-id="10">10</div>
      </div>
    </div>
  `;
  
  // Get elements
  const wrapper = shadowRoot.querySelector('.wrapper');
  const canvas = shadowRoot.querySelector('.canvas');
  const items = shadowRoot.querySelectorAll('.item');
  
  // Initialize selection area
  const selection = new SelectionArea({
    selectables: ['[data-id]'],
    document: shadowRoot,
    selectionAreaClass: 'selection-area',
    ...config
  });
  
  // Event handlers
  selection.on('start', ({ store, event }) => {
    if (!event?.ctrlKey && !event?.metaKey && !event?.shiftKey) {
      store.stored.forEach(el => el.classList.remove('selected'));
      selection.clearSelection();
    }
  });
  
  selection.on('move', ({ store: { changed: { added, removed } } }) => {
    added.forEach(el => el.classList.add('selected'));
    removed.forEach(el => el.classList.remove('selected'));
  });
  
  selection.on('stop', ({ store }) => {
    const selectedCount = store.stored.length;
    status.message = `Selection complete! ${selectedCount} items selected.`;
    status.class = 'success';
  });
  
  // Test status
  status.message = 'Shadow DOM created successfully. Try selecting items by clicking and dragging!';
  status.class = 'success';
  
  return { selection, wrapper, canvas, items };
}

onMounted(() => {
  // Test 1: Canvas as start area and boundary
  if (shadowHost1.value) {
    createShadowDOM(shadowHost1.value, status1, {
      startAreas: ['.canvas'],
      boundaries: ['.canvas']
    });
  }
  
  // Test 2: Wrapper as boundary, canvas as start area
  if (shadowHost2.value) {
    createShadowDOM(shadowHost2.value, status2, {
      startAreas: ['.canvas'],
      boundaries: ['.wrapper']
    });
  }
  
  // Test 3: Automatic defaults
  if (shadowHost3.value) {
    createShadowDOM(shadowHost3.value, status3, {
      // No startAreas or boundaries specified - uses automatic defaults
    });
  }
});
</script>

<style scoped>
.demo-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.test-section {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-section h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.test-section p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.shadow-host {
  width: 100%;
  height: 200px;
  border: 2px solid #ddd;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  margin-bottom: 10px;
}

.status {
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.3;
}

.status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style> 