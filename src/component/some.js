import {forEach} from './for-each'
import {exitWith} from './array-utilities'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if at least one item matched the filter
 * @example
 *
 *
 * if(yield * some(collection, yielding(v=>v > 2000)) {
 *     ...
 * }
 */
export function* some(collection, fn) {
    let result = false
    yield* forEach(collection, function* (value, key) {
        if (yield* fn(value, key, collection)) {
            result = true
            return exitWith(true)
        }
    })
    return result
}
