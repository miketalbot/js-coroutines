import {wrapAsPromise} from './wrappers'
import {concat} from './concat'

/**
 * Concatenates 2 arrays into a new array
 * @function concatAsync
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Promise.<Array>} a promise for combined array
 */
export const concatAsync = wrapAsPromise(concat)
