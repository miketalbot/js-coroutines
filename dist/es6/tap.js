import run from './run'

/**
 * Tap into a pipeline to call a function that will probably
 * perform side effects but should not modify the result, its
 * return value is ignored
 * @param {Function} fn - a function to be called at this point in
 * the pipeline
 * @returns {AsyncFunction} returning the passed in parameters
 */
export function tap(fn) {
    return async function (params) {
        let result = fn.call(this, params)
        if (result) {
            if (result.next) {
                await run(result)
            } else if (result.then) {
                await result
            }
        }
        return params
    }
}
