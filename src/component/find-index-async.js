import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {findIndex} from './find-index'

/**
 * Finds an item index in an array asynchronously
 * @function findIndexAsync
 * @param {Array} array
 * @param {Filter} filter
 * @returns {Promise.<Number>} promise for the index of the first item to pass the filter or -1
 */
export const findIndexAsync = wrapAsPromiseAndYieldFn(findIndex)
