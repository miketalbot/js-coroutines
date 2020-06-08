
export declare function forEach(array: any[], fn: Function): void;

/**
 * @returns array of elements matching the filter
 */
export declare function filter(array: any[], fn: Function): any;

/**
 * @returns The result of processing the reduction function on all
 * of the items in the array
 */
export declare function reduce(array: any[], fn: Function, initialValue?: any): any;

/**
 * Concatenate two arrays into a new array
 * @returns the concatenated arrays
 */
export declare function concat(array1: any[], array2: any[]): any[];

/**
 * Appends one array to another
 * @param array1 - the destination
 * @param array2 - the source
 * @returns returns <code>array1</code>
 */
export declare function append(array1: any[], array2: any[]): any[];

/**
 * @returns new array of mapped values
 */
export declare function map(array: any[], fn: Function): any[];

/**
 * @returns the first matching value in the array or null
 */
export declare function find(array: any[], fn: Function): any;

/**
 * @returns Index of matching element or -1
 */
export declare function findIndex(array: any[], fn: Function): number;

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
export declare function stringifyAsync(data: any): Promise<String>;

/**
 * Asynchronously parse JSON into an object
 * @param json - the JSON to be parsed
 * @returns a Promise for the parsed JSON
 */
export declare function parseAsync(json: string): Promise<any>;

/**
 * Sort an array (in place) by a sorting function
 * @example
 * async function process(data) {
 *     return await sortAsync(data, v=>v.someProperty)
 * }
 * @param array - The array to sort
 * @param sort - The method to sort the array
 * @returns a promise for the sorted array
 */
export declare function sortAsync(array: any[], sort: Function): Promise<any[]>;

/**
 * Finds an item in an array asynchronously
 * @returns promise for the item found or null if no match
 */
export declare function findAsync(array: any[], filter: Function): Promise<any | null>;

/**
 * Finds an item index in an array asynchronously
 * @returns promise for the index of the first item to pass the filter or -1
 */
export declare function findIndexAsync(array: any[], filter: Function): Promise<Number>;

/**
 * Functions the contents of an array asynchronously
 * @returns promise for the mapped array
 */
export declare function mapAsync(array: any[], mapFn: Function): Promise<any[]>;

/**
 * Functions an array asynchronously
 * @returns promise for the filtered array
 */
export declare function filterAsync(array: any[], filter: Function): Promise<any[]>;

/**
 * Performs a reduce on an array asynchronously
 * @returns a promise for the reduced value
 */
export declare function reduceAsync(array: any[], reduceFn: Function, initialValue: any): Promise<any>;

/**
 * Appends one array to another asynchronously
 * @returns a promise for destination after appending
 */
export declare function appendAsync(destination: any[], source: any[]): Promise<any[]>;

/**
 * Concatenates 2 arrays into a new array
 * @returns a promise for combined array
 */
export declare function concatAsync(array1: any[], array2: any[]): Promise<any[]>;

/**
 * Asynchronously loop over the elements of an array
 * @returns promise for the end of the operation
 */
export declare function forEachAsync(array: any[], fn: Function): Promise;

/**
 * Asynchronously apply an array <code>some</code> operation
 * returning a promise for <code>true</code> if at least
 * one item matches
 * @returns promise for true if at least one item matched the filter
 */
export declare function someAsync(array: any[], fn: Function): Promise<Boolean>;

/**
 * Asynchronously check if every element in an array matches
 * a predicate
 * @returns promise for true if all items matched the filter
 */
export declare function everyAsync(array: any[], fn: Function): Promise<Boolean>;

/**
 * Asynchronously compress a string to a base64 format
 * @param source - the data to compress
 * @returns a promise for the base64 compressed data
 */
export declare function compressToBase64Async(source: string): Promise<String>;

/**
 * Asynchronously compress a string to a utf16 string
 * @param source - the data to compress
 * @returns a promise for the utf16 compressed data
 */
export declare function compressToUTF16Async(source: string): Promise<String>;

/**
 * Asynchronously compress a string to a Uint8Array
 * @param source - the data to compress
 * @returns a promise for the Uint8Array of compressed data
 */
export declare function compressToUint8ArrayAsync(source: string): Promise<Uint8Array>;

/**
 * Asynchronously compress a string to a URI safe version
 * @param source - the data to compress
 * @returns a promise for the string of compressed data
 */
export declare function compressToEncodedURIComponentAsync(source: string): Promise<String>;

/**
 * Asynchronously compress a string of data with lz-string
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function compressAsync(source: string): Promise<String>;

/**
 * Asynchronously apply lz-string base64 remapping of a string to utf16
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function base64CompressToUTF16Async(source: string): Promise<String>;

/**
 * Asynchronously apply lz-string base64 remapping of a string
 * @param source - the data to compress
 * @returns a promise for the compressed data
 */
export declare function base64CompressAsync(source: string): Promise<String>;

/**
 * Asynchronously compress a string to a base64 format
 * @param source - the data to compress
 * @returns a promise for the base64 compressed data
 */
export declare function compressToBase64Async(source: string): Promise<String>;

/**
 * Asynchronously decompress a string from a utf16 source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromUTF16Async(compressedData: string): Promise<String>;

/**
 * Asynchronously decompress a string from a utf16 source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromUint8ArrayAsync(compressedData: string): Promise<String>;

/**
 * Asynchronously decompress a string from a URL safe URI Component encoded source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressFromEncodedURIComponentAsync(compressedData: string): Promise<String>;

/**
 * Asynchronously decompress a string from a string source
 * @param compressedData - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function decompressAsync(compressedData: string): Promise<String>;

/**
 * Asynchronously unmap base64 encoded data to a utf16 destination
 * @param base64Data - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function base64decompressFromUTF16Async(base64Data: string): Promise<String>;

/**
 * Asynchronously unmap base64 encoded data
 * @param base64Data - the data to decompress
 * @returns a promise for the uncompressed data
 */
export declare function base64Decompress(base64Data: string): Promise<String>;

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
export declare function run(coroutine: Function, loopWhileMsRemains?: number, timeout?: number): Promise<any>;

/**
 * Start an animation coroutine, the animation will continue until
 * you return and will be broken up between frames by using a
 * <code>yield</code>.
 * @param coroutine - The animation to run
 * @param [params] - Parameters to be passed to the animation function
 * @returns a value that will be returned to the caller
 * when the animation is complete.
 */
export declare function update(coroutine: Function, ...params?: any[]): Promise<any>;

/**
 * Starts an idle time coroutine using an async generator - this is NOT normally required
 * and the performance of such routines is slower than ordinary coroutines.  This is included
 * in case of an edge case requirement.
 * @param coroutine - the routine to run
 * @param [loopWhileMsRemains = 1 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param [timeout = 160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns the result of the coroutine
 */
export declare function runAsync(coroutine: Function, loopWhileMsRemains?: number, timeout?: number): Promise<any>;

/**
 * Wraps a normal function into a generator function
 * that <code>yield</code>s on a regular basis
 * @param fn - the function to be wrapped
 * @param [frequency = 8] - the number of times the function should be called
 *    before performing a <code>yield</code>
 * @returns The wrapped yielding
 * version of the function passed
 */
export declare function yielding(fn: (...params: any[]) => any, frequency?: number): Function;

/**
 * Returns a function that will execute the passed
 * Coroutine and return a Promise for its result. The
 * returned function will take any number of parameters
 * and pass them on to the coroutine.
 * @param coroutine - The coroutine to run
 * @returns a function that can be called to execute the coroutine
 * and return its result on completion
 */
export declare function wrapAsPromise(coroutine: Function): Function;

