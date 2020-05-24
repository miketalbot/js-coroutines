# js-coroutines

When is the right time to sort a massive array on the main thread of a Javascript app? Well any time you
like if you don't mind the user seeing all of your animations and effects jank to hell. Even transferring
to a worker thread is going to hit the main thread for serialization and stutter everything.

So when is the right time? Well it's in all those gaps where you animation isn't doing anything and the
system is idle. If only you could write something to use up that time and then relinquish control to the
system so it can animate and do the rest of the work, then resume in the next gap. Well now you can...

> Get 60fps while sorting an array of 10 milllion items with `js-coroutines`

### Wait there's more!

Another super useful way of using coroutines is to animate and control complex states - js-coroutines provides this too with the powerful `update` method that runs every frame in high priority. See below.

## Installation

```sh
npm install --save js-coroutines
```

## Usage

```js
import {run, sort} from 'js-coroutines'

...

let results = await run(function*() {
  const results = [];
  for(let i = 0; i < 10000000; i++) {
    results.push(Math.random() * 10000);
    //Check how much time left every 100 entries
    if(i % 100 === 0) yield;
  }
  //Pass to a yielding sort function
  yield* sort(results, value=>value)
  return results;
})

```

## Demo

See the [Code Sandbox Demo](https://codesandbox.io/s/js-coroutines-demo-gc2jc?file=/src/App.js:1798-3097).

## Getting Started

`js-coroutines` uses generator functions and `requestIdleCallback` (polyfilled) to let you easily split up
your work with minimal effort.

```js
await run(function* () {
  const strings = [];
  let results;

  //Create 2 million rows of random values
  results = new Array(2000000);
  for (let i = 0; i < 2000000; i++) {
    //Every 128th record, check to see if we still have time
    //run the remainder on another tick if we don't
    if ((i & 127) === 0) yield;
    results[i] = (Math.random() * 10000) | 0;
  }

  //Double all the values
  yield* forEach(
    results,
    yielding((r, i) => (results[i] = r * 2))
  );

  //Get the square roots
  const sqrRoot = yield* map(
    results,
    yielding((r) => Math.sqrt(r))
  );

  //Sum all of the items
  const sum = yield* reduce(
    results,
    yielding((c, a) => c + a, 64),
    0
  );

  //Join the arrays
  yield* append(results, sqrRoot);

  // Sort the results
  yield* sort(results, (a, b) => a - b);
  return results;
});
```

As you can probably see, it comes ready with the most useful functions for arrays:

- forEach
- map
- filter
- reduce
- findIndex
- find
- some
- every
- sort
- append (array to array)
- concat (two arrays into a new array)

The helper `yielding` wraps a normal function as a generator and checks remaining time
every few iterations. You can see it in use above. It's just a helper though - if
your `map` function needs to do more work it can just be a generator itself,
yield when it likes and also pass on to deeper functions that can yield:

```js
const results =
  yield *
  map(inputArray, function* (element, index) {
    //Every 200 indices give up work
    //on this frame by yielding 'true'
    //yield without true, checks the amount
    //of remaining time
    if (index % 200 === 199) yield true;

    //Yield out a filter operation
    let matched = yield* filter(
      element,
      yielding((c) => c > 1000)
    );

    //Now yield out the calculation of a sum
    return yield* reduce(
      matched,
      yielding((c, a) => c + a),
      0
    );
  });
```

`yielding(fn, [optional yieldFrequency]) -> function *`

##

## Async

You may also use async generators by calling `runAsync` instead
of `run`. These can call and await promises themselves - be aware
though that this is a little slower, during the check for time
remaining phase so it's better to await a `run` call
for an inner generator when you are inbetween async calls and
are running something that may check often - like `sort`.

```js
const results = await runAsync(async function* () {
  const response = await fetch("http://someurl");
  const rows = await response.json();
  const processed = await run(function* () {
    yield* sort(rows, (a) => a.value);
    return rows;
  });
  return processed;
});
```

# Update coroutines

A great way to do stateful animation is using a coroutine running every frame.
In this case when you `yield` you get called back on the next frame making
stateful animations a piece of cake:

```js
import { update } from "js-coroutines";

//Animate using a coroutine for state
update(function* () {
  while (true) {
    //Move left to right
    for (let x = -200; x < 200; x++) {
      logoRef.current.style.marginLeft = `${x * multiplier}px`;
      yield;
      //Now we are on the next frame
    }
    //Move top to bottom
    for (let y = 0; y < 200; y++) {
      logoRef.current.style.marginTop = `${y * multiplier}px`;
      yield;
    }
    //Move diagonally back
    for (let x = 200; x > -200; x--) {
      logoRef.current.style.marginLeft = `${x * multiplier}px`;
      logoRef.current.style.marginTop = ((x + 200) * multiplier) / 2 + "px";
      yield;
    }
  }
});
```

# API

### `run(coroutineFunction, msToLeaveSpare=1, timeout=160) -> TerminatablePromise(Any)`

`coroutineFunction` must be a `function *`

Run your coroutine, which will occupy up to the last amount of
m/s specified in the `msToLeaveSpare` (0.5 is the minimum) of the idle
time on the thread. `timeout` specifies the time before it will run
if there is no idle time (default 1/10 frames).

The promise returned has a `terminate(result)` function that can be used
to stop the calculation early - maybe you want to go again with different
parameters.

`yield` inside your coroutine will check how much time is left and continue
if there is enough.

`yield true` will definitely abandom the current frames work. Useful if you
are about to/just have allocated tons of memory to give time for GC.

### `runAsync(asyncCoroutineFunction, msToLeaveSpare=1, timeout=160) -> TerminatablePromise(Any)`

Same as `run` but requires an `async function *` coroutine.

### `update(coroutine)`

Starts an animation / per frame coroutine. Your coroutine will be called
every frame.

`yield` to wait for the next frame.

## License

js-coroutines - MIT (c) 2020 Mike Talbot

Timsort - MIT (c) 2015 Marco Ziccardi (c) 2020 Mike Talbot (Generator modifications)
