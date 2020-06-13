"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yielding = yielding;
exports.wrapAsPromise = wrapAsPromise;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _coroutines = _interopRequireDefault(require("./coroutines"));

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
  var frequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var yieldCount = 0;
  return /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var result,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
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
    }, _callee);
  });
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
 * @returns {PromiseFn} a function that can be called to execute the coroutine
 * and return its result on completion
 */


function wrapAsPromise(coroutine) {
  return function () {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    return (0, _coroutines.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.delegateYield(coroutine.apply(void 0, params), "t0", 1);

            case 1:
              return _context2.abrupt("return", _context2.t0);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  };
}