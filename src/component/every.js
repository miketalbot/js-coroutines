import {forEach} from './for-each'
import {exitWith} from './array-utilities'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if all of the collection items matched the filter
 * @example
 *
 * if(! yield * every(records, yielding(r=>r.valid))) return
 */
export function* every(collection, fn) {
    let result = true
    yield* forEach(collection, function* (value, key) {
        if (!(yield* fn(value, key, collection))) {
            result = false
            return exitWith(false)
        }
    })
    return result
}
