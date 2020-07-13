import {parseAsync, stringifyAsync} from '../component'
import test from '../component/yastjson/test/test.json'
const testJSON = JSON.stringify(test)
import {should} from 'chai'

should()

describe('JSON tests', function () {
    it("should stringify JSON", async function () {
        let json = await stringifyAsync({a: 1, c: 2, d: 3})
        json.should.eq('{"a":1,"c":2,"d":3}')
    })
    it("should parse JSON", async function () {
        let item = await parseAsync('{"a":1,"c":2,"d":3,"e":{"a":1}}')
        item.a.should.eq(1)
        item.d.should.eq(3)
        item.e.a.should.eq(1)
    })
    it("should parse realistic json", async function () {
        let item = await parseAsync(testJSON)
        item[0].friends.length.should.eq(3)
    })
    it("should be able to stringify complex JSON", async function () {
        let result = await stringifyAsync(test)
        result.should.eq(testJSON)
    })
    it('should parse uint8', async function () {
        const encoder = new TextEncoder()
        const view = encoder.encode('{"a":1,"c":"岸ヘカラコ高前向へ","d":3,"e":{"a":1}}')
        let item = await parseAsync(view)
        item.c.should.eq('岸ヘカラコ高前向へ')
        item.a.should.eq(1)
        item.d.should.eq(3)
        item.e.a.should.eq(1)
    })

})
