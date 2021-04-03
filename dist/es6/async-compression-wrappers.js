import {wrapAsPromise} from './wrappers'
import {Base64StringGenerator} from './lz-string/base64-string'
import {LZStringGenerator} from './lz-string/lz-string'

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
