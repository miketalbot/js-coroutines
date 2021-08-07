/**
 * Creates an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is an collection of the elements responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, {}, *>} a generator for the new object
 * @example
 *
 * let groups = yield * groupBy(records, yielding(v=>v.category))
 *
 * ...
 *
 * console.log(groups['category1']) // -> [{id: 1, ...}, {id: 2, ...}]
 *
 */
export function* groupBy(collection, fn) {
    let result = {}
    let index = 0
    for (let item of collection) {
        let key = yield* fn(item, index++, collection)
        const array = (result[key] = result[key] || [])
        array.push(item)
    }
    return result
}
