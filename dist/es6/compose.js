import run from './run'

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
