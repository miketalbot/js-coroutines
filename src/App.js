import React, { useRef, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  run,
  runAsync,
  reduce,
  yielding,
  forEach,
  map,
  append,
  update,
} from "./component";
import { sort } from "./component/timsort";

function App() {
  const logoRef = useRef();
  const outputRef = useRef();
  let x = -window.innerWidth / 2;
  useEffect(() => {
    // test();
    animate().then(() => console.log("Done"));
    calculateAsync().then(console.log("Calculation Done"));
  });
  return (
    <div className="App">
      <header className="App-header">
        <div ref={logoRef} style={{ position: "relative", marginLeft: 0 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="info-list">
          <ul ref={outputRef}></ul>
        </div>
      </header>
    </div>
  );

  function animate() {
    let multiplier = window.innerWidth / 300;
    return update(function* () {
      while (true) {
        for (let x = -200; x < 200; x++) {
          logoRef.current.style.marginLeft = `${x * multiplier}px`;
          yield;
        }
        for (let y = 0; y < 200; y++) {
          logoRef.current.style.marginTop = `${y * multiplier}px`;
          yield;
        }
        for (let x = 200; x > -200; x--) {
          logoRef.current.style.marginLeft = `${x * multiplier}px`;
          logoRef.current.style.marginTop = `${((x + 200) * multiplier) / 2}px`;
          yield;
        }
      }
    });
  }

  async function calculateAsync() {
    const { format } = new Intl.NumberFormat();
    return await run(function* () {
      const strings = [];
      let results;
      results = new Array(2000000);
      for (let i = 0; i < 2000000; i++) {
        if ((i & 127) === 0) yield;
        results[i] = (Math.random() * 10000) | 0;
      }
      add(`Created ${format(results.length)} items`);
      //Double all the values
      yield* forEach(
        results,
        yielding((r, i) => (results[i] = r * 2))
      );
      add(`Doubled the value of ${format(results.length)} items`);
      //Get the square roots
      const sqrRoot = yield* map(
        results,
        yielding((r) => Math.sqrt(r))
      );
      add(
        `Created a new array with the square roots of ${format(
          sqrRoot.length
        )} items`
      );
      add(
        `Sum of ${format(results.length)} items is ${format(
          yield* reduce(
            results,
            yielding((c, a) => c + a),
            0
          )
        )}`
      );
      //Join the arrays
      yield* append(results, sqrRoot);
      add(
        `Appended the square roots to the normal values making ${format(
          results.length
        )} items in the array`
      );
      // Sort the results
      yield* sort(results, (a, b) => a - b);
      add(`Sorted ${format(results.length)} items`);
      return results;

      function add(message) {
        requestAnimationFrame(() => {
          strings.push(`<li>${message}</li>`);
          if (outputRef.current) {
            outputRef.current.innerHTML = strings.join("");
          }
        });
      }
    });
  }

  function calculate() {
    let results;
    for (let j = 0; j < 100; j++) {
      results = [];
      for (let i = 0; i < 100000; i++) {
        results.push((Math.random() * 1000) | 0);
      }
      results.sort((a, b) => a - b);
    }
    return results;
  }

  async function test() {
    console.time("non-merged");
    calculate();
    console.timeEnd("non-merged");
    console.time("merged");
    await calculateAsync();
    console.timeEnd("merged");
  }
}

export default App;
