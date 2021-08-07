/**
 * Returns true if an array includes a value
 * @param {Array} array
 * @param {any} value
 * @returns {Generator<*, boolean, *>}
 * @example
 *
 * prices = price * (yield * includes(items, yielding(v=>v.discount))) ? .4 : 1
 */
export function* includes(array, value) {
    for (let i = 0, l = array.length; i < l; i++) {
        if (array[i] === value) return true
        if ((i & 63) === 0) yield
    }
    return false
}
