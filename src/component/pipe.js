import run from './run'

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
