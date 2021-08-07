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

export const doReturn = Symbol('return')

export function exitWith(value) {
    return {[doReturn]: true, value}
}

