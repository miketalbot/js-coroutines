"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEngine = setEngine;
exports.run = run;
exports.update = update;
exports.runAsync = runAsync;
exports.pipe = pipe;
exports.tap = tap;
exports.branch = branch;
exports.call = call;
exports.repeat = repeat;
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _polyfill = require("./polyfill");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var request = window.requestIdleCallback;

function setEngine(internal) {
  request = internal ? (0, _polyfill.getCallback)() : request;
}
/**
 * <p>
 *     Starts an idle time coroutine and returns a promise for its completion and
 *      any value it might return.
 * </p>
 * <p>
 *     You may pass a coroutine function or the result of calling such a function.  The
 *     latter helps when you must provide parameters to the coroutine.
 * </p>
 * @param {Coroutine|Iterator} coroutine the routine to run or an iterator for an already started coroutine
 * @param {number} [loopWhileMsRemains=2 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param {number} [timeout=160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns {Promise<any>} the result of the coroutine
 * <strong>The promise returned by <code>run</code> has a <code>terminate()</code> method
 * that can be used to stop the routine.</strong>
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
 */


function run(coroutine) {
  var loopWhileMsRemains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 32 * 10;
  var terminated = false;
  var resolver = null;
  var result = new Promise(function (resolve, reject) {
    resolver = resolve;
    var iterator = coroutine.next ? coroutine : coroutine(); // Request a callback during idle

    request(run); // Handle background processing when tab is not active

    var id = setTimeout(runFromTimeout, timeout);
    var parameter = undefined;

    function run(_x) {
      return _run.apply(this, arguments);
    }

    function _run() {
      _run = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(api) {
        var minTime, _iterator$next, value, done;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                clearTimeout(id); // Stop the timeout version

                if (!terminated) {
                  _context.next = 4;
                  break;
                }

                iterator.return();
                return _context.abrupt("return");

              case 4:
                minTime = Math.max(0.5, loopWhileMsRemains);
                _context.prev = 5;

              case 6:
                _context.t0 = iterator;
                _context.next = 9;
                return parameter;

              case 9:
                _context.t1 = _context.sent;
                _iterator$next = _context.t0.next.call(_context.t0, _context.t1);
                value = _iterator$next.value;
                done = _iterator$next.done;
                parameter = undefined;

                if (!done) {
                  _context.next = 17;
                  break;
                }

                resolve(value);
                return _context.abrupt("return");

              case 17:
                if (!(value === true)) {
                  _context.next = 21;
                  break;
                }

                return _context.abrupt("break", 23);

              case 21:
                if (typeof value === 'number') {
                  minTime = +value;
                  if (isNaN(minTime)) minTime = 1;
                } else if (value && value.then) {
                  parameter = value;
                }

              case 22:
                if (api.timeRemaining() > minTime) {
                  _context.next = 6;
                  break;
                }

              case 23:
                _context.next = 29;
                break;

              case 25:
                _context.prev = 25;
                _context.t2 = _context["catch"](5);
                reject(_context.t2);
                return _context.abrupt("return");

              case 29:
                // Request an idle callback
                request(run); // Request again on timeout

                id = setTimeout(runFromTimeout, timeout);

              case 31:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 25]]);
      }));
      return _run.apply(this, arguments);
    }

    function runFromTimeout() {
      var budget = 8.5;
      var start = performance.now();
      run({
        timeRemaining: function timeRemaining() {
          return budget - (performance.now() - start);
        }
      });
    }
  });

  result.terminate = function (result) {
    terminated = true;

    if (resolver) {
      resolver(result);
    }
  };

  return result;
}

var requested = false;
var animationCallbacks = [];

function nextAnimationFrame(fn) {
  if (animationCallbacks.length === 0 && !requested) {
    requested = true;
    requestAnimationFrame(process);
  }

  animationCallbacks.push(fn);
}

function process() {
  var callbacks = animationCallbacks;

  if (callbacks.length) {
    requestAnimationFrame(process);
  } else {
    requested = false;
  }

  animationCallbacks = [];

  var _iterator = _createForOfIteratorHelper(callbacks),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var callback = _step.value;
      callback();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
/**
 * Start an animation coroutine, the animation will continue until
 * you return and will be broken up between frames by using a
 * <code>yield</code>.
 *
 * @param {AnimationCoroutine|Iterator} coroutine - The animation to run
 * @param {...*} [params] - Parameters to be passed to the animation function
 * @returns {Promise<any>} a value that will be returned to the caller
 * when the animation is complete.
 * <strong>The promise returned by <code>update</code> has a <code>terminate()</code> method
 * that can be used to stop the routine.</strong>
 */


function update(coroutine) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  var terminated = false;
  var resolver = null;
  var result = new Promise(function (resolve, reject) {
    resolver = resolve;
    var iterator = coroutine.next ? coroutine : coroutine.apply(void 0, params);
    nextAnimationFrame(run);

    function run() {
      if (terminated) {
        iterator.return();
        return;
      }

      try {
        var _iterator$next2 = iterator.next(),
            value = _iterator$next2.value,
            done = _iterator$next2.done;

        if (done) {
          resolve(value);
          return;
        }
      } catch (e) {
        reject(e);
        return;
      }

      nextAnimationFrame(run);
    }
  });

  result.terminate = function (result) {
    terminated = true;

    if (resolver) {
      resolver(result);
    }
  };

  return result;
}
/**
 * @deprecated
 * Starts an idle time coroutine using an async generator - <strong>this is NOT normally required
 * and the performance of such routines is slower than ordinary coroutines</strong>.  This is included
 * in case of an edge case requirement.
 * @param {Coroutine|Iterator} coroutine - the routine to run
 * @param {number} [loopWhileMsRemains=1 (ms)] - if less than the specified number of milliseconds remain the coroutine will continue in the next idle frame
 * @param {number} [timeout=160 (ms)] - the number of milliseconds before the coroutine will run even if the system is not idle
 * @returns {Promise<any>} the result of the coroutine
 */


function runAsync(coroutine) {
  var loopWhileMsRemains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 160;
  var options = {
    timeout: timeout
  };
  var terminated = false;
  var resolver = null;
  var result = new Promise( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(resolve, reject) {
      var iterator, run, _run2;

      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _run2 = function _run4() {
                _run2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(api) {
                  var minTime, _yield$iterator$next, value, done;

                  return _regenerator.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!terminated) {
                            _context2.next = 3;
                            break;
                          }

                          iterator.return();
                          return _context2.abrupt("return");

                        case 3:
                          minTime = Math.max(0.5, loopWhileMsRemains);
                          _context2.prev = 4;

                        case 5:
                          _context2.next = 7;
                          return iterator.next();

                        case 7:
                          _yield$iterator$next = _context2.sent;
                          value = _yield$iterator$next.value;
                          done = _yield$iterator$next.done;

                          if (!done) {
                            _context2.next = 13;
                            break;
                          }

                          resolve(value);
                          return _context2.abrupt("return");

                        case 13:
                          if (!(value === true)) {
                            _context2.next = 15;
                            break;
                          }

                          return _context2.abrupt("break", 17);

                        case 15:
                          if (value) {
                            minTime = +value;
                            if (isNaN(minTime)) minTime = 1;
                          }

                        case 16:
                          if (api.timeRemaining() > minTime) {
                            _context2.next = 5;
                            break;
                          }

                        case 17:
                          _context2.next = 23;
                          break;

                        case 19:
                          _context2.prev = 19;
                          _context2.t0 = _context2["catch"](4);
                          reject(_context2.t0);
                          return _context2.abrupt("return");

                        case 23:
                          window.requestIdleCallback(run, options);

                        case 24:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[4, 19]]);
                }));
                return _run2.apply(this, arguments);
              };

              run = function _run3(_x4) {
                return _run2.apply(this, arguments);
              };

              resolver = resolve;

              if (!coroutine.next) {
                _context3.next = 7;
                break;
              }

              _context3.t0 = coroutine;
              _context3.next = 10;
              break;

            case 7:
              _context3.next = 9;
              return Promise.resolve(coroutine());

            case 9:
              _context3.t0 = _context3.sent;

            case 10:
              iterator = _context3.t0;
              window.requestIdleCallback(run);

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  result.terminate = function (result) {
    terminated = true;

    if (resolver) {
      resolver(result);
    }
  };

  return result;
}
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

/**
 * Create a function that executes a pipeline of
 * functions asynchronously
 * @param {...(Function|Promise|Array<(Promise|Function|GeneratorFunction|AsyncFunction)>|GeneratorFunction|AsyncFunction)} fns - the pipeline to execute
 * @returns {AsyncFunction} an async function to execute the pipeline
 */


function pipe() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(params) {
      var result, _iterator2, _step2, fn, nextResult;

      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              result = params;
              _iterator2 = _createForOfIteratorHelper(fns.flat(Infinity));
              _context4.prev = 2;

              _iterator2.s();

            case 4:
              if ((_step2 = _iterator2.n()).done) {
                _context4.next = 25;
                break;
              }

              fn = _step2.value;

              if (fn) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("continue", 23);

            case 8:
              nextResult = fn.call(this, result);

              if (!nextResult) {
                _context4.next = 23;
                break;
              }

              if (!nextResult.next) {
                _context4.next = 16;
                break;
              }

              _context4.next = 13;
              return run(nextResult);

            case 13:
              result = _context4.sent;
              _context4.next = 23;
              break;

            case 16:
              if (!nextResult.then) {
                _context4.next = 22;
                break;
              }

              _context4.next = 19;
              return nextResult;

            case 19:
              result = _context4.sent;
              _context4.next = 23;
              break;

            case 22:
              result = nextResult;

            case 23:
              _context4.next = 4;
              break;

            case 25:
              _context4.next = 30;
              break;

            case 27:
              _context4.prev = 27;
              _context4.t0 = _context4["catch"](2);

              _iterator2.e(_context4.t0);

            case 30:
              _context4.prev = 30;

              _iterator2.f();

              return _context4.finish(30);

            case 33:
              return _context4.abrupt("return", result);

            case 34:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[2, 27, 30, 33]]);
    }));

    return function (_x5) {
      return _ref2.apply(this, arguments);
    };
  }();
}
/**
 * Tap into a pipeline to call a function that will probably
 * perform side effects but should not modify the result, its
 * return value is ignored
 * @param {Function} fn - a function to be called at this point in
 * the pipeline
 * @returns {AsyncFunction} returning the passed in parameters
 */


function tap(fn) {
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(params) {
      var result;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              result = fn.call(this, params);

              if (!result) {
                _context5.next = 10;
                break;
              }

              if (!result.next) {
                _context5.next = 7;
                break;
              }

              _context5.next = 5;
              return run(result);

            case 5:
              _context5.next = 10;
              break;

            case 7:
              if (!result.then) {
                _context5.next = 10;
                break;
              }

              _context5.next = 10;
              return result;

            case 10:
              return _context5.abrupt("return", params);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x6) {
      return _ref3.apply(this, arguments);
    };
  }();
}
/**
 * Branches a pipeline by starting another "continuation" with
 * the current parameters.  Starts a function but the pipeline
 * continues immediately creating two execution contexts
 * @param {Function} fn - the function to start - can be async or generator
 */


function branch(fn) {
  return function (params) {
    var result = fn.call(this, params);

    if (result) {
      if (result.next) {
        run(result).catch(console.error);
      } else if (result.then) {
        result.catch(console.error);
      }
    }

    return params;
  };
}
/**
 * Create a version of a function with its end
 * parameters supplied
 * @param {Function|GeneratorFunction|AsyncFunction} fn - the function to configure
 * @param {...any[]} config - the additional parameters to pass
 * @returns {Function}
 */


function call(fn) {
  for (var _len3 = arguments.length, config = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    config[_key3 - 1] = arguments[_key3];
  }

  return function () {
    for (var _len4 = arguments.length, params = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      params[_key4] = arguments[_key4];
    }

    return fn.apply(this, [].concat(params, config));
  };
}
/**
 * Create a function that repeats a function multiple times
 * passing the output of each iteration as the input to the next
 * @param {Function} fn - the function to repeat
 * @param {Number} times - the number of times to repeat
 * @returns {AsyncFunction} - a async function that repeats the operation
 */


function repeat(fn, times) {
  return /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(params) {
      var result, i;
      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              result = params;
              i = 0;

            case 2:
              if (!(i < times)) {
                _context6.next = 17;
                break;
              }

              result = fn.call(this, result);

              if (!result.next) {
                _context6.next = 10;
                break;
              }

              _context6.next = 7;
              return run(result);

            case 7:
              result = _context6.sent;
              _context6.next = 14;
              break;

            case 10:
              if (!result.then) {
                _context6.next = 14;
                break;
              }

              _context6.next = 13;
              return result;

            case 13:
              result = _context6.sent;

            case 14:
              i++;
              _context6.next = 2;
              break;

            case 17:
              return _context6.abrupt("return", result);

            case 18:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x7) {
      return _ref4.apply(this, arguments);
    };
  }();
}

var _default = run;
exports.default = _default;