import {forEach} from './for-each'
import {exitWith} from './array-utilities'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @param {any} [start] - the key to start at
 * @returns {Generator<*, *, *>} the first matching value in the collection or null
 * @example
 *
 * const record = yield * find(arrayOfRecords, yielding(v=>v.id === '1234'))
 */
export function* find(collection, fn, start) {
    let output = undefined
    yield* forEach(
        collection,
        function* (value, key) {
            let result = yield* fn(value, key, collection)
            if (result) {
                output = value
                return exitWith(value)
            }
        },
        start
    )
    return output
}
