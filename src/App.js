import React, {useEffect, useRef} from 'react'
import logo from './logo.svg'
import './App.css'
import {
    append,
    compressAsync,
    concatAsync,
    decompressAsync,
    every,
    forEach,
    groupByAsync,
    keyByAsync,
    map,
    mapAsync,
    parse,
    parseAsync,
    pipe,
    reduce,
    repeat,
    singleton,
    sort,
    stringify,
    stringifyAsync,
    tap,
    update,
    yielding
} from './component'
import isEqual from 'lodash/isEqual'
import test from './component/yastjson/test/test.json'

const {format} = new Intl.NumberFormat()

const json = JSON.stringify(test)
const referenceObject = JSON.parse(json)

const job = singleton(function* (add) {
    let results
    results = new Array(2000000)
    for (let i = 0; i < 2000000; i++) {
        if ((i & 127) === 0) yield
        results[i] = (Math.random() * 10000) | 0
    }
    add(`Created ${format(results.length)} items`)
    //Double all the values
    yield* forEach(
        results,
        yielding((r, i) => (results[i] = r * 2))
    )
    add(`Doubled the value of ${format(results.length)} items`)

    const result = yield new Promise((resolve) => {
        setTimeout(() => {
            resolve(1234)
        }, 1000)
    })
    add(`Result of a Promise was ${result}`)
    //Get the square roots
    const sqrRoot = yield* map(
        results,
        yielding((r) => Math.sqrt(r))
    )
    add(`Created a new array with the square roots of ${format(sqrRoot.length)} items`)
    const asAString = yield* stringify(results)
    add(`Stringified ${format(sqrRoot.length)} items to JSON string length ${format(asAString.length)}`)
    const copy = yield* parse(asAString)
    add(`Parsed JSON back to a copy of ${format(copy.length)} array items`)

    const ok = yield* every(
        copy,
        yielding((v, i) => results[i] === v)
    )
    add(`Validated that ${format(copy.length)} parsed values matched - "${ok ? 'ok' : 'mismatch'}"`)

    for (let i = 0; i < 1000; i++) {
        yield* parse(json)
    }
    const obj = yield* parse(json)
    if (!isEqual(obj, referenceObject)) {
        console.log(obj, referenceObject)
        add(`Parsed example JSON back to an object 1000 times - "error"`)
    } else {
        add(`Parsed example JSON back to an object 1000 times - "matched"`)
    }

    add(
        `Sum of ${format(results.length)} items is ${format(
            yield* reduce(
                results,
                yielding((c, a) => c + a),
                0
            )
        )}`
    )
    //Join the arrays
    yield* append(results, sqrRoot)
    add(`Appended the square roots to the normal values making ${format(results.length)} items in the array`)
    // Sort the results
    yield* sort(results, (a, b) => a - b)
    add(`Sorted ${format(results.length)} items`)
    return results
}, 'test')

function App() {
    const strings = []
    const [process] = React.useState(() =>
        pipe(
            parseAsync,
            tap((o) => add(`PIPE: parsed JSON to create an array of ${format(o.length)} items`)),
            repeat((i) => concatAsync(i, i), 11),
            tap((o) => add(`PIPE: doubled array 12 times to an array of ${format(o.length)} items`)),
            stringifyAsync,
            tap((o) => add(`PIPE: stringified to a string ${format(o.length)} chars`)),
            compressAsync,
            tap((o) => add(`PIPE: compressed JSON to a string of ${format(o.length)}`)),
            decompressAsync,
            tap((o) => add(`PIPE: decompressed data to a string of ${format(o.length)}`)),
            parseAsync,
            tap((o) => add(`PIPE: hydrated ${format(o.length)} items`)),
            mapAsync.with((v) => v._id),
            tap((o) => add(`PIPE: mapped the ids from objects in the array to a new array of ${format(o.length)}`)),
            stringifyAsync,
            tap((o) => add(`PIPE: new array to a string of length ${format(o.length)}`))
        )
    )

    const logoRef = useRef()
    const outputRef = useRef()
    useEffect(() => {
        // test();
        animate().then(() => console.log('Done'))
        calculateAsync().then(() => console.log('Calculation Done'))
        asyncFunctions().then(() => console.log('Async done'))
        process(json).then(()=>console.log("Pipe done"))
    })
    return (
        <div className="App">
            <header className="App-header">
                <div ref={logoRef} style={{ position: 'relative', marginLeft: 0 }}>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <div className="info-list">
                    <ul ref={outputRef}></ul>
                </div>
            </header>
        </div>
    )

    function animate() {
        let multiplier = window.innerWidth / 300
        return update(function* () {
            while (true) {
                for (let x = -200; x < 200; x++) {
                    logoRef.current.style.marginLeft = `${x * multiplier}px`
                    yield
                }
                for (let y = 0; y < 200; y++) {
                    logoRef.current.style.marginTop = `${y * multiplier}px`
                    yield
                }
                for (let x = 200; x > -200; x--) {
                    logoRef.current.style.marginLeft = `${x * multiplier}px`
                    logoRef.current.style.marginTop = `${((x + 200) * multiplier) / 2}px`
                    yield
                }
            }
        })
    }

    async function asyncFunctions() {
        //Parse the JSON async
        let o = await parseAsync(json)
        add(`ASYNC: parsed JSON to array of ${format(o.length)} items`)
        for (let i = 1; i < 12; i++) {
            o = await concatAsync(o, o)
        }
        add(`ASYNC: doubled the array 12 times to an array of ${format(o.length)} items`)
        let output = await stringifyAsync(o)
        add(`ASYNC: stringified array to a ${format(output.length)} character string`)
        let compressed = await compressAsync(output)
        add(`ASYNC: compressed the output to a string of ${format(compressed.length)} characters`)
        let decompressed = await decompressAsync(compressed)
        add(
            `ASYNC: decompressed the output to a string of ${format(decompressed.length)} characters - ${
                decompressed === output ? 'Matches' : "Didn't match"
            }`
        )
        let justIds = await groupByAsync(o, (v) => {
            return v._id
        })
        let index = await keyByAsync(o, v=>v._id)
        console.log({index})
        add(`ASYNC: mapped the ids from objects in the array to an index of ${format(Object.keys(justIds).length)} items`)
        output = await stringifyAsync(justIds)
        add(`ASYNC: stringified the index to a ${format(output.length)} character string`)


    }

    async function calculateAsync() {
        job(add).then(v=>add(v==='test' ? "TEST SINGLETON PASSED" : 'TEST SINGLETON FAILED'))
        return await job(add)
    }

    function add(message) {
      console.log(message)
        requestAnimationFrame(() => {
            strings.push(`<li>${message}</li>`)
            if (outputRef.current) {
                outputRef.current.innerHTML = strings.join('')
            }
        })
    }
}

export default App
