import {isObject} from './is-object'
import {doReturn} from './array-utilities'

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Process} fn
 * @param {number|string} [start]
 * @returns {Generator<*, *, *>}
 * @example
 * // Loop over all keys/value pairs in an object
 * yield * forEach(object, yielding((value, key)=> { ... }))
 *
 * // Loop over all the values in an array
 * yield * forEach(array, generatorFunction)
 *
 * function * generatorFunction(value, index) {
 *     let i = 0
 *     while(i < 10000) {
 *         doSomething(value)
 *         if(i % 100 === 0) yield
 *     }
 * }
 */
export function* forEach(collection, fn, start) {
    if (isObject(collection)) {
        let started = !start
        for (let key in collection) {
            if (!started) {
                started = key === start
            }
            if (started) {
                if (Object.prototype.hasOwnProperty.call(collection, key)) {
                    let result = yield* fn(collection[key], key, collection)
                    if (result && result[doReturn]) return result.value
                }
            }
        }
    } else {
        for (let index = start || 0, length = collection.length; index < length; index++) {
            let result = yield* fn(collection[index], index, collection)
            if (result && result[doReturn]) return result.value
        }
    }
}
