import {
    run,
    map,
    yielding,
    reduce,
    indexOf,
    every,
    some,
    keyBy,
    lastIndexOf,
    groupBy,
    uniqueBy,
    find,
    concat,
    append,
    includes,
    findIndex,
    filter, forEach, exitWith,
} from '../component/index'
import { should } from 'chai'
should()

const INPUT_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const UNIQUE_ARRAY = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
const OBJECT_ARRAY = [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 1, b: 1 },
    { a: 2, b: 2 },
    { a: 2, b: 6 },
]
const INPUT_OBJECT = {
    a: 1,
    b: 'hello',
    c: 20,
    d: 'test',
}

describe('Array generator tests', function () {
    it('should map an array', async function () {
        let result = await run(function* () {
            return yield* map(
                INPUT_ARRAY,
                yielding((v) => v * 2)
            )
        })
        result.length.should.equal(20)
        result[0].should.equal(2)
        result[19].should.equal(40)
    })
    it('should sum an array', async function () {
        let result = await run(function* () {
            return yield* reduce(
                INPUT_ARRAY,
                yielding((a, c) => a + c)
            )
        })
        result.should.equal(INPUT_ARRAY.reduce((a, c) => a + c))
        result = await run(function* () {
            return yield* reduce(
                INPUT_ARRAY,
                yielding((a, c) => a + c),
                0
            )
        })
        result.should.equal(
            INPUT_ARRAY.reduce((a, c) => a + c),
            0
        )
    })
    it('should perform an every', async function () {
        let result = await run(function* () {
            return yield* every(
                INPUT_ARRAY,
                yielding((v) => v > 0)
            )
        })
        result.should.be.eq(true)
        result = await run(function* () {
            return yield* every(
                INPUT_ARRAY,
                yielding((v) => v > 1)
            )
        })
        result.should.be.eq(false)
    })
    it('should perform a some', async function () {
        let result = await run(function* () {
            return yield* some(
                INPUT_ARRAY,
                yielding((v) => v > 10)
            )
        })
        result.should.be.eq(true)
        result = await run(function* () {
            return yield* some(
                INPUT_ARRAY,
                yielding((v) => v > 20)
            )
        })
        result.should.be.eq(false)
    })
    it('should be able to do a keyBy', async function () {
        let result = await run(function* () {
            return yield* keyBy(
                INPUT_ARRAY,
                yielding((v) => (v / 5) | 0)
            )
        })
        result[0].should.eq(4)
        result[1].should.eq(9)
    })
    it('should be able to do a groupBy', async function () {
        let result = await run(function* () {
            return yield* groupBy(
                INPUT_ARRAY,
                yielding((v) => (v / 5) | 0)
            )
        })
        result[0].should.be.an('array')
        result[0].length.should.eq(4)
        result[0][0].should.eq(1)
        result[0][3].should.eq(4)
        result[1].should.be.an('array')
        result[1].length.should.eq(5)
        result[1][0].should.eq(5)
        result[1][4].should.eq(9)
    })
    it('should be able to do a uniqueBy', async function () {
        let result = await run(function* () {
            return yield* uniqueBy(
                UNIQUE_ARRAY,
                yielding((v) => v)
            )
        })
        result.length.should.eq(2)
    })
    it('should be able to do a uniqueBy without a function', async function () {
        let result = await run(function* () {
            return yield* uniqueBy(UNIQUE_ARRAY)
        })
        result.length.should.eq(2)
    })
    it('should be able to do an indexOf', async function () {
        let result = await run(function* () {
            return yield* indexOf(INPUT_ARRAY, 9)
        })
        result.should.eq(8)
        result = await run(function* () {
            return yield* indexOf(INPUT_ARRAY, 29)
        })
        result.should.eq(-1)
    })
    it('should be able to do a lastIndexOf', async function () {
        let result = await run(function* () {
            return yield* lastIndexOf(UNIQUE_ARRAY, 1)
        })
        result.should.eq(8)
        result = await run(function* () {
            return yield* lastIndexOf(UNIQUE_ARRAY, 12)
        })
        result.should.eq(-1)
    })
    it('should be able to do a filter', async function () {
        let result = await run(function* () {
            return yield* filter(
                INPUT_ARRAY,
                yielding((v) => v > 10)
            )
        })
        result[0].should.eq(11)
        result.length.should.eq(10)
    })
    it('should be able to perform a find', async function () {
        let result = await run(function* () {
            return yield* find(
                OBJECT_ARRAY,
                yielding((v) => v.b === 6)
            )
        })
        result.a.should.eq(2)
    })
    it('should be able to perform a findIndex', async function () {
        let result = await run(function* () {
            return yield* findIndex(
                OBJECT_ARRAY,
                yielding((v) => v.b === 6)
            )
        })
        result.should.eq(4)
        result = await run(function* () {
            return yield* findIndex(
                OBJECT_ARRAY,
                yielding((v) => v.b === 26)
            )
        })
        result.should.eq(-1)
    })
    it('should be able to concat 2 arrays', async function () {
        let result = await run(function* () {
            return yield* concat(INPUT_ARRAY, UNIQUE_ARRAY)
        })
        result.length.should.eq(37)
        result.should.not.eq(INPUT_ARRAY)
    })
    it('should be able to append 2 arrays', async function () {
        let array = [...INPUT_ARRAY]
        let result = await run(function* () {
            return yield* append(array, UNIQUE_ARRAY)
        })
        result.length.should.eq(37)
        result.should.eq(array)
    })
    it('should be able to do an includes', async function () {
        let result = await run(function* () {
            return yield* includes(INPUT_ARRAY, 3)
        })
        result.should.eq(true)
        result = await run(function* () {
            return yield* includes(INPUT_ARRAY, 21)
        })
        result.should.eq(false)
    })
    it('should be able to filter an object', async function () {
        let result = await run(function* () {
            return yield* filter(
                INPUT_OBJECT,
                yielding((v) => typeof v === 'string')
            )
        })
        Object.keys(result).length.should.eq(2)
        result.b.should.eq('hello')
    })
    it('should be able to foreach over an object', async function () {
        let output = []
        let result = await run(function* () {
            return yield* forEach(
                INPUT_OBJECT,
                yielding((v,k)=> {output.push([v,k])})
            )
        })
        output.length.should.eq(4)
        output[0][0].should.eq(1)
        output[0][1].should.eq('a')
        output[1][0].should.eq('hello')
        output[1][1].should.eq('b')

    })
    it('should be able to foreach over an object starting from a key', async function () {
        let output = []
        await run(function* () {
            return yield* forEach(
                INPUT_OBJECT,
                yielding((v, k) => {
                    output.push([v, k])
                }), 'b'
            )
        })
        output.length.should.eq(3)
        output[0][0].should.eq('hello')
        output[0][1].should.eq('b')
        output[1][0].should.eq(20)
        output[1][1].should.eq('c')

    })

    it('should be able to exit a for loop with a value', async () => {
        let result = await run(function* () {
            return yield* forEach(
                INPUT_OBJECT,
                yielding((v, k) => {
                    return exitWith("banana")
                }), 'b'
            )
        })
        result.should.eq('banana')
    })
    it('should map objects to objects', async function () {
        let result = await run(function* () {
            return yield* map(
                INPUT_OBJECT,
                yielding((v, k) => {
                    if(typeof v === 'number') return v * 2
                    return v
                }), 'b'
            )
        })
        result.c.should.eq(40)
        result.a.should.eq(2)
    })
})
