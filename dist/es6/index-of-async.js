import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {indexOf} from './index-of'

/**
 * Returns a promise for the first index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */
export const indexOfAsync = wrapAsPromiseAndYieldFn(indexOf)
