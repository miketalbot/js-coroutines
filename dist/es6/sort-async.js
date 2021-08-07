import {wrapAsPromise} from './wrappers'
import {sort} from './timsort'

/**
 * <p>Sort an array (in place) by a sorting function</p>
 * <p>Sorts an array in place asynchronously. This function is a yielding
 * implementation of Timsort (standard sort used in modern browsers). Timsort
 * is fast and stable making it ideal for multi-key sorts. It it not as fast
 * as Quicksort.</p>
 * @function sortAsync
 * @param {Array} array - The array to sort
 * @param {SortFunction|ExtractFunction} sort - The method to sort the array
 * @returns {Promise.<Array>} a promise for the sorted array
 * @example
 * async function process(data) {
 *     return await sortAsync(data, v=>v.someProperty)
 * }
 */
export const sortAsync = wrapAsPromise(sort)
