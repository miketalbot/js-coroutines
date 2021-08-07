/**
 * Create an array with the unique values from the
 * input array, the routine is supplied with a
 * function that determines on what the array should
 * be made unique.
 * @param {Array} array
 * @param {Map} [fn] - the function to determine uniqueness, if
 * omitted then the item itself is used
 * @returns {Generator<*, Array, *>}
 * @example
 *
 * const uniqueValues = yield * uniqueBy(records, yielding(r=>r.id))
 *
 */
export function* uniqueBy(array, fn) {
    let set = new Set()
    let output = []
    let index = 0
    for (let item of array) {
        if (fn) {
            let key = yield* fn(item, index++, array)
            if (!set.has(key)) {
                output.push(item)
                set.add(key)
            }
        } else {
            if (!set.has(item)) {
                output.push(item)
                set.add(item)
            }
        }
    }
    return output
}
