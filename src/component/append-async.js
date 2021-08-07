import {wrapAsPromise} from './wrappers'
import {append} from './append'

/**
 * Appends one array to another asynchronously
 * @function appendAsync
 * @param {Array} destination
 * @param {Array} source
 * @returns {Promise.<Array>} a promise for destination after appending
 */
export const appendAsync = wrapAsPromise(append)
