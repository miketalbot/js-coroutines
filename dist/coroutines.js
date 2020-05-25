"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.update = update;
exports.runAsync = runAsync;
exports.default = void 0;

require("requestidlecallback-polyfill");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(coroutine) {
    var loopWhileMsRemains,
        timeout,
        options,
        terminated,
        resolver,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            loopWhileMsRemains = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
            timeout = _args.length > 2 && _args[2] !== undefined ? _args[2] : 16 * 10;
            options = {
              timeout: timeout
            };
            terminated = false;
            resolver = null;
            result = new Promise(function (resolve, reject) {
              resolver = resolve;
              var iterator = coroutine();
              window.requestIdleCallback(run);

              function run(api) {
                if (terminated) {
                  iterator.return();
                  return;
                }

                var minTime = Math.max(0.5, loopWhileMsRemains);

                try {
                  do {
                    var _iterator$next = iterator.next(),
                        value = _iterator$next.value,
                        done = _iterator$next.done;

                    if (done) {
                      resolve(value);
                      return;
                    }

                    if (value === true) {
                      break;
                    }
                  } while (api.timeRemaining() > minTime);
                } catch (e) {
                  reject(e);
                  return;
                }

                window.requestIdleCallback(run, options);
              }
            });

            result.terminate = function (result) {
              terminated = true;

              if (resolver) {
                resolver.resolve(result);
              }
            };

            return _context.abrupt("return", result);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _run.apply(this, arguments);
}

function update(_x2) {
  return _update.apply(this, arguments);
}

function _update() {
  _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(coroutine) {
    var terminated, resolver, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            terminated = false;
            resolver = null;
            result = new Promise(function (resolve, reject) {
              resolver = resolve;
              var iterator = coroutine();
              window.requestAnimationFrame(run);

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

                window.requestAnimationFrame(run);
              }
            });

            result.terminate = function (result) {
              terminated = true;

              if (resolver) {
                resolver.resolve(result);
              }
            };

            return _context2.abrupt("return", result);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _update.apply(this, arguments);
}

function runAsync(_x3) {
  return _runAsync.apply(this, arguments);
}

function _runAsync() {
  _runAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(coroutine) {
    var loopWhileMsRemains,
        timeout,
        options,
        terminated,
        resolver,
        result,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            loopWhileMsRemains = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 1;
            timeout = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 160;
            options = {
              timeout: timeout
            };
            terminated = false;
            resolver = null;
            result = new Promise( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(resolve, reject) {
                var iterator, run, _run2;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _run2 = function _run4() {
                          _run2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(api) {
                            var minTime, _yield$iterator$next, value, done;

                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    if (!terminated) {
                                      _context3.next = 3;
                                      break;
                                    }

                                    iterator.return();
                                    return _context3.abrupt("return");

                                  case 3:
                                    minTime = Math.max(0.5, loopWhileMsRemains);
                                    _context3.prev = 4;

                                  case 5:
                                    _context3.next = 7;
                                    return iterator.next();

                                  case 7:
                                    _yield$iterator$next = _context3.sent;
                                    value = _yield$iterator$next.value;
                                    done = _yield$iterator$next.done;

                                    if (!done) {
                                      _context3.next = 13;
                                      break;
                                    }

                                    resolve(value);
                                    return _context3.abrupt("return");

                                  case 13:
                                    if (!(value === true)) {
                                      _context3.next = 15;
                                      break;
                                    }

                                    return _context3.abrupt("break", 16);

                                  case 15:
                                    if (api.timeRemaining() > minTime) {
                                      _context3.next = 5;
                                      break;
                                    }

                                  case 16:
                                    _context3.next = 22;
                                    break;

                                  case 18:
                                    _context3.prev = 18;
                                    _context3.t0 = _context3["catch"](4);
                                    reject(_context3.t0);
                                    return _context3.abrupt("return");

                                  case 22:
                                    window.requestIdleCallback(run, options);

                                  case 23:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3, null, [[4, 18]]);
                          }));
                          return _run2.apply(this, arguments);
                        };

                        run = function _run3(_x6) {
                          return _run2.apply(this, arguments);
                        };

                        resolver = resolve;
                        _context4.next = 5;
                        return Promise.resolve(coroutine());

                      case 5:
                        iterator = _context4.sent;
                        window.requestIdleCallback(run);

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4, _x5) {
                return _ref.apply(this, arguments);
              };
            }());

            result.terminate = function (result) {
              terminated = true;

              if (resolver) {
                resolver.resolve(result);
              }
            };

            return _context5.abrupt("return", result);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _runAsync.apply(this, arguments);
}

var _default = run;
exports.default = _default;