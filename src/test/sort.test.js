import {should} from 'chai'
import {sortAsync} from '../component'

should()
const INPUT_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
import test from '../component/yastjson/test/test.json'

const SORT_ARRAY = ['z', '1', 'a', 'a', 'a', 'a', '2','2', 'b', 'f', 'f', 'c', 'c']

describe('sorting', function () {
    it('should be able to sort an array', async function () {
        const result = await sortAsync([...INPUT_ARRAY], v=>-v)
        result[0].should.eq(20)
        result[19].should.eq(1)
    })
    it('should be able to sort more complicated things!', async function () {
        const result = await  sortAsync([...test], v=>v.age)
        result[0].name.first.should.eq('Leticia')
    })
    it('should sort an alpha array', async function () {
        const result = await sortAsync([...SORT_ARRAY])
        result[0].should.eq('1')
        result[12].should.eq('z')
    })
    it('should sort a numeric array', async function () {
        const result = await sortAsync([...INPUT_ARRAY])
        result[0].should.eq(1)
        result[12].should.eq(13)
    })
})
