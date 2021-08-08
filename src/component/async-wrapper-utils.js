import {yielding} from './wrappers'
import run from './run'
import {call} from './call'

/**
 * Create a promised function
 * @param {Function} fn
 * @returns {Function}
 */
export function wrapAsPromiseAndYieldFn(fn) {
    const result = function (array, processor, ...params) {
        return run(fn(array, yielding(processor), ...params))
    }
    result.with = function (...params) {
        return call(result, ...params)
    }
    return result
}
