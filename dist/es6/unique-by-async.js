import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {uniqueBy} from './unique-by'

/**
 * Promises the creation of an array with the unique values from the
 * input array, the routine is supplied with a
 * function that determines on what the array should
 * be made unique.
 * @param {Array} array
 * @param {Map} [fn] - the function to determine uniqueness, if
 * omitted then the item itself is used
 * @returns {Promise<Array>} unique array
 */
export const uniqueByAsync = wrapAsPromiseAndYieldFn(uniqueBy)
