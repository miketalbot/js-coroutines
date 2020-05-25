import {yielding} from './wrappers'

export function* forEach(array, fn) {
    for (let index = 0, length = array.length; index < length; index++) {
        yield* fn(array[index], index, array)
    }
}

export function* filter(array, fn) {
    let result = []
    let index = 0
    for (let item of array) {
        if (yield* fn(item, index++, array)) result.push(item)
    }
    return result
}

export function* reduce(array, fn, initial) {
    let result = initial || array[0]
    let index = 0
    for (let item of array) {
        result = yield* fn(result, item, index, array)
    }
    return result
}

export function* concat(array1, array2) {
    yield true
    const result = new Array(array1.length + array2.length)
    yield
    const l = array1.length
    yield* forEach(
        array1,
        yielding((a, i) => (result[i] = a))
    )
    yield* forEach(
        array2,
        yielding((a, i) => (result[i + l] = a))
    )
    return result
}

export function* append(array1, array2) {
    const l = array1.length
    yield true
    array1.length += array2.length
    yield
    yield* forEach(
        array2,
        yielding((a, i) => (array1[i + l] = a))
    )

    return array1
}

export function* map(array, fn) {
    yield true
    let result = new Array(array.length)
    yield
    let index = 0
    for (let item of array) {
        result[index++] = yield* fn(item, index, array)
    }
    return result
}

export function* find(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return item
    }
    return undefined
}

export function* findIndex(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return index
    }
    return -1
}

export function* some(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (result) return true
    }
    return false
}

export function* every(array, fn) {
    let index = 0
    for (let item of array) {
        let result = yield* fn(item, index++, array)
        if (!result) return false
    }
    return true
}
