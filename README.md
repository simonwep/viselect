<h3 align="center">
  <img alt="Logo" src="https://user-images.githubusercontent.com/30767528/123517467-622b0f80-d6a1-11eb-9bf3-abcb4928a89e.png" width="350"/>
</h3>

<h3 align="center">
  Visual dom-selection library
</h3>

<h6 align="center">
  <a href="https://simonwep.github.io/viselect/">Documentation</a> /
  <a href="https://simonwep.github.io/viselect/pages/quickstart.html">Quickstart</a> /
  <a href="https://simonwep.github.io/viselect/pages/examples.html">Examples</a>
</h6>

<p align="center">
  <a href="https://choosealicense.com/licenses/mit/"><img
    alt="License MIT"
    src="https://img.shields.io/badge/license-MIT-ae15cc.svg"></a>
  <img alt="No dependencies"
    src="https://img.shields.io/badge/dependencies-none-8115cc.svg">
  <a href="https://github.com/sponsors/Simonwep"><img
    alt="Support me"
    src="https://img.shields.io/badge/github-support-6a15cc.svg"></a>
  <img alt="version" src="https://img.shields.io/github/lerna-json/v/simonwep/viselect?color=%233d24c9&label=version">
  <a href="https://www.buymeacoffee.com/aVc3krbXQ"><img
    alt="Buy me a coffee"
    src="https://img.shields.io/badge/%F0%9F%8D%BA-buy%20me%20a%20beer-%23FFDD00"></a>
  <a href="https://github.com/simonwep/viselect/actions/workflows/main.yml"><img
    alt="Build Status"
    src="https://github.com/simonwep/viselect/actions/workflows/main.yml/badge.svg"></a>
  <a href="https://github.com/simonwep/viselect/actions/workflows/deploy.yml"><img
    alt="Docs"
    src="https://github.com/simonwep/viselect/actions/workflows/deploy.yml/badge.svg"></a>
  <img alt="gzip size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@viselect/vanilla/dist/viselect.umd.js?compression=gzip">
  <img alt="brotli size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/@viselect/vanilla/dist/viselect.umd.js?compression=brotli">
  <a href="https://v3.vuejs.org"><img
    alt="Vue support"
    src="https://img.shields.io/badge/✔-vue-%2340B581"></a>
  <a href="https://preactjs.com/"><img
    alt="Preact support"
    src="https://img.shields.io/badge/✔-preact-%236337B1"></a>
  <a href="https://reactjs.org"><img
    alt="React support"
    src="https://img.shields.io/badge/✔-react-%2359D7FF"></a>
</p>

<p align="center">
  <img height="100" alt="demo gif" src="https://github.com/user-attachments/assets/7700280d-f388-4c49-bce6-391fb5e338e7">
</p>

### Forked Change

viselect now supports virtual scrolling. You can customize scroll position retrieval and setting methods through the `scrollController` option:

```js
import SelectionArea from '@knotx/viselect';

// Create a selection area with virtual scrolling support
const selection = new SelectionArea({
  // Other options...
  
  // Custom scroll controller
  scrollController: {
    // Custom method to get scroll position
    getScrollPosition: (element) => {
      // If element is a virtual scroll container, return virtual scroll position
      if (element.classList.contains('virtual-scroll-container')) {
        return {
          x: yourVirtualScrollInstance.scrollLeft,
          y: yourVirtualScrollInstance.scrollTop
        };
      }
      
      // Otherwise return native scroll position
      return {
        x: element.scrollLeft,
        y: element.scrollTop
      };
    },
    
    // Custom method to set scroll position
    setScrollPosition: (element, position) => {
      // If element is a virtual scroll container, set virtual scroll position
      if (element.classList.contains('virtual-scroll-container')) {
        if (position.x !== undefined) {
          yourVirtualScrollInstance.scrollLeft = position.x;
        }
        if (position.y !== undefined) {
          yourVirtualScrollInstance.scrollTop = position.y;
        }
        return;
      }
      
      // Otherwise set native scroll position
      if (position.x !== undefined) {
        element.scrollLeft = position.x;
      }
      if (position.y !== undefined) {
        element.scrollTop = position.y;
      }
    },
    
    // Custom method to get scroll size (total scrollable area)
    getScrollSize: (element) => {
      if (element.classList.contains('virtual-scroll-container')) {
        return {
          width: yourVirtualScrollInstance.scrollWidth,
          height: yourVirtualScrollInstance.scrollHeight
        };
      }
      
      return {
        width: element.scrollWidth,
        height: element.scrollHeight
      };
    },
    
    // Custom method to get client size (visible area)
    getClientSize: (element) => {
      if (element.classList.contains('virtual-scroll-container')) {
        return {
          width: yourVirtualScrollInstance.clientWidth,
          height: yourVirtualScrollInstance.clientHeight
        };
      }
      
      return {
        width: element.clientWidth,
        height: element.clientHeight
      };
    }
  }
});
```

### Features 🤘

* 🌟 Modern bundle
* 🔩 Ultra tiny (~4kb)
* 👌 Simple usage
* ⚡ Highly optimized
* ✔ Zero dependencies
* 📱 Mobile / touch support
* 🖱 Vertical and horizontal scroll support
* 💪 Battle tested (over 6 years old and used in many apps)

### Getting started

Head over to [the documentation](https://simonwep.github.io/viselect) to get started 🚀

### You want to contribute?

That's awesome! Check out the [contribution guidelines](./.github/CONTRIBUTING.md) to get started :)
