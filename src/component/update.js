let requested = false
let animationCallbacks = []

function nextAnimationFrame(fn) {
    if (typeof window === 'undefined') throw new Error('Cannot run without a browser')
    if (animationCallbacks.length === 0 && !requested) {
        requested = true
        requestAnimationFrame(process)
    }
    animationCallbacks.push(fn)
    if (animationCallbacks.length > 10000) animationCallbacks = animationCallbacks.slice(-9000)
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
    if (typeof window === 'undefined') throw new Error('Requires a browser to run')
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
