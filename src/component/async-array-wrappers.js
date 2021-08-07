import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {every} from './every'

/**
 * Asynchronously check if every element in an array matches
 * a predicate
 * @function everyAsync
 * @param {Array} array
 * @param {Filter} fn
 * @returns {Promise.<Boolean>} promise for true if all items matched the filter
 */
export const everyAsync = wrapAsPromiseAndYieldFn(every)

/**
 * @callback SortFunction
 * @param {any} item1
 * @param {any} item2
 * @returns < 0 if item 2 is bigger than item 1, === 0 if they are the same else > 0
 */

/**
 * @callback ExtractFunction
 * @param {any} item1
 * @returns {any} the value to sort item 1 by
 */


