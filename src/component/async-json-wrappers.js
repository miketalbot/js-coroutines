import {wrapAsPromise} from './wrappers'
import {parse} from './yastjson/lib/parse'
import {stringify} from './json'

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
