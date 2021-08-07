import {isObject} from './is-object'
import {forEach} from './for-each'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, Object|Array, *>} collection of elements matching the filter
 * @example
 *
 * const filtered = yield * filter(array, yielding(v=>v.value > 1000, 100))
 */
export function* filter(collection, fn) {
    if (isObject(collection)) {
        let result = {}
        yield* forEach(collection, function* (value, key, array) {
            if (yield* fn(value, key, array)) {
                result[key] = value
            }
        })
        return result
    } else {
        let result = []
        yield* forEach(collection, function* (value, key, array) {
            if (yield* fn(value, key, array)) {
                result.push(value)
            }
        })
        return result
    }
}
