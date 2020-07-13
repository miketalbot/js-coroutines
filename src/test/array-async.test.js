import {reduceAsync} from '../component'
import {should} from 'chai'

should()

const INPUT_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

describe("Array async functions", function () {
    it("should handle yielding functions", async function () {
        let result = await reduceAsync(INPUT_ARRAY, (a,c)=>a+c)
        result.should.equal(210)
    })
    it("should be able to make a pipeline and execute it", async function () {

    })
})
