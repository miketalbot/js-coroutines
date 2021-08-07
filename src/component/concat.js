import {forEach} from './for-each'
import {yielding} from './wrappers'

/**
 * Concatenate two arrays into a new array
 * @generator
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Generator<*, Array, *>} the concatenated arrays
 * @example
 *
 * const concatenated = yield * concat(array1, array2)
 */
export function* concat(array1, array2) {
    yield true
    const result = new Array(array1.length + array2.length)
    yield
    const l = array1.length
    yield* forEach(
        array1,
        yielding((a, i) => (result[i] = a))
    )
    yield* forEach(
        array2,
        yielding((a, i) => (result[i + l] = a))
    )
    return result
}
