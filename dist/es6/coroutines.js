/**
 *<p>
 * A coroutine to be run during the gaps in other processing and animation.
 *</p>
 * <p>
 * The coroutine should <code>yield</code> regularly to do a time check.  A plain <code>yield</code> will cause
 * a check against the standard time remaining specified when running.  <code>yield {number}</code> will
 * check that <code>number</code> milliseconds are available and <code>yield true</code> will abandon any more
 * processing on the current frame.
 *</p>
 * @callback Coroutine
 * @generator
 * @yields {number} either undefined to perform a standard time remaining check, a number of milliseconds required for the next step or true if we should abandon the current frame
 * @returns the result of the function if any to be returned to the caller
 */

/**
 * @typedef IteratorResult
 * @object
 * @property {any} [value] - the returned value
 * @property {boolean} done - whether the iterator is complete
 */

/**
 * @interface Iterator
 */

/**
 * Get the next value
 * @function
 * @name Iterator#next
 * @param {any} value - value to send to the coroutine
 * @returns {IteratorResult}
 */

import run from './run'

/**
 * A coroutine to be used in high priority to animate.
 *
 * Executing a <code>yield</code> will cause the routine to resume at the start
 * of the next frame.
 * @callback AnimationCoroutine
 * @generator
 * @returns the result of the function if any to be returned to the caller
 */


/**
 * @callback GeneratorFunction
 * @generator
 * @param {...*} params - the parameters to pass
 * @returns {*} the result of the coroutine
 */

/**
 * @callback AsyncFunction
 * @param {*} params - the parameters to pass
 * @async
 * @returns {*} result of calling the function
 */

/**
 * Create a function that executes a pipeline of
 * functions asynchronously
 * @param {...(Function|Promise|Array<(Promise|Function|GeneratorFunction|AsyncFunction)>|GeneratorFunction|AsyncFunction)} fns - the pipeline to execute
 * @returns {AsyncFunction} an async function to execute the pipeline
 */
export function pipe(...fns) {
    return async function (params) {
        let result = params
        for (let fn of fns.flat(Infinity)) {
            if (!fn) continue
            let nextResult = fn.call(this, result)
            if (nextResult) {
                if (nextResult.next) {
                    result = await run(nextResult)
                } else if (nextResult.then) {
                    result = await nextResult
                } else {
                    result = nextResult
                }
            }
        }
        return result
    }
}

/**
 * Create a function that executes a pipeline of
 * functions asynchronously, the function executes the list in
 * REVERSE order, allowing you to "compose on" a new function
 * at the head of the chain
 * @param {...(Function|Promise|Array<(Promise|Function|GeneratorFunction|AsyncFunction)>|GeneratorFunction|AsyncFunction)} fns - the pipeline to execute
 * @returns {AsyncFunction} an async function to execute the pipeline
 */
export function compose(...fns) {
    return async function (params) {
        let result = params

        let list = fns.flat(Infinity)
        for (let i = list.length - 1; i >= 0; i--) {
            let fn = list[i]
            if (!fn) continue
            let nextResult = fn.call(this, result)
            if (nextResult) {
                if (nextResult.next) {
                    result = await run(nextResult)
                } else if (nextResult.then) {
                    result = await nextResult
                } else {
                    result = nextResult
                }
            }
        }
        return result
    }
}

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

/**
 * Create a function that repeats a function multiple times
 * passing the output of each iteration as the input to the next
 * @param {Function} fn - the function to repeat
 * @param {Number} times - the number of times to repeat
 * @returns {AsyncFunction} - a async function that repeats the operation
 */
export function repeat(fn, times) {
    return async function (params) {
        let result = params
        for (let i = 0; i < times; i++) {
            result = fn.call(this, result)
            if (result.next) {
                result = await run(result)
            } else if (result.then) {
                result = await result
            }
        }
        return result
    }
}



