import run from './run'

/**
 * Branches a pipeline by starting another "continuation" with
 * the current parameters.  Starts a function but the pipeline
 * continues immediately creating two execution contexts
 * @param {Function} fn - the function to start - can be async or generator
 */
export function branch(fn) {
    return function (params) {
        let result = fn.call(this, params)
        if (result) {
            if (result.next) {
                run(result).catch(console.error)
            } else if (result.then) {
                result.catch(console.error)
            }
        }
        return params
    }
}
