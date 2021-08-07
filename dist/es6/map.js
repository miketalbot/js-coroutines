import {isObject} from './is-object'
import {forEach} from './for-each'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, Array|Object, *>} new collection of mapped values
 * @example
 *
 * const values = yield * map(array, yielding(v=>v ** 2))
 *
 */
export function* map(collection, fn) {
    let result = isObject(collection) ? {} : []
    yield* forEach(collection, function* (value, key) {
        result[key] = yield* fn(value, key, collection)
    })
    return result
}
