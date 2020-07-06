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

/**
 * A coroutine to be used in high priority to animate.
 *
 * Executing a <code>yield</code> will cause the routine to resume at the start
 * of the next frame.
 * @callback AnimationCoroutine
 * @generator
 * @returns the result of the function if any to be returned to the caller
 */

import {getCallback} from './polyfill'

let request = window.requestIdleCallback

/**
 * Call with true to use the polyfilled version of
 * the idle callback, can be more table in certain
 * circumstances
 * @param internal
 */
export function useInternalEngine(internal) {
    request = internal ? getCallback() : request
}

/**
 * <p>
 *     Starts an idle time coroutine and returns a promise for its completion and
 *      any value it might return.
 * </p>
 * <p>
 *     You may pass a coroutine function or the result of calling such a function.  The
 *     latter helps when you must provide parameters to the coroutine.
 * </p>
 * @param {Coroutine|Iterator} coroutine the routine to run or an iterator for an already started coroutine
 * @param {number} [loopWhileMsRemains=2 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param {number} [timeout=160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns {Promise<any>} the result of the coroutine
 * <strong>The promise returned by <code>run</code> has a <code>terminate()</code> method
 * that can be used to stop the routine.</strong>
 * @example
 * async function process() {
 *     let answer = await run(function * () {
 *         let total = 0
 *         for(let i=1; i < 10000000; i++) {
 *            total += i
 *            if((i % 100) === 0) yield
 *         }
 *         return total
 *     })
 *     ...
 * }
 *
 * // Or
 *
 * async function process(param) {
 *     let answer = await run(someCoroutine(param))
 * }
 */
export function run(coroutine, loopWhileMsRemains = 1, timeout = 32 * 10) {
    let terminated = false
    let resolver = null
    const result = new Promise( function (resolve, reject) {
        resolver = resolve
        const iterator = coroutine.next ? coroutine : coroutine()
        // Request a callback during idle
        request(run)
        // Handle background processing when tab is not active
        let id = setTimeout(runFromTimeout, timeout)
        let parameter = undefined

        async function run(api) {
            clearTimeout(id)
            // Stop the timeout version
            if (terminated) {
                iterator.return()
                return
            }
            let minTime = Math.max(0.5, loopWhileMsRemains)
            try {
                do {
                    const {value, done} = iterator.next(await parameter)
                    parameter = undefined
                    if (done) {
                        resolve(value)
                        return
                    }
                    if (value === true) {
                        break
                    } else if (typeof value === 'number') {
                        minTime = +value
                        if (isNaN(minTime)) minTime = 1
                    } else if (value && value.then) {
                        parameter = value
                    }
                } while (api.timeRemaining() > minTime)
            } catch (e) {
                reject(e)
                return
            }
            // Request an idle callback
            request(run)
            // Request again on timeout
            id = setTimeout(runFromTimeout, timeout)
        }

        function runFromTimeout() {
            const budget = 8.5
            const start = performance.now()
            run({
                timeRemaining() {
                    return budget - (performance.now() - start)
                },
            })
        }
    })

    result.terminate = function (result) {
        terminated = true
        if (resolver) {
            resolver(result)
        }
    }
    return result
}


let requested = false
let animationCallbacks = []

function nextAnimationFrame(fn) {
    if(animationCallbacks.length === 0 && !requested) {
        requested = true
        requestAnimationFrame(process)
    }
    animationCallbacks.push(fn)
}

function process() {
    let callbacks = animationCallbacks
    if (callbacks.length) {
        requestAnimationFrame(process)
    } else {
        requested = false
    }
    animationCallbacks = []
    for (let callback of callbacks) {
        callback()
    }
}

/**
 * Start an animation coroutine, the animation will continue until
 * you return and will be broken up between frames by using a
 * <code>yield</code>.
 *
 * @param {AnimationCoroutine|Iterator} coroutine - The animation to run
 * @param {...*} [params] - Parameters to be passed to the animation function
 * @returns {Promise<any>} a value that will be returned to the caller
 * when the animation is complete.
 * <strong>The promise returned by <code>update</code> has a <code>terminate()</code> method
 * that can be used to stop the routine.</strong>
 */
export function update(coroutine, ...params) {
    let terminated = false
    let resolver = null
    const result = new Promise(function (resolve, reject) {
        resolver = resolve
        const iterator = coroutine.next ? coroutine : coroutine(...params)
        nextAnimationFrame(run)

        function run() {
            if (terminated) {
                iterator.return()
                return
            }

            try {
                const {value, done} = iterator.next()
                if (done) {
                    resolve(value)
                    return
                }
            } catch (e) {
                reject(e)
                return
            }

            nextAnimationFrame(run)
        }
    })
    result.terminate = function (result) {
        terminated = true
        if (resolver) {
            resolver(result)
        }
    }
    return result
}

/**
 * @deprecated
 * Starts an idle time coroutine using an async generator - <strong>this is NOT normally required
 * and the performance of such routines is slower than ordinary coroutines</strong>.  This is included
 * in case of an edge case requirement.
 * @param {Coroutine|Iterator} coroutine - the routine to run
 * @param {number} [loopWhileMsRemains=1 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param {number} [timeout=160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns {Promise<any>} the result of the coroutine
 */
export function runAsync(coroutine, loopWhileMsRemains = 1, timeout = 160) {
    const options = {timeout}
    let terminated = false
    let resolver = null
    const result = new Promise(async function (resolve, reject) {
        resolver = resolve
        const iterator = coroutine.next ? coroutine : await Promise.resolve(coroutine())
        window.requestIdleCallback(run)

        async function run(api) {
            if (terminated) {
                iterator.return()
                return
            }
            let minTime = Math.max(0.5, loopWhileMsRemains)
            try {
                do {
                    const {value, done} = await iterator.next()
                    if (done) {
                        resolve(value)
                        return
                    }
                    if (value === true) {
                        break
                    }
                    if (value) {
                        minTime = +value
                        if (isNaN(minTime)) minTime = 1
                    }
                } while (api.timeRemaining() > minTime)
            } catch (e) {
                reject(e)
                return
            }

            window.requestIdleCallback(run, options)
        }
    })
    result.terminate = function (result) {
        terminated = true
        if (resolver) {
            resolver(result)
        }
    }
    return result
}

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
    return async function(params) {
        let result = params
        for(let fn of fns.flat(Infinity)) {
            if(!fn) continue
            let nextResult = fn.call(this, result)
            if(nextResult) {
                if(nextResult.next) {
                    result = await run(nextResult)
                } else if(nextResult.then) {
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
    return async function(params) {
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
    return function(...params) {
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
    return async function(params) {
        let result = params
        for(let i = 0; i < times; i++) {
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

export default run
