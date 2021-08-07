import {forEach} from './for-each'

/**
 * Creates an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is the last element responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, {}, *>} a generator for the new object
 * @example
 *
 * let lookup = yield * keyBy(records, yielding(r=>r.id))
 *
 * ...
 *
 * let row = lookup[id]
 *
 */
export function* keyBy(collection, fn) {
    let result = {}
    yield* forEach(collection, function* (value, key) {
        let newKey = yield* fn(value, key, collection)
        result[newKey] = value
    })
    return result
}
