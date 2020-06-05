# js-coroutines

When is the right time to sort a massive array on the main thread of a Javascript app? Well any time you
like if you don't mind the user seeing all of your animations and effects jank to hell. Even transferring
to a worker thread is going to hit the main thread for serialization and stutter everything.

So when is the right time? Well it's in all those gaps where you animation isn't doing anything and the
system is idle. If only you could write something to use up that time and then relinquish control to the
system so it can animate and do the rest of the work, then resume in the next gap. Well now you can...

> Get 60fps while sorting an array of 10 million items with `js-coroutines`

## How it works?

[This dev.to article goes into detail about how js-coutines works](https://dev.to/miketalbot/60fps-javascript-while-stringfying-and-parsing-100mbs-of-json-84l)

## Now supports serializing and deserializing JSON in the "gaps"

You can use `*stringify()` and `*parse()` to manipulate JSON in an idle coroutine that won't
block the main thread.

You can use `stringifyAsync()` and `parseAsync()` to perform JSON parsing and stringifying
anywhere you can take a promise or `await` a response.

## 1.1.33 and onwards support LZ-String compression in the "gaps"

You can use `*compress()` and `*decompress()` to compress to storable/transmittable strings.

You can use `compressAsync()` and `decompressAsync()` to perform compression and decompression
anywhere you can take a promise or `await` a response.

Exports all lz-string flavours using `LZStringGenerator` and `Base64StringGenerator` and direct exports
of all of the methods as `xxxxAsync`. e.g. `compressToEncodedURIComponentAsync(data)`.

[LZ-String GitHub/Documentation](https://github.com/pieroxy/lz-string).

### Wait there's more!

Another super useful way of using coroutines is to animate and control complex states - js-coroutines provides this too with the powerful `update` method that runs every frame in high priority. See below.

See [this CodeSandbox demo](https://codesandbox.io/s/coroutines-examples-zeq33) of stateful animations.

## Installation

```sh
npm install --save js-coroutines
```

## Usage

You can make your own generator functions that do anything you like and `yield` to check
if there is time remaining this frame:

```js
import {run, sort, stringify} from 'js-coroutines'

...

let json = await run(function*() {
  const results = [];
  for(let i = 0; i < 10000000; i++) {
    results.push(Math.random() * 10000);
    //Check how much time left every 100 entries
    if(i % 100 === 0) yield;
  }
  //Pass to a coroutine sort function
  yield* sort(results, value=>value)
  return yield* stringify(results);
})

```

Or you can just use the Async helper functions in an async routine. This is
less powerful, but you don't have to start writing generator functions
or working out where to yield.

```js
import { parseAsync, mapAsync } from "js-coroutines";

async function process(url) {
  const response = await fetch("someurl");
  //Use the coroutine version of parse, rather than blocking
  //the main thread permanently by using .json()
  const result = await parseAsync(await response.text());
  //Imagining the result is some database rows, map out the
  //desired response without blocking the main thread for paints
  const values = await mapAsync(result, (row) => ({
    item: row.time,
    value: row.quantity * row.unitPrice,
  }));
  return values;
}
```

## Demo

See the [Code Sandbox Demo](https://codesandbox.io/s/js-coroutines-json-demo-etyft?file=/src/App.js).

## Getting Started With Async Functions

Async functions are the easiest way to use js-coroutines if you just need to
handle common functions like sorts, finds, filters and JSON parsing in the
background. If you need to break up your own logic you will have to write
a generator.

Just import the `xxxAsync` version of the function from js-coroutines and
use a standard Promise chain or `await` and the code will run only in the
gaps.

```js
async function asyncFunctions() {
  // Parse the JSON async
  let o = await parseAsync(json);
  // Concatenate arrays in the background
  for (let i = 1; i < 12; i++) {
    o = await concatAsync(o, o);
  }
  // Write out the arrays
  let output = await stringifyAsync(o);
  // Map ids from the array in the background
  let justIds = await mapAsync(o, (v) => v.id);
  // Return the JSON of just the ids
  return [output, await stringifyAsync(justIds)];
}
```

## Getting Started Writing Your Own Generators

`js-coroutines` uses generator functions and `requestIdleCallback` to let you easily split up
your work with minimal effort.

To support all legacy browsers you will need to polyfill `requestIdleCallback` [using this polyfill](https://github.com/pladaria/requestidlecallback-polyfill).
```bash
npm i requestidlecallback-polyfill
```

A simple generator:


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

- `forEach`
- `map`
- `filter`
- `reduce`
- `findIndex`
- `find`
- `some`
- `every`
- `sort`
- `append` (array into array)
- `concat` (two arrays into a new array)

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

`yield true` will definitely abandon the current frames work. Useful if you
are about to/just have allocated tons of memory to give time for GC.

`yield* generatorFn([param], [...param])` call a generator function which
will take over yielding time checks and return the value it creates when done.

```js
function* myCoroutine() {
  const results = [];
  for (let i = 1; i < 1000000; i++) {
    if ((i & 127) === 0) yield; //time check
    results.push(i);
  }
  yield true; // end current frame processing
  let anotherArray = new Array(results.length);
  yield true; // give time for GC
  // Run a for loop on the results
  yield* forEach(
    results,
    yielding(
      (result, index, collection) =>
        (anotherArray[index] = result / collection.length)
    )
  );
  return anotherArray;
}
```

### `runAsync(asyncCoroutineFunction, msToLeaveSpare=1, timeout=160) -> TerminatablePromise(Any)`

Same as `run` but requires an `async function *` coroutine.

### `update(coroutine) -> TerminatablePromise(Any)`

Starts an animation / per frame coroutine. Your coroutine will be called
every frame.

`yield` to wait for the next frame.

### `*yielding(fn, [optional frequency=8]) -> function *`

Converts a normal function into one that yields every `frequency` calls.

Very useful for providing map/filter functions etc.

### `wrapAsPromise(coroutine) -> function([params]) -> Promise(Any)`

Returns an async function that can be called with await and will call
the passed in coroutine forwarding parameters.

```js
//Create an async function
const toTuplesAsync = wrapAsPromise(function* (array) {
  let output = [];
  //Create tuples
  for (let i = 0; i < array.length; i += 2) {
    output.push([array[i], array[i + 1]]);
    yield;
  }
  return output;
});

...

async function myProcess() {
  const data = await getDataFromSomewhere();
  //Call your wrapped coroutine
  const tuples = await toTuplesAsync(data);
  //do something with the result
  return processTuplesSomehow(tuples);
}


```

## ARRAY HELPERS

### `*append(destination, source) -> destination`

Appends the contents of a source array to the desination array
as a coroutine.

### `*concat(array1, array2) -> []`

Concatenates two arrays into a new array as a coroutine.

### `*every(array, *filterFn) -> Bool`

Returns true if all items in the array match the filter.

#### CALLBACK `*filterFn(item, index, collection) -> Boolean`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*find(array, *filterFn) -> Any`

Finds this first item in an array which matches a filter function.

#### CALLBACK `*filterFn(item, index, collection) -> Boolean`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*findIndex(array, *filterFn) -> Number`

Finds the index of the first item in an array which matches a filter function.

#### CALLBACK `*filterFn(item, index, collection) -> Boolean`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*filter(array, *filterFn) -> []`

Filters an array by calling a filter function which may yield.

#### CALLBACK `*filterFn(item, index, collection) -> Boolean`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*forEach(array, callbackFn) -> void`

Calls a function on every item in an array, yielding version.

#### CALLBACK `*callbackFn(item, index, collection) -> void`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*map(array, *mapFn) -> []`

Yielding version of array map.

#### CALLBACK `*mapFn(item, index, collection) -> Any`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*parse (JSON) -> Any`

Yielding version of `JSON.parse()`. Parses JSON and returns the value.

Note that although `fetch` responses have an async `json()` method,
it actually blocks the main thread, unlike this call.

### `*reduce(array, reduceFn, initialValue) -> Any`

Runs a reduce as a yielding coroutine. First iteration
will be initialized with the first array value if initialValue
is not defined.

#### CALLBACK `*reduceFn(accumulator, current, index, array) -> Any`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*some(array, *filterFn) -> Bool`

Returns true if any item in the array matches the filter.

#### CALLBACK `*filterFn(item, index, collection) -> Boolean`

Standard callback except provided as a coroutine. You
may wrap a standard function in `yielding()` to get automatic
behaviour.

### `*sort(array, comparison)`

Sorts an array in place while yielding. This function is a coroutine
implementation of Timsort (standard sort used in modern browsers). Timsort
is fast and stable making it ideal for multi-key sorts. It it not as fast
as Quicksort.

#### CALLBACK `comparison(valueExtractor) -> Any | comparison(item1, item2) -> Number (< 0, 0, > 0)`

Either a function to extract a value from an element or a function to compare two elements and return
< 0 | 0 | > 0 depending on the order desired.

### `*stringify (objectOrValue, replacer, spaces ) -> String`

Yielding version of JSON.stringify - will work in idle time

# ASYNC API

You can use the async API to perform the actions that use idle coroutine in any async function.
This might compose better for you in simple circumstances where you just want to parse JSON or
sort for example in between other async operations.

### `appendAsync(destination, source) -> Promise([])`

Appends the contents of a source array to the desination array
as a coroutine.

### `concatAsync(array1, array2) -> Promise([])`

Concatenates two arrays into a new array as a coroutine.

### `compressAsync(String)` -> Promise(String)

Compresses using lz-string to a string representation

### `decompressAsync(String)` -> Promise(String)

Decompresses using lz-string to an inflated string representation

### `everyAsync(array, filterFn) -> Promise(Bool)`

Returns true if all items in the array match the filter.

### `findAsync(array, filterFn) -> Promise(Any)`

Finds this first item in an array which matches a filter function.

### `findIndexAsync(array, filterFn) -> Promise(Number)`

Finds the index of the first item in an array which matches a filter function.

### `filterAsync(array, filterFn) -> Promise([])`

Filters an array by calling a filter function which may yield.

### `forEachAsync(array, callbackFn) -> Promise(void)`

Calls a function on every item in an array, yielding version.

### `mapAsync(array, mapFn) -> Promise([])`

Yielding version of array map.

### `parseAsync(JSON) -> Promise(Any)`

Async version of `JSON.parse()`. Parses JSON and returns the value.

Note that although `fetch` responses have an async `json()` method,
it actually blocks the main thread, unlike this call.

### `reduceAync(Array, reduceFn, initialValue) -> Promise(Any)`

Runs a reduce as an async coroutine. First iteration
will be initialized with the first array value if initialValue
is not defined.

### `someAsync(array, filterFn) -> Promise(Bool)`

Returns true if any item in the array matches the filter.

### `sortAsync(array, comparison) -> Promise()`

Sorts an array in place asynchronously. This function is a yielding
implementation of Timsort (standard sort used in modern browsers). Timsort
is fast and stable making it ideal for multi-key sorts. It it not as fast
as Quicksort.

#### CALLBACK `comparison(valueExtractor) -> Any | comparison(item1, item2) -> Number (< 0, 0, > 0)`

Either a function to extract a value from an element or a function to compare two elements and return
< 0 | 0 | > 0 depending on the order desired.

### `stringifyAsync (objectOrValue, replacer, spaces ) -> Promise(String)`

Async version of JSON.stringify - will work in idle time

## License

js-coroutines - MIT (c) 2020 Mike Talbot

Timsort - MIT (c) 2015 Marco Ziccardi (c) 2020 Mike Talbot (Generator modifications)

JSON stringify - Public Domain (c) 2017 Douglas Crockford (c) 2020 Mike Talbot (Generator modifications)

JSON Parse - yastjson - MIT (c) 2020 5u9ar (zhuyingda) (c) 2020 Mike Talbot (Optimisations and generator modifications)
