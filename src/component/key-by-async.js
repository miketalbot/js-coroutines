import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {keyBy} from './key-by'

/**
 * Promises the creation an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is the last element responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Promise<{}>}
 */
export const keyByAsync = wrapAsPromiseAndYieldFn(keyBy)
