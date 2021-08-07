import {getCallback, getNodeCallback} from './polyfill'


export let request = typeof window === 'undefined' ? getNodeCallback() : window.requestIdleCallback

/**
 * Call with true to use the polyfilled version of
 * the idle callback, can be more stable in certain
 * circumstances
 * @param {Boolean} internal
 */
export function useInternalEngine(internal) {
    request = internal ? getCallback() : request
}
