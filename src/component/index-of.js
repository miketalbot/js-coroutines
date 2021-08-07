/**
 * Returns a generator for an index of an item in an array
 * @param {Array} array - the array to scan
 * @param {*} value - the value to search for
 * @returns {Generator<*, number, *>}
 */
export function* indexOf(array, value) {
    for (let i = 0, l = array.length; i < l; i++) {
        if (array[i] === value) return i
        if ((i & 63) === 0) yield
    }
    return -1
}
