/**
 * Returns a generator for an index of an item in an array
 * @param {Array} array - the array to scan
 * @param {*} value - the value to search for
 * @returns {Generator<*, number, *>}
 * @example
 *
 * let last = yield * lastIndexOf(collection, record)
 *
 */
export function* lastIndexOf(array, value) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === value) return i
        if ((i & 63) === 0) yield
    }
    return -1
}
