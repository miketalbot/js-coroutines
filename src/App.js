import React, {useEffect, useRef} from 'react'
import logo from './logo.svg'
import './App.css'
import {parse, stringify,} from './component'
import isEqual from 'lodash/isEqual'
import {sort} from './component/timsort'
import test from './component/yastjson/test/test.json'
import {append, every, forEach, map, reduce} from './component/array-utilities'
import {yielding} from './component/wrappers'
import run, {update} from './component/coroutines'
import {concatAsync, mapAsync, parseAsync, stringifyAsync} from './component/async-wrappers'

const json = JSON.stringify(test)
const referenceObject = JSON.parse(json)

function App() {
    const strings = []
    const {format} = new Intl.NumberFormat()

    const logoRef = useRef()
    const outputRef = useRef()
    useEffect(() => {
        // test();
        animate().then(() => console.log('Done'))
        calculateAsync().then(() => console.log('Calculation Done'))
        asyncFunctions().then(() => console.log('Async done'))
    })
    return (
        <div className="App">
            <header className="App-header">
                <div ref={logoRef} style={{position: 'relative', marginLeft: 0}}>
                    <img src={logo} className="App-logo" alt="logo"/>
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
        let justIds = await mapAsync(o, v => v.id)
        add(`ASYNC: mapped the ids from objects in the array to a new array of ${format(justIds.length)} items`)
        output = await stringifyAsync(justIds)
        add(`ASYNC: stringified just the ids in the array to a ${format(output.length)} character string`)

    }

    async function calculateAsync() {

        return await run(function* () {

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
            //Get the square roots
            const sqrRoot = yield* map(
                results,
                yielding((r) => Math.sqrt(r))
            )
            add(
                `Created a new array with the square roots of ${format(
                    sqrRoot.length
                )} items`
            )
            const asAString = yield* stringify(results)
            add(
                `Stringified ${format(
                    sqrRoot.length
                )} items to JSON string length ${format(asAString.length)}`
            )
            const copy = yield* parse(asAString)
            add(`Parsed JSON back to a copy of ${format(copy.length)} array items`)

            const ok = yield* every(
                copy,
                yielding((v, i) => results[i] === v)
            )
            add(
                `Validated that ${format(copy.length)} parsed values matched - "${
                    ok ? 'ok' : 'mismatch'
                }"`
            )

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
            add(
                `Appended the square roots to the normal values making ${format(
                    results.length
                )} items in the array`
            )
            // Sort the results
            yield* sort(results, (a, b) => a - b)
            add(`Sorted ${format(results.length)} items`)
            return results


        })


    }

    function add(message) {
        requestAnimationFrame(() => {
            strings.push(`<li>${message}</li>`)
            if (outputRef.current) {
                outputRef.current.innerHTML = strings.join('')
            }
        })
    }
}

export default App
