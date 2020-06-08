import {yielding} from './wrappers'

/**
 * @callback Process
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 */

/**
 * @callback Filter
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {boolean} true if included in the filter
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
 * @generator
 * @param {Array} array
 * @param {process} fn
 */
export function* forEach(array, fn) {
    for (let index = 0, length = array.length; index < length; index++) {
        yield* fn(array[index], index, array)
    }
}

/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns array of elements matching the filter
 */
export function* filter(array, fn) {
    let result = []
    let index = 0
    for (let item of array) {
        if (yield* fn(item, index++, array)) result.push(item)
    }
    return result
}

/**
 * @param {Array} array
 * @param {Reduce} fn
 * @param {any} [initialValue]
 * @returns The result of processing the reduction function on all
 * of the items in the array
 */
export function* reduce(array, fn, initial) {
    let result = initial || array[0]
    let index = 0
    for (let item of array) {
        result = yield* fn(result, item, index, array)
    }
    return result
}

/**
 * Concatenate two arrays into a new array
 * @generator
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array} the concatenated arrays
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
 * @returns {Array} returns <code>array1</code>
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
 * @param {Array} array
 * @param {Map} fn
 * @returns {Array} new array of mapped values
 */
export function* map(array, fn) {
    yield true
    let result = new Array(array.length)
    yield
    let index = 0
    for (let item of array) {
        result[index++] = yield* fn(item, index, array)
    }
    return result
}

/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {any} the first matching value in the array or null
 */
export function* find(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return item
    }
    return undefined
}

/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {number} Index of matching element or -1
 */
export function* findIndex(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return index
    }
    return -1
}

/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {boolean} true if at least one item matched the filter
 */
export function* some(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return true
    }
    return false
}

/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {boolean} true if all of the array items matched the filter
 */
export function* every(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (!result) return false
    }
    return true
}
