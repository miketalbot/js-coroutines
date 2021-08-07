import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {find} from './find'

/**
 * Finds an item in an array asynchronously
 * @function findAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<any|null>} promise for the item found or null if no match
 */
export const findAsync = wrapAsPromiseAndYieldFn(find)
