/**
 * Create a version of a function with its end
 * parameters supplied
 * @param {Function|GeneratorFunction|AsyncFunction} fn - the function to configure
 * @param {...any[]} config - the additional parameters to pass
 * @returns {Function}
 */
export function call(fn, ...config) {
    return function (...params) {
        return fn.apply(this, [...params, ...config])
    }
}
