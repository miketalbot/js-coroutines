import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {filter} from './filter'

/**
 * Filters an array asynchronously
 * @function filterAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Array>} promise for the filtered array
 */
export const filterAsync = wrapAsPromiseAndYieldFn(filter)
