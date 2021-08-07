import {request} from './useInternalEngine'

const minRemainingTime = 1.75

/**
 * <p>
 *     Starts an idle time coroutine and returns a promise for its completion and
 *      any value it might return.
 * </p>
 * <p>
 *     You may pass a coroutine function or the result of calling such a function.  The
 *     latter helps when you must provide parameters to the coroutine.
 * </p>
 * @param {Coroutine|Iterator|Generator<*, *, *>} coroutine the routine to run or an iterator for an already started coroutine
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
export function run(coroutine, loopWhileMsRemains = 1, timeout) {
    let terminated = false
    let resolver = null
    const result = new Promise(function (resolve, reject) {
        resolver = resolve
        const iterator = coroutine.next ? coroutine : coroutine()
        // Request a callback during idle
        request(run)
        // Handle background processing when tab is not active
        let id = 0
        let parameter = undefined
        let running = false


        async function run(api) {
            if (running) return
            try {
                running = true
                clearTimeout(id)
                // Stop the timeout version
                if (terminated) {
                    iterator.return()
                    return
                }
                let minTime = Math.max(minRemainingTime, loopWhileMsRemains)
                try {
                    while (api.timeRemaining() > minTime) {
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
                            if (isNaN(minTime)) minTime = minRemainingTime
                        } else if (value && value.then) {
                            parameter = value
                        }
                    }
                } catch (e) {
                    console.error(e)
                    reject(e)
                    return
                }
                // Request an idle callback
                request(run)
                // Request again on timeout
                if (timeout) {
                    id = setTimeout(runFromTimeout, timeout)
                }
            } finally {
                running = false
            }

        }

        function runFromTimeout() {
            const budget = 12.5
            const start = Date.now()
            run({
                timeout: true,
                timeRemaining() {
                    return budget - (Date.now() - start)
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

export default run
