import {wrapAsPromise, yielding} from './wrappers'
import {stringify} from './json'
import {parse} from './yastjson/lib/parse'
import {sort} from './timsort'
import {append, concat, every, filter, find, findIndex, forEach, map, reduce, some,} from './array-utilities'
import {LZStringGenerator} from './lz-string/lz-string'
import {Base64StringGenerator} from './lz-string/base64-string'
import {call, run} from './coroutines'

/**
 * Create a promised function
 * @param {Function} fn
 * @returns {Function}
 */
function wrapAsPromiseAndYieldFn(fn) {
    const result = function(array, processor) {
        return run(fn(array, yielding(processor)))
    }
    result.with = function(...params) {
        return call(result, ...params)
    }
    return result
}

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
 * Asynchronously stringify data into JSON
 * @function
 * @name stringifyAsync
 * @param {any} data - Object to store
 * @returns {Promise.<String>} a Promise for the JSON representation of <code>data</code>
 */
export const stringifyAsync = wrapAsPromise(stringify)
/**
 * Asynchronously parse JSON into an object
 * @function parseAsync
 * @param {String} json - the JSON to be parsed
 * @returns {Promise.<any>} a Promise for the parsed JSON
 */
export const parseAsync = wrapAsPromise(parse)
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
 * Asynchronously compress a string to a base64 format
 * @function compressToBase64Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the base64 compressed data
 */
export const compressToBase64Async = wrapAsPromise(
    LZStringGenerator.compressToBase64
)
/**
 * Asynchronously compress a string to a utf16 string
 * @function compressToUTF16Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the utf16 compressed data
 */
export const compressToUTF16Async = wrapAsPromise(LZStringGenerator.compressToUTF16)
/**
 * Asynchronously compress a string to a Uint8Array
 * @function compressToUint8ArrayAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<Uint8Array>} a promise for the Uint8Array of compressed data
 */
export const compressToUint8ArrayAsync = wrapAsPromise(
    LZStringGenerator.compressToUint8Array
)
/**
 * Asynchronously compress a string to a URI safe version
 * @function compressToEncodedURIComponentAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the string of compressed data
 */
export const compressToEncodedURIComponentAsync = wrapAsPromise(
    LZStringGenerator.compressToEncodedURIComponent
)
/**
 * Asynchronously compress a string of data with lz-string
 * @function compressAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */
export const compressAsync = wrapAsPromise(LZStringGenerator.compress)
/**
 * Asynchronously apply lz-string base64 remapping of a string to utf16
 * @function base64CompressToUTF16Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */
export const base64CompressToUTF16Async = wrapAsPromise(
    Base64StringGenerator.compressToUTF16
)
/**
 * Asynchronously apply lz-string base64 remapping of a string
 * @function base64CompressAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */
export const base64Compress = wrapAsPromise(Base64StringGenerator.compress)
/**
 * Asynchronously decompress a string from a base64 source
 * @function compressToBase64Async
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const decompressFromBase64Async = wrapAsPromise(
    LZStringGenerator.decompressFromBase64
)
/**
 * Asynchronously decompress a string from a utf16 source
 * @function decompressFromUTF16Async
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const decompressFromUTF16Async = wrapAsPromise(
    LZStringGenerator.decompressFromUTF16
)
/**
 * Asynchronously decompress a string from a utf16 source
 * @function decompressFromUint8ArrayAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const decompressFromUint8ArrayAsync = wrapAsPromise(
    LZStringGenerator.decompressFromUint8Array
)
/**
 * Asynchronously decompress a string from a URL safe URI Component encoded source
 * @function decompressFromEncodedURIComponentAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const decompressFromEncodedURIComponentAsync = wrapAsPromise(
    LZStringGenerator.decompressFromURIComponent
)
/**
 * Asynchronously decompress a string from a string source
 * @function decompressAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const decompressAsync = wrapAsPromise(LZStringGenerator.decompress)
/**
 * Asynchronously unmap base64 encoded data to a utf16 destination
 * @function base64decompressFromUTF16Async
 * @param {String} base64Data - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const base64decompressFromUTF16Async = wrapAsPromise(
    Base64StringGenerator.decompressFromUTF16
)
/**
 * Asynchronously unmap base64 encoded data
 * @function base64Decompress
 * @param {String} base64Data - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */
export const base64Decompress = wrapAsPromise(Base64StringGenerator.decompress)
