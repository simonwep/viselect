/* eslint-disable no-console */
import SelectionArea, { Coordinates } from '../src';
import './index.css';

const boxes: [string, number][] = [
    ['section.green', 42],
    ['section.blue', 42],
    ['section.red', 252],
    ['section.gold > .content', 252]
];

for (const [sel, items] of boxes) {
    const container = document.querySelector(sel);

    for (let i = 0; i < items; i++) {
        container?.appendChild(document.createElement('div'));
    }
}

const selection = new SelectionArea({
    selectables: ['body > section:not(.gold) > div'],
    boundaries: ['body > section:not(.gold)']
}).on('start', ({store, event}) => {

    if (!(event as MouseEvent).ctrlKey && !(event as MouseEvent).metaKey) {

        for (const el of store.stored) {
            el.classList.remove('selected');
        }

        selection.clearSelection();
    }

}).on('move', ({store: {changed: {added, removed}}}) => {

    for (const el of added) {
        el.classList.add('selected');
    }

    for (const el of removed) {
        el.classList.remove('selected');
    }
});


selection
    .on('beforestart', (evt) => console.log('beforestart', evt))
    .on('start', (evt) => console.log('start', evt))
    .on('beforedrag', (evt) => console.log('beforedrag', evt))
    .on('move', (evt) => console.log('move', evt))
    .on('stop', (evt) => console.log('stop', evt));


const visualScroll = {x: 0, y: 0};    
const visualScrollSelection = new SelectionArea({
    selectables: ['body > section.gold > .content > div'],
    boundaries: ['body > section.gold'],
    scrollController: {
        getScrollPosition: () => {
            return visualScroll;
        },
        setScrollPosition: (element: Element, position: Partial<Coordinates>) => {
            const {x, y} = position;

            if (x !== undefined) {
                visualScroll.x = x;
            }
            if (y !== undefined) {
                visualScroll.y = y;
            }

            const content = (element as HTMLElement).querySelector('.content');
            
            if (content) {
                (content as HTMLElement).style.transform = `translate(${-visualScroll.x}px, ${-visualScroll.y}px)`;
            }
        },
        getScrollSize: (element) => {
            const content = (element as HTMLElement).querySelector('.content');
            return {width: (content as HTMLElement).scrollWidth, height: (content as HTMLElement).scrollHeight};
        },
        getClientSize: (element) => {
            return {width: (element as HTMLElement).clientWidth, height: (element as HTMLElement).clientHeight};
        },
        alwaysScroll: true
    }
}).on('start', ({store, event}) => {

    if (!(event as MouseEvent).ctrlKey && !(event as MouseEvent).metaKey) {

        for (const el of store.stored) {
            el.classList.remove('selected');
        }

        visualScrollSelection.clearSelection();
    }

}).on('move', ({store: {changed: {added, removed}}}) => {

    for (const el of added) {
        el.classList.add('selected');
    }

    for (const el of removed) {
        el.classList.remove('selected');
    }
}).on('stop', (evt) => console.log('stop', evt));