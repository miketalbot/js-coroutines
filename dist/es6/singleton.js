import run from './run'

/**
 * Creates a singleton executor of a generator function.
 * If the function is currently running it will be
 * terminated with the defaultValue and a new one started.
 *
 * This would often be used with a UI to cancel a previous calculation
 * and begin updates on a new one.
 *
 * @param {Function} fn - the generator function to wrap
 * @param {any} [defaultValue] - a value to be returned if the current execution is
 * terminated by a new one starting
 * @returns {function(...[*]): Promise<any>} a function to execute the
 * generator and return the value
 * @example
 *
 * const job = singleton(function * (array, value) {
 *      let output = []
 *      for(let item of array) {
 *         if(output.length % 100 === 0) yield
 *         output.push(complexCalculation(array, value))
 *      }
 *      return output
 * }, [])
 *
 * function doSomething(array) {
 *     job(array, 2002).then(console.log)
 * }
 *
 * doSomething(bigArray)
 * doSomething(otherArray) // -> console.log([]) from first one
 *
 */
export function singleton(fn, defaultValue) {
    let promise = null
    let extraPromises = []
    let result = (...params) => {
        if (promise) {
            extraPromises.forEach(p => p.terminate())
            extraPromises = []
            promise.terminate(defaultValue)
        }
        return promise = result._promise = run(fn(...params))
    }
    result.join = function (promise) {
        extraPromises.push(promise)
        return promise
    }
    return result
}
