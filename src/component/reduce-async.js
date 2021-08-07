import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {reduce} from './reduce'

/**
 * Performs a reduce on an array asynchronously
 * @function reduceAsync
 * @param {Array} array
 * @param {Reduce} reduceFn
 * @param {any} initialValue
 * @returns {Promise.<any>} a promise for the reduced value
 */
export const reduceAsync = wrapAsPromiseAndYieldFn(reduce)
