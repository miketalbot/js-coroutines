import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {lastIndexOf} from './last-index-of'

/**
 * Returns a promise for the last index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>}
 */
export const lastIndexOfAsync = wrapAsPromiseAndYieldFn(lastIndexOf)
