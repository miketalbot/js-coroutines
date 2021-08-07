import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {some} from './some'

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
