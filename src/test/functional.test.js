import {mapAsync, parseAsync, pipe, tap, stringifyAsync, singleton, run, repeat, branch} from '../component'
import {should} from 'chai'
should()

describe('functional tests', function () {
    it('should be able to run a functional pipeline', async function () {
        const process = pipe(
            parseAsync,
            mapAsync.with(v=>v * 2),
            stringifyAsync
        )
        let result = await process('[1,2,3,4]')
        result.should.eq('[2,4,6,8]')
    })
    it('should be able to run a singleton', async function () {
        const job = singleton(test1, 99)
        let value = 0
        job(21).then(r=>value = r)
        let result = await job(20)
        result.should.eq(20)
        value.should.eq(99)

        function * test1(value) {
            yield new Promise(resolve=>setTimeout(resolve, 50))
            return value
        }
    })
    it('should be able to repeat a function', async function () {
        let current
        const process = pipe(
            parseAsync,
            tap(capture),
            repeat(double, 2),
            stringifyAsync
        )
        let result = await process('[1,2,3,4]')
        result.should.eq('[4,8,12,16]')
        current.should.deep.eq([1, 2, 3, 4])
        function double(values) {
            return values.map(v=>v*2)
        }
        function capture(v) {
            current = v
        }
    })
    it('should be able to branch', async function () {
        let output
        const process = pipe(
            parseAsync,
            branch(pipe(stringifyAsync, tap(capture))),
            mapAsync.with(v => v * 2),
            stringifyAsync
        )
        let result = await process('[1,2,3,4]')
        result.should.eq('[2,4,6,8]')
        output.should.eq('[1,2,3,4]')
        function capture(values) {
            output = values
        }
    })
})
