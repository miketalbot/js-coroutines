import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {groupBy} from './group-by'

/**
 * Promises the creation of an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is an collection of the elements responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Promise<{}>}
 */
export const groupByAsync = wrapAsPromiseAndYieldFn(groupBy)
