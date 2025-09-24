/* eslint-disable @typescript-eslint/no-explicit-any */
import {arrayify} from './arrayify';

type Method = 'addEventListener' | 'removeEventListener';
type AnyFunction = (...arg: any) => any;

const eventListener = (method: Method) => (
    items: (EventTarget | undefined) | (EventTarget | undefined)[],
    events: string | string[],
    fn: AnyFunction,
    options = {}
) => {

    // Normalize array
    if (items instanceof HTMLCollection || items instanceof NodeList) {
        items = Array.from(items);
    }

    events = arrayify(events)
    items = arrayify(items);

    for (const el of items) {
        if (el) {
            for (const ev of events) {
                el[method](ev, fn as EventListener, {capture: false, ...options});
            }
        }
    }
};

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener('addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener('removeEventListener');

/**
 * Simplifies a touch / mouse-event
 * @param evt
 */
export const simplifyEvent = (evt: any): {
    target: HTMLElement;
    x: number;
    y: number;
} => {
    const {clientX, clientY, target} = evt.touches?.[0] ?? evt;
    
    // Ensure target is an HTMLElement
    let htmlTarget: HTMLElement;
    if (target instanceof HTMLElement) {
        htmlTarget = target;
    } else if (target instanceof Element) {
        // If it's an Element but not HTMLElement, try to cast it
        htmlTarget = target as HTMLElement;
    } else {
        // Fallback to document.body if target is not a valid element
        htmlTarget = document.body;
    }
    
    return {x: clientX, y: clientY, target: htmlTarget};
};
