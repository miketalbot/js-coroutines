"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yielding = yielding;
exports.wrapAsPromise = wrapAsPromise;
exports.curryRight = curryRight;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _coroutines = _interopRequireWildcard(require("./coroutines"));

/**
 * Wraps a normal function into a generator function
 * that <code>yield</code>s on a regular basis
 * @param {Function} fn - the function to be wrapped
 * @param {number} [frequency=8] -
 *    the number of times the function should be called
 *    before performing a <code>yield</code>
 * @returns {Coroutine} The wrapped yielding
 * version of the function passed
 */
function yielding(fn) {
  var frequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var yieldCount = 0;
  if (fn._yielding) return fn;

  var result = /*#__PURE__*/_regenerator.default.mark(function result() {
    var result,
        _args = arguments;
    return _regenerator.default.wrap(function result$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = fn.apply(void 0, _args);

            if (!(yieldCount++ % frequency === 0)) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return;

          case 4:
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, result);
  });

  result._yielding = true;
  return result;
}
/**
 * @callback PromiseFn
 * @param {...*} [parameters] the parameters for the function
 * @return {Promise} a promise for the result of the function
 */

/**
 * Returns a function that will execute the passed
 * Coroutine and return a Promise for its result. The
 * returned function will take any number of parameters
 * and pass them on to the coroutine.
 *
 * @param {Coroutine} coroutine - The coroutine to run
 * @returns {PromiseFn|Function} a function that can be called to execute the coroutine
 * and return its result on completion
 */


function wrapAsPromise(coroutine) {
  var result = function result() {
    return (0, _coroutines.default)(coroutine.apply(void 0, arguments));
  };

  result.with = function () {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    return _coroutines.call.apply(void 0, [result].concat(params));
  };

  return result;
}

function curryRight(fn, supplied, execute) {
  if (fn.length > supplied.length) {
    return function () {
      for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      return curryRight.call(this, fn, [].concat(params, (0, _toConsumableArray2.default)(supplied)), execute);
    };
  }

  return execute.apply(this, supplied);
}