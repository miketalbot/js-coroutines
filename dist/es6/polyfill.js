let initialized = false

if (typeof navigator != 'undefined' && navigator.product === 'ReactNative') {
    try {
        if (!initialized && global && !global.requestIdleCallback) {
            initialized = true
            const MAX_TIME = 15
            let callbacks = []
            global.requestIdleCallback = (fn) => {
                callbacks.push(fn)
            }

            (function idle() {

                requestAnimationFrame(startFrame)

                function startFrame() {
                    const time = Date.now()
                    setImmediate(() => endOfWork(time))
                }

                function endOfWork(time = 100) {
                    const api = {
                        timeRemaining() {

                            return MAX_TIME - (Date.now() - time)
                        }
                    }
                    while (callbacks.length > 0 && api.timeRemaining() > 1) {
                        const cb = callbacks.pop()
                        try {
                            cb(api)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    requestAnimationFrame(startFrame)
                }
            })()
        }
    } catch (e) {
    }
}
try {
    if (!initialized && window && !window.requestIdleCallback) {
        const MAX_TIME = 14
        let callbacks = []
        window.requestIdleCallback =  (fn) => {
            callbacks.push(fn)
        }

        (function idle() {

            requestAnimationFrame(startFrame)

            function startFrame() {
                const time = Date.now()
                setTimeout(() => endOfWork(time))
            }

            function endOfWork(time = 100) {
                const api = {
                    timeRemaining() {

                        return MAX_TIME - (Date.now() - time)
                    }
                }
                while (callbacks.length > 0 && api.timeRemaining() > 1) {
                    const cb = callbacks.pop()
                    try {
                        cb(api)
                    } catch (e) {
                        console.error(e)
                    }
                }
                requestAnimationFrame(startFrame)
            }
        })()
    }
} catch (e) {
    console.error(e)
}
