import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {
    append,
    concat,
    every,
    filter,
    find,
    findIndex,
    forEach,
    groupBy,
    includes,
    indexOf,
    keyBy,
    lastIndexOf,
    map,
    reduce,
    some,
    uniqueBy
} from './array-utilities'
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
/**
 * Finds an item in an array asynchronously
 * @function findAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<any|null>} promise for the item found or null if no match
 */
export const findAsync = wrapAsPromiseAndYieldFn(find)
/**
 * Finds an item index in an array asynchronously
 * @function findIndexAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Number>} promise for the index of the first item to pass the filter or -1
 */
export const findIndexAsync = wrapAsPromiseAndYieldFn(findIndex)
/**
 * Maps the contents of an array asynchronously
 * @function mapAsync
 * @param {Array} array
 * @param {Map} mapFn
 * @returns {Promise.<Array>} promise for the mapped array
 */
export const mapAsync = wrapAsPromiseAndYieldFn(map)
/**
 * Filters an array asynchronously
 * @function filterAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Array>} promise for the filtered array
 */
export const filterAsync = wrapAsPromiseAndYieldFn(filter)
/**
 * Performs a reduce on an array asynchronously
 * @function reduceAsync
 * @param {Array} array
 * @param {Reduce} reduceFn
 * @param {any} initialValue
 * @returns {Promise.<any>} a promise for the reduced value
 */
export const reduceAsync = wrapAsPromiseAndYieldFn(reduce)
/**
 * Appends one array to another asynchronously
 * @function appendAsync
 * @param {Array} destination
 * @param {Array} source
 * @returns {Promise.<Array>} a promise for destination after appending
 */
export const appendAsync = wrapAsPromise(append)
/**
 * Concatenates 2 arrays into a new array
 * @function concatAsync
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Promise.<Array>} a promise for combined array
 */
export const concatAsync = wrapAsPromise(concat)
/**
 * Asynchronously loop over the elements of an array
 * @function forEachAsync
 * @param {Array} array
 * @param {Process} fn
 * @returns {Promise} promise for the end of the operation
 */
export const forEachAsync = wrapAsPromiseAndYieldFn(forEach)
/**
 * Asynchronously apply an array <code>some</code> operation
 * returning a promise for <code>true</code> if at least
 * one item matches
 * @function someAsync
 * @param {Array} array
 * @param {Filter} fn
 * @returns {Promise.<Boolean>} promise for true if at least one item matched the filter
 */
export const someAsync = wrapAsPromiseAndYieldFn(some)
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


/**
 * Returns a promise returning true if an array includes a value
 * @param array
 * @param value
 * @returns Promise<Boolean>
 * @example
 * if(await includesAsync(someArray, 'error')) {
 *     ...
 * }
 */
export const includesAsync = wrapAsPromiseAndYieldFn(includes)
/**
 * Returns a promise for the first index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */
export const indexOfAsync = wrapAsPromiseAndYieldFn(indexOf)
/**
 * Returns a promise for the last index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */
export const lastIndexOfAsync = wrapAsPromiseAndYieldFn(lastIndexOf)
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
