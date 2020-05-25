import {wrapAsPromise, yielding} from './wrappers'
import {stringify} from './json'
import {parse} from './yastjson/lib/parse'
import {sort} from './timsort'
import {concat, filter, find, findIndex, map, reduce, append, forEach, some, every} from './array-utilities'

function wrapAsPromiseAndYieldFn(fn) {
    let yielder = wrapAsPromise(fn)
    return function(array, fn) {
        return yielder(array, yielding(fn))
    }
}

export const stringifyAsync = wrapAsPromise(stringify)
export const parseAsync = wrapAsPromise(parse)
export const sortAsync = wrapAsPromise(sort)
export const findAsync = wrapAsPromiseAndYieldFn(find)
export const findIndexAsync = wrapAsPromiseAndYieldFn(findIndex)
export const mapAsync = wrapAsPromiseAndYieldFn(map)
export const filterAsync = wrapAsPromiseAndYieldFn(filter)
export const reduceAsync = wrapAsPromiseAndYieldFn(reduce)
export const appendAsync = wrapAsPromise(append)
export const concatAsync = wrapAsPromise(concat)
export const forEachAsync = wrapAsPromiseAndYieldFn(forEach)
export const someAsync = wrapAsPromiseAndYieldFn(some)
export const everyAsync = wrapAsPromiseAndYieldFn(every)
