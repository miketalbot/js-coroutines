import {forEach} from './for-each'
import {exitWith} from './array-utilities'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, number, *>} Index of matching element or -1
 * @example
 *
 * if(-1 === yield * findIndex(records, yielding(v=>v.id === '123')))
 *      return
 */
export function* findIndex(collection, fn, start) {
    let output = -1
    yield* forEach(
        collection,
        function* (value, key) {
            let result = yield* fn(value, key, collection)
            if (result) {
                output = key
                return exitWith(key)
            }
        },
        start
    )
    return output
}
