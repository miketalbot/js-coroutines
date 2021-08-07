import {wrapAsPromiseAndYieldFn} from './async-wrapper-utils'
import {includes} from './includes'

/**
 * Returns a promise returning true if an array includes a value
 * @param array
 * @param value
 * @returns Promise<Boolean>
 * @example
 * if(await includesAsync(someArray, 'error')) {
 *     ...
 * }
 */
export const includesAsync = wrapAsPromiseAndYieldFn(includes)
