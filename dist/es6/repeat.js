import run from './run'

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
