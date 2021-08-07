import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {forEach} from './for-each'

/**
 * Asynchronously loop over the elements of an array
 * @function forEachAsync
 * @param {Array} array
 * @param {Process} fn
 * @returns {Promise} promise for the end of the operation
 */
export const forEachAsync = wrapAsPromiseAndYieldFn(forEach)
