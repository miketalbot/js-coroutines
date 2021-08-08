/**
 *<p>
 * A coroutine to be run during the gaps in other processing and animation.
 *</p>
 * <p>
 * The coroutine should <code>yield</code> regularly to do a time check.  A plain <code>yield</code> will cause
 * a check against the standard time remaining specified when running.  <code>yield {number}</code> will
 * check that <code>number</code> milliseconds are available and <code>yield true</code> will abandon any more
 * processing on the current frame.
 *</p>
 * @callback Coroutine
 * @generator
 * @yields {number} either undefined to perform a standard time remaining check, a number of milliseconds required for the next step or true if we should abandon the current frame
 * @returns the result of the function if any to be returned to the caller
 */

/**
 * @typedef IteratorResult
 * @object
 * @property {any} [value] - the returned value
 * @property {boolean} done - whether the iterator is complete
 */

/**
 * @interface Iterator
 */

/**
 * Get the next value
 * @function
 * @name Iterator#next
 * @param {any} value - value to send to the coroutine
 * @returns {IteratorResult}
 */

/**
 * A coroutine to be used in high priority to animate.
 *
 * Executing a <code>yield</code> will cause the routine to resume at the start
 * of the next frame.
 * @callback AnimationCoroutine
 * @generator
 * @returns the result of the function if any to be returned to the caller
 */


/**
 * @callback GeneratorFunction
 * @generator
 * @param {...*} params - the parameters to pass
 * @returns {*} the result of the coroutine
 */

/**
 * @callback AsyncFunction
 * @param {*} params - the parameters to pass
 * @async
 * @returns {*} result of calling the function
 */



