import {forEach} from './for-each'

/**
 * @param {Array|Object} target
 * @param {Reduce} fn
 * @param {any} [initial]
 * @returns {Generator<*, *, *>} The result of processing the reduction function on all
 * of the items in the target
 * @example
 *
 * async function sumAge(items) {
 *     const output = await reduceAsync(items, (acc,cur)=>acc += cur.age, 0)
 * }
 */
export function* reduce(target, fn, initial) {
    let result = initial !== undefined ? initial : target[0]
    let first = true
    yield* forEach(target, function* (item, key) {
        if (first && !initial) {
            result = item
            first = false
        } else {
            result = yield* fn(result, item, key, target)
        }
    })
    return result
}
