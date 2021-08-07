import {forEach} from './for-each'
import {yielding} from './wrappers'

/**
 * Appends one array to another
 * @generator
 * @param {Array} array1 - the destination
 * @param {Array} array2 - the source
 * @returns {Generator<*, Array, *>} returns <code>array1</code>
 * @example
 *
 * // Updates array1
 * yield * append(array1, array2)
 */
export function* append(array1, array2) {
    const l = array1.length
    yield true
    array1.length += array2.length
    yield
    yield* forEach(
        array2,
        yielding((a, i) => (array1[i + l] = a))
    )

    return array1
}
