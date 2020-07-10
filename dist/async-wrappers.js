"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqueByAsync = exports.groupByAsync = exports.keyByAsync = exports.lastIndexOfAsync = exports.indexOfAsync = exports.includesAsync = exports.base64Decompress = exports.base64decompressFromUTF16Async = exports.decompressAsync = exports.decompressFromEncodedURIComponentAsync = exports.decompressFromUint8ArrayAsync = exports.decompressFromUTF16Async = exports.decompressFromBase64Async = exports.base64Compress = exports.base64CompressToUTF16Async = exports.compressAsync = exports.compressToEncodedURIComponentAsync = exports.compressToUint8ArrayAsync = exports.compressToUTF16Async = exports.compressToBase64Async = exports.everyAsync = exports.someAsync = exports.forEachAsync = exports.concatAsync = exports.appendAsync = exports.reduceAsync = exports.filterAsync = exports.mapAsync = exports.findIndexAsync = exports.findAsync = exports.sortAsync = exports.parseAsync = exports.stringifyAsync = void 0;

var _wrappers = require("./wrappers");

var _json = require("./json");

var _parse = require("./yastjson/lib/parse");

var _timsort = require("./timsort");

var _arrayUtilities = require("./array-utilities");

var _lzString = require("./lz-string/lz-string");

var _base64String = require("./lz-string/base64-string");

var _coroutines = require("./coroutines");

/**
 * Create a promised function
 * @param {Function} fn
 * @returns {Function}
 */
function wrapAsPromiseAndYieldFn(fn) {
  var result = function result(array, processor) {
    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    return (0, _coroutines.run)(fn.apply(void 0, [array, (0, _wrappers.yielding)(processor)].concat(params)));
  };

  result.with = function () {
    for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    return _coroutines.call.apply(void 0, [result].concat(params));
  };

  return result;
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


var stringifyAsync = (0, _wrappers.wrapAsPromise)(_json.stringify);
/**
 * Asynchronously parse JSON into an object
 * @function parseAsync
 * @param {String} json - the JSON to be parsed
 * @returns {Promise.<any>} a Promise for the parsed JSON
 */

exports.stringifyAsync = stringifyAsync;
var parseAsync = (0, _wrappers.wrapAsPromise)(_parse.parse);
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

exports.parseAsync = parseAsync;
var sortAsync = (0, _wrappers.wrapAsPromise)(_timsort.sort);
/**
 * Finds an item in an array asynchronously
 * @function findAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<any|null>} promise for the item found or null if no match
 */

exports.sortAsync = sortAsync;
var findAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.find);
/**
 * Finds an item index in an array asynchronously
 * @function findIndexAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Number>} promise for the index of the first item to pass the filter or -1
 */

exports.findAsync = findAsync;
var findIndexAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.findIndex);
/**
 * Maps the contents of an array asynchronously
 * @function mapAsync
 * @param {Array} array
 * @param {Map} mapFn
 * @returns {Promise.<Array>} promise for the mapped array
 */

exports.findIndexAsync = findIndexAsync;
var mapAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.map);
/**
 * Filters an array asynchronously
 * @function filterAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Array>} promise for the filtered array
 */

exports.mapAsync = mapAsync;
var filterAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.filter);
/**
 * Performs a reduce on an array asynchronously
 * @function reduceAsync
 * @param {Array} array
 * @param {Reduce} reduceFn
 * @param {any} initialValue
 * @returns {Promise.<any>} a promise for the reduced value
 */

exports.filterAsync = filterAsync;
var reduceAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.reduce);
/**
 * Appends one array to another asynchronously
 * @function appendAsync
 * @param {Array} destination
 * @param {Array} source
 * @returns {Promise.<Array>} a promise for destination after appending
 */

exports.reduceAsync = reduceAsync;
var appendAsync = (0, _wrappers.wrapAsPromise)(_arrayUtilities.append);
/**
 * Concatenates 2 arrays into a new array
 * @function concatAsync
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Promise.<Array>} a promise for combined array
 */

exports.appendAsync = appendAsync;
var concatAsync = (0, _wrappers.wrapAsPromise)(_arrayUtilities.concat);
/**
 * Asynchronously loop over the elements of an array
 * @function forEachAsync
 * @param {Array} array
 * @param {Process} fn
 * @returns {Promise} promise for the end of the operation
 */

exports.concatAsync = concatAsync;
var forEachAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.forEach);
/**
 * Asynchronously apply an array <code>some</code> operation
 * returning a promise for <code>true</code> if at least
 * one item matches
 * @function someAsync
 * @param {Array} array
 * @param {Filter} fn
 * @returns {Promise.<Boolean>} promise for true if at least one item matched the filter
 */

exports.forEachAsync = forEachAsync;
var someAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.some);
/**
 * Asynchronously check if every element in an array matches
 * a predicate
 * @function everyAsync
 * @param {Array} array
 * @param {Filter} fn
 * @returns {Promise.<Boolean>} promise for true if all items matched the filter
 */

exports.someAsync = someAsync;
var everyAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.every);
/**
 * Asynchronously compress a string to a base64 format
 * @function compressToBase64Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the base64 compressed data
 */

exports.everyAsync = everyAsync;
var compressToBase64Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToBase64);
/**
 * Asynchronously compress a string to a utf16 string
 * @function compressToUTF16Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the utf16 compressed data
 */

exports.compressToBase64Async = compressToBase64Async;
var compressToUTF16Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToUTF16);
/**
 * Asynchronously compress a string to a Uint8Array
 * @function compressToUint8ArrayAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<Uint8Array>} a promise for the Uint8Array of compressed data
 */

exports.compressToUTF16Async = compressToUTF16Async;
var compressToUint8ArrayAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToUint8Array);
/**
 * Asynchronously compress a string to a URI safe version
 * @function compressToEncodedURIComponentAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the string of compressed data
 */

exports.compressToUint8ArrayAsync = compressToUint8ArrayAsync;
var compressToEncodedURIComponentAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToEncodedURIComponent);
/**
 * Asynchronously compress a string of data with lz-string
 * @function compressAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */

exports.compressToEncodedURIComponentAsync = compressToEncodedURIComponentAsync;
var compressAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compress);
/**
 * Asynchronously apply lz-string base64 remapping of a string to utf16
 * @function base64CompressToUTF16Async
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */

exports.compressAsync = compressAsync;
var base64CompressToUTF16Async = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.compressToUTF16);
/**
 * Asynchronously apply lz-string base64 remapping of a string
 * @function base64CompressAsync
 * @param {String} source - the data to compress
 * @returns {Promise.<String>} a promise for the compressed data
 */

exports.base64CompressToUTF16Async = base64CompressToUTF16Async;
var base64Compress = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.compress);
/**
 * Asynchronously decompress a string from a base64 source
 * @function compressToBase64Async
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.base64Compress = base64Compress;
var decompressFromBase64Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromBase64);
/**
 * Asynchronously decompress a string from a utf16 source
 * @function decompressFromUTF16Async
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.decompressFromBase64Async = decompressFromBase64Async;
var decompressFromUTF16Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromUTF16);
/**
 * Asynchronously decompress a string from a utf16 source
 * @function decompressFromUint8ArrayAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.decompressFromUTF16Async = decompressFromUTF16Async;
var decompressFromUint8ArrayAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromUint8Array);
/**
 * Asynchronously decompress a string from a URL safe URI Component encoded source
 * @function decompressFromEncodedURIComponentAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.decompressFromUint8ArrayAsync = decompressFromUint8ArrayAsync;
var decompressFromEncodedURIComponentAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromURIComponent);
/**
 * Asynchronously decompress a string from a string source
 * @function decompressAsync
 * @param {String} compressedData - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.decompressFromEncodedURIComponentAsync = decompressFromEncodedURIComponentAsync;
var decompressAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompress);
/**
 * Asynchronously unmap base64 encoded data to a utf16 destination
 * @function base64decompressFromUTF16Async
 * @param {String} base64Data - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.decompressAsync = decompressAsync;
var base64decompressFromUTF16Async = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.decompressFromUTF16);
/**
 * Asynchronously unmap base64 encoded data
 * @function base64Decompress
 * @param {String} base64Data - the data to decompress
 * @returns {Promise.<String>} a promise for the uncompressed data
 */

exports.base64decompressFromUTF16Async = base64decompressFromUTF16Async;
var base64Decompress = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.decompress);
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

exports.base64Decompress = base64Decompress;
var includesAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.includes);
/**
 * Returns a promise for the first index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */

exports.includesAsync = includesAsync;
var indexOfAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.indexOf);
/**
 * Returns a promise for the last index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */

exports.indexOfAsync = indexOfAsync;
var lastIndexOfAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.lastIndexOf);
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

exports.lastIndexOfAsync = lastIndexOfAsync;
var keyByAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.keyBy);
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

exports.keyByAsync = keyByAsync;
var groupByAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.groupBy);
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

exports.groupByAsync = groupByAsync;
var uniqueByAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.uniqueBy);
exports.uniqueByAsync = uniqueByAsync;