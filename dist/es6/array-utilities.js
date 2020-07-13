import {yielding} from './wrappers'

function isObject(v) {
    return typeof v === 'object' && !Array.isArray(v)
}

/**
 * @callback Filter
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {Generator} a generator for a value of true if included in the filter
 */

/**
 * @callback Map
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {any} updated item
 */

/**
 * @callback Reduce
 * @param {any} accumulator
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {any} updated value
 */

/**
 * @callback Process
 * @param {any} value - the value being processed
 * @param {number|string} key - the key or index of the value
 * @param {Array} collection - the collection being iterated
 */

const doReturn = Symbol('return')

export function exitWith(value) {
    return {[doReturn]: true, value}
}

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

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, Object|Array, *>} collection of elements matching the filter
 * @example
 *
 * const filtered = yield * filter(array, yielding(v=>v.value > 1000, 100))
 */
export function* filter(collection, fn) {
    if (isObject(collection)) {
        let result = {}
        yield* forEach(collection, function* (value, key, array) {
            if (yield* fn(value, key, array)) {
                result[key] = value
            }
        })
        return result
    } else {
        let result = []
        yield* forEach(collection, function* (value, key, array) {
            if (yield* fn(value, key, array)) {
                result.push(value)
            }
        })
        return result
    }
}

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
        if(first && !initial) {
            result = item
            first = false
        } else {
            result = yield* fn(result, item, key, target)
        }
    })
    return result
}

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

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, Array|Object, *>} new collection of mapped values
 * @example
 *
 * const values = yield * map(array, yielding(v=>v ** 2))
 *
 */
export function* map(collection, fn) {
    let result = isObject(collection) ? {} : []
    yield* forEach(collection, function* (value, key) {
        result[key] = yield* fn(value, key, collection)
    })
    return result
}

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @param {any} [start] - the key to start at
 * @returns {Generator<*, *, *>} the first matching value in the collection or null
 * @example
 *
 * const record = yield * find(arrayOfRecords, yielding(v=>v.id === '1234'))
 */
export function* find(collection, fn, start) {
    let output = undefined
    yield* forEach(
        collection,
        function* (value, key) {
            let result = yield* fn(value, key, collection)
            if (result) {
                output = value
                return exitWith(value)
            }
        },
        start
    )
    return output
}

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, number, *>} Index of matching element or -1
 * @example
 *
 * if(-1 === yield * findIndex(records, yielding(v=>v.id === '123')))
 *      return
 */
export function* findIndex(collection, fn, start) {
    let output = -1
    yield* forEach(
        collection,
        function* (value, key) {
            let result = yield* fn(value, key, collection)
            if (result) {
                output = key
                return exitWith(key)
            }
        },
        start
    )
    return output
}

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if at least one item matched the filter
 * @example
 *
 *
 * if(yield * some(collection, yielding(v=>v > 2000)) {
 *     ...
 * }
 */
export function* some(collection, fn) {
    let result = false
    yield* forEach(collection, function* (value, key) {
        if (yield* fn(value, key, collection)) {
            result = true
            return exitWith(true)
        }
    })
    return result
}

/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if all of the collection items matched the filter
 * @example
 *
 * if(! yield * every(records, yielding(r=>r.valid))) return
 */
export function* every(collection, fn) {
    let result = true
    yield* forEach(collection, function* (value, key) {
        if (!(yield* fn(value, key, collection))) {
            result = false
            return exitWith(false)
        }
    })
    return result
}

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
        if(fn) {
            let key = yield* fn(item, index++, array)
            if (!set.has(key)) {
                output.push(item)
                set.add(key)
            }
        } else {
            if(!set.has(item)) {
                output.push(item)
                set.add(item)
            }
        }
    }
    return output
}
