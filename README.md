# js-coroutines

[![Logo](http://js-coroutines.com/splash.png)](http://js-coroutines.com)

   [![Stargazers repo roster for js-coroutines](https://reporoster.com/stars/miketalbot/js-coroutines)](https://github.com/miketalbot/js-coroutines/stargazers)


**Supports all browsers and React Native**

When is the right time to sort a massive array on the main thread of a Javascript app? Well any time you
like if you don't mind the user seeing all of your animations and effects jank to hell. Even transferring
to a worker thread is going to hit the main thread for serialization and stutter everything.

So when is the right time? Well it's in all those gaps where you animation isn't doing anything and the
system is idle. If only you could write something to use up that time and then relinquish control to the
system so it can animate and do the rest of the work, then resume in the next gap. Well now you can...

**Get 60fps while sorting an array of 10 million items with _js-coroutines_**

## Quick Start

The project's main web site contains examples of js-coroutines in operation, explains how it can provide
benefits to your project and has links to the full API docs plus some examples.

[JS-COROUTINES Overview and API docs](http://js-coroutines.com)


## How it works?

[This dev.to article goes into detail about how js-coroutines works](https://dev.to/miketalbot/60fps-javascript-while-stringfying-and-parsing-100mbs-of-json-84l)

## Demo

See the [Code Sandbox Demo](https://codesandbox.io/s/js-coroutines-json-demo-etyft?file=/src/App.js).

## Animating Using Coroutines

Another super useful way of using coroutines is to animate and control complex states - js-coroutines provides this too with the powerful 
`update` method that runs every frame in high priority. 

There's an example of how to write your own animation later and you 
can see [this CodeSandbox demo](https://codesandbox.io/s/coroutines-examples-zeq33) of stateful animations, or [this game built using js-coroutines](https://codesandbox.io/s/condescending-waterfall-v8mxq), for more.




## Commonly required asynchronous operations

You can use `*stringify()` and `*parse()` to manipulate JSON in an idle coroutine that won't
block the main thread.

You can use `stringifyAsync()` and `parseAsync()` to perform JSON parsing and stringifying
anywhere you can take a promise or `await` a response.

You can use `*compress()` and `*decompress()` to compress to storable/transmittable strings.

You can use `compressAsync()` and `decompressAsync()` to perform compression and decompression
anywhere you can take a promise or `await` a response.


### Compression

js-coroutines uses lz-string for compression.

[LZ-String GitHub/Documentation](https://github.com/pieroxy/lz-string).

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

## Getting Started With Function Pipelines

You can also create pure functional pipelines using pipe, tap, branch, repeat and call

```js
      import {pipe, parseAsync, tap, mapAsync} from 'js-coroutines'

      const process = pipe(
             parseAsync,
             function * (data) {
                let i = 0
                let output = []
                for(let item of data) {
                    output.push({...item, total: item.units * item.price})
                    if((i++ % 100)==0) yield
                }
                return output
             },
             mapAsync.with(v=>({value: v.total, item: v.item})),
             tap(console.log),
             stringifyAsync
         )
         
      ...
      
      console.log(await process(data))
 ```               
                    


## Getting Started Writing Your Own Generators

`js-coroutines` uses generator functions and `requestIdleCallback` to let you easily split up
your work with minimal effort.

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

Former `runAsync` is deprecated. You may yield a Promise instead.
js-coroutines will automatically restart the coroutine when the
Promise is resolved.

```js
const results = await run( function* () {
  const response = yield fetch("http://someurl");
  const rows = yield response.json();
  yield* sort(rows, (a) => a.value);
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

# Writing Coroutines with the API

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

`yield 2` yielding a number results in a check for at least that number of ms remaining.
 
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

## License

js-coroutines - MIT (c) 2020 Mike Talbot

Timsort - MIT (c) 2015 Marco Ziccardi (c) 2020 Mike Talbot (Generator modifications)

JSON stringify - Public Domain (c) 2017 Douglas Crockford (c) 2020 Mike Talbot (Generator modifications)

JSON Parse - yastjson - MIT (c) 2020 5u9ar (zhuyingda) (c) 2020 Mike Talbot (Optimisations and generator modifications)
