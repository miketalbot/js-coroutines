


export declare class TerminatablePromise<T> extends Promise<T> {
    terminate(value: T): void
}

export declare interface ChainableFunction {
    (...params: any[]) : TerminatablePromise<any>
    join(promise: TerminatablePromise<unknown>) : TerminatablePromise<unknown>
}

export declare function forEach(collection: any, fn: Function): Generator<any, any, any>;

/**
 * @returns array of elements matching the filter
 */
export declare function filter(collection: any, fn: Function): Generator<any, any, any>;

/**
 * @returns The result of processing the reduction function on all
 * of the items in the array
 */
export declare function reduce(collection: any, fn: Function, initialValue?: any): Generator<any, any, any>;

/**
 * Concatenate two arrays into a new array
 * @returns the concatenated arrays
 */
export declare function concat(array1: any[], array2: any[]): Generator<any, any[], any>;

/**
 * Appends one array to another
 * @param array1 - the destination
 * @param array2 - the source
 * @returns returns <code>array1</code>
 */
export declare function append(array1: any[], array2: any[]): Generator<any, any[], any>;

/**
 * @returns new array of mapped values
 */
export declare function map(collection: any, fn: Function): Generator<any, any[], any>;

/**
 * @returns the first matching value in the array or null
 */
export declare function find(collection: any, fn: Function): Generator<any, any, any>;

/**
 * @returns Index of matching element or -1
 */
export declare function findIndex(array: any[], fn: Function): Generator<any, number, any>;

/**
 * @returns true if at least one item matched the filter
 */
export declare function some(array: any[], fn: Function): boolean;

/**
 * @returns true if all of the array items matched the filter
 */
export declare function every(array: any[], fn: Function): boolean;

/**
 * Asynchronously stringify data into JSON
 * @param data - Object to store
 * @returns a Promise for the JSON representation of <code>data</code>
 */
export declare function stringifyAsync(data: any): TerminatablePromise<String>;

/**
 * Asynchronously parse JSON into an object
 * @param json - the JSON to be parsed
 * @returns a Promise for the parsed JSON
 */
export declare function parseAsync(json: string): TerminatablePromise<any>;


/**
 * Creates a generator for an array with the unique values from the
 * input array, the routine is supplied with a
 * function that determines on what the array should
 * be made unique.
 * @param {Array} array
 * @param {Map} [fn] - the function to determine uniqueness, if
 * omitted then the item itself is used
 * @returns {Generator<*, [], *>}
 */
export declare function uniqueBy(array: [], fn: Function): Generator<any, [], any>

/**
 * Creates a generator for an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is an collection of the elements responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, {}, *>} a generator for the new object
 */
export declare function groupBy(collection: [] | {}, fn: Function): Generator<any, {}, any>

/**
 * Creates an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is the last element responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, {}, *>} a generator for the new object
 */
export declare function keyBy(collection: []|{}, fn: Function): Generator<any, {}, any>

/**
 * Returns a generator for the last index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Generator<any, number, any>} a generator that returns the last index of the item or -1
 */
export declare function lastIndexOf(array: [], value: any): Generator<any, number, any>


/**
 * Returns a generator for an index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Generator<any, number, any>} a generator that returns the index of the item or -1
 */
export declare function indexOf(array: [], value: any): Generator<any, number, any>

/**
 * Returns a generator returning true if an array includes a value
 * @param array
 * @param value
 * @returns {Generator<*, boolean, *>}
 */
export declare function includes(array: [], value: any): Generator<any, boolean, any>;

/**
 * Creates a promise for an array with the unique values from the
 * input array, the routine is supplied with a
 * function that determines on what the array should
 * be made unique.
 * @param {Array} array
 * @param {Map} [fn] - the function to determine uniqueness, if
 * omitted then the item itself is used
 * @returns {Promise<[]>}
 */
export declare function uniqueByAsync(array: [], fn: Function): TerminatablePromise<[]>

/**
 * Creates a promise for an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is an collection of the elements responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Promise<{}>} a generator for the new object
 */
export declare function groupByAsync(collection: [] | {}, fn: Function): TerminatablePromise<{}>

/**
 * Creates promise for an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is the last element responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Promise<{}>} a generator for the new object
 */
export declare function keyByAsync(collection: [] | {}, fn: Function): TerminatablePromise<{}>

/**
 * Returns a promise for the last index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>} a generator that returns the last index of the item or -1
 */
export declare function lastIndexOf(array: [], value: any): TerminatablePromise<Number>


/**
 * Returns a promise for an index of an item in an array
 * @param array - the array to scan
 * @param value - the value to search for
 * @returns {Promise<Number>} a generator that returns the index of the item or -1
 */
export declare function indexOf(array: [], value: any): TerminatablePromise<number>

/**
 * Returns a promise for true if an array includes a value
 * @param array
 * @param value
 * @returns {Promise<Boolean>}
 */
export declare function includes(array: [], value: any): TerminatablePromise<Boolean>;



/**
 * Sort an array (in place) by a sorting function
 * @example
 * async function process(data) {
 *     return await sortAsync(data, v=>v.someProperty)
 * }
 * @param array - The array to sort
 * @param sort - The method to sort the array
 * @returns a promise for the sorted array
 * @example
 *
 * await sortAsync(myArray, v=>v.lastName)
 */
export declare function sortAsync(array: any[], sort: Function): TerminatablePromise<any[]>;

/**
 * Finds an item in an array asynchronously
 * @returns promise for the item found or null if no match
 * @example
 *
 * const firstToProcess = await findAsync(jobs, job=>job.done === false)
 */
export declare function findAsync(collection: []|{}, filter: Function): TerminatablePromise<any | null>;

/**
 * Finds an item index in an array asynchronously
 * @returns promise for the index of the first item to pass the filter or -1
 * @example
 * let firstItem = await findIndexAsync(jobs, job=>!!job.error)
 */
export declare function findIndexAsync(collection: []|{}, filter: Function): TerminatablePromise<Number>;

/**
 * Functions the contents of an array asynchronously
 * @returns promise for the mapped array
 * @example
 *
 * const updated = await mapAsync(myItems, item=>({name: item.name, value: item.quantity * item.cost}))
 */
export declare function mapAsync(collection: []|{}, mapFn: Function): TerminatablePromise<[]|{}>;

/**
 * Functions an array asynchronously
 * @returns promise for the filtered array
 * @example
 * const errorJobs = await filterAsync(
 */
export declare function filterAsync(collection: []|{}, filter: Function): TerminatablePromise<[]|{}>;

/**
 * Performs a reduce on an array asynchronously
 * @returns a promise for the reduced value
 */
export declare function reduceAsync(array: any[], reduceFn: Function, initialValue: any): TerminatablePromise<any>;

/**
 * Appends one array to another asynchronously
 * @returns a promise for destination after appending
 */
export declare function appendAsync(destination: any[], source: any[]): TerminatablePromise<any[]>;

/**
 * Concatenates 2 arrays into a new array
 * @returns a promise for combined array
 */
export declare function concatAsync(array1: any[], array2: any[]): TerminatablePromise<any[]>;

/**
 * Asynchronously loop over the elements of an array
 * @returns promise for the end of the operation
 */
export declare function forEachAsync(collection: []|{}, fn: Function): TerminatablePromise<void>;

/**
 * Asynchronously apply an array <code>some</code> operation
 * returning a promise for <code>true</code> if at least
 * one item matches
 * @returns promise for true if at least one item matched the filter
 */
export declare function someAsync(array: any[], fn: Function): TerminatablePromise<Boolean>;

/**
 * Asynchronously check if every element in an array matches
 * a predicate
 * @returns promise for true if all items matched the filter
 */
export declare function everyAsync(array: any[], fn: Function): TerminatablePromise<Boolean>;

/**
 * Asynchronously compress a string to a base64 format
 * @param source - the data to compress
 * @returns a promise for the base64 compressed data
 */
export declare function compressToBase64Async(source: string): TerminatablePromise<String>;

/**
 * Asynchronously compress a string to a utf16 string
 * @param source - the data to compress
 * @returns a promise for the utf16 compressed data
 */
export declare function compressToUTF16Async(source: string): TerminatablePromise<String>;

/**
 * Asynchronously compress a string to a Uint8Array
 * @param source - the data to compress
 * @returns a promise for the Uint8Array of compressed data
 */
export declare function compressToUint8ArrayAsync(source: string): TerminatablePromise<Uint8Array>;

/**
 * Asynchronously compress a string to a URI safe version
 * @param source - the data to compress
 * @returns a promise for the string of compressed data
 */
export declare function compressToEncodedURIComponentAsync(source: string): TerminatablePromise<String>;

/**
 * Asynchronously compress a string of data with lz-string
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function compressAsync(source: string): TerminatablePromise<String>;

/**
 * Asynchronously apply lz-string base64 remapping of a string to utf16
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function base64CompressToUTF16Async(source: string): TerminatablePromise<String>;

/**
 * Asynchronously apply lz-string base64 remapping of a string
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function base64CompressAsync(source: string): TerminatablePromise<String>;

/**
 * Asynchronously compress a string to a base64 format
 * @param source - the data to compress
 * @returns a promise for the base64 compressed data
 */
export declare function compressToBase64Async(source: string): TerminatablePromise<String>;

/**
 * Asynchronously decompress a string from a utf16 source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromUTF16Async(compressedData: string): TerminatablePromise<String>;

/**
 * Asynchronously decompress a string from a utf16 source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromUint8ArrayAsync(compressedData: string): TerminatablePromise<String>;

/**
 * Asynchronously decompress a string from a URL safe URI Component encoded source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromEncodedURIComponentAsync(compressedData: string): TerminatablePromise<String>;

/**
 * Asynchronously decompress a string from a string source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressAsync(compressedData: string): TerminatablePromise<String>;

/**
 * Asynchronously unmap base64 encoded data to a utf16 destination
 * @param base64Data - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function base64decompressFromUTF16Async(base64Data: string): TerminatablePromise<String>;

/**
 * Asynchronously unmap base64 encoded data
 * @param base64Data - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function base64Decompress(base64Data: string): TerminatablePromise<String>;

/**
 * <p>
 *     Starts an idle time coroutine and returns a promise for its completion and
 *      any value it might return.
 * </p>
 * <p>
 *     You may pass a coroutine function or the result of calling such a function.  The
 *     latter helps when you must provide parameters to the coroutine.
 * </p>
 * @example
 * async function process() {
 *     let answer = await run(function * () {
 *         let total = 0
 *         for(let i=1; i < 10000000; i++) {
 *            total += i
 *            if((i % 100) === 0) yield
 *         }
 *         return total
 *     })
 *     ...
 * }
 *
 * // Or
 *
 * async function process(param) {
 *     let answer = await run(someCoroutine(param))
 * }
 * @param coroutine - the routine to run or an iterator for an already started coroutine
 * @param [loopWhileMsRemains = 1 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param [timeout = 160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns the result of the coroutine
 */
export declare function run(coroutine: Function|Generator, loopWhileMsRemains?: number, timeout?: number): TerminatablePromise<any>;

/**
 * Start an animation coroutine, the animation will continue until
 * you return and will be broken up between frames by using a
 * <code>yield</code>.
 * @param coroutine - The animation to run
 * @param [params] - Parameters to be passed to the animation function
 * @returns a value that will be returned to the caller
 * when the animation is complete.
 */
export declare function update(coroutine: Function|Generator, ...params: any[]): TerminatablePromise<any>;

/**
 * Starts an idle time coroutine using an async generator - this is NOT normally required
 * and the performance of such routines is slower than ordinary coroutines.  This is included
 * in case of an edge case requirement.
 * @param coroutine - the routine to run
 * @param [loopWhileMsRemains = 1 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param [timeout = 160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns the result of the coroutine
 */
export declare function runAsync(coroutine: Function|Generator, loopWhileMsRemains?: number, timeout?: number): TerminatablePromise<any>;

/**
 * Wraps a normal function into a generator function
 * that <code>yield</code>s on a regular basis
 * @param fn - the function to be wrapped
 * @param [frequency = 8] - the number of times the function should be called
 *    before performing a <code>yield</code>
 * @returns The wrapped yielding
 * version of the function passed
 */
export declare function yielding(fn: (...params: any[]) => any, frequency?: number): (...params: any[]) => Generator;

/**
 * Returns a function that will execute the passed
 * Coroutine and return a Promise for its result. The
 * returned function will take any number of parameters
 * and pass them on to the coroutine.
 * @param coroutine - The coroutine to run
 * @returns a function that can be called to execute the coroutine
 * and return its result on completion
 */
export declare function wrapAsPromise(coroutine: ()=>Generator): Function;

export declare function pipe(...functions: Array<Function>|Array<Array<Function>>) : any
export declare function tap(fn: Function) : Function;
export declare function branch(fn: Function) : Function;
export declare function repeat(fn: Function, times: Number) : Function;
export declare function call(fn: Function, ...parameters: any[]) : Function

/**
 * Call with true to use the polyfilled version of
 * the idle callback, can be more stable in certain
 * circumstances
 * @param {Boolean} internal
 */
export declare function useInternalEngine(internal: Boolean) : void;

/**
 * Creates a singleton executor of a generator function.
 * If the function is currently running it will be
 * terminated with the defaultValue and a new one started
 * @param {Function} fn - the generator function to wrap
 * @param {any} [defaultValue] - a value to be returned if the current execution is
 * terminated by a new one starting
 * @returns {ChainableFunction} a function to execute the
 * generator and return the value
 */
export declare function singleton(fn: Function, defaultValue?: any) : ChainableFunction
