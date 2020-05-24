"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = forEach;
exports.filter = filter;
exports.reduce = reduce;
exports.concat = concat;
exports.append = append;
exports.map = map;
exports.find = find;
exports.findIndex = findIndex;
exports.some = some;
exports.every = every;
exports.yielding = yielding;
exports.run = run;
exports.update = update;
exports.runAsync = runAsync;
Object.defineProperty(exports, "sort", {
  enumerable: true,
  get: function get() {
    return _timsort.sort;
  }
});
exports.default = void 0;

require("requestidlecallback-polyfill");

var _timsort = require("./timsort");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(forEach),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(filter),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(reduce),
    _marked4 = /*#__PURE__*/regeneratorRuntime.mark(concat),
    _marked5 = /*#__PURE__*/regeneratorRuntime.mark(append),
    _marked6 = /*#__PURE__*/regeneratorRuntime.mark(map),
    _marked7 = /*#__PURE__*/regeneratorRuntime.mark(find),
    _marked8 = /*#__PURE__*/regeneratorRuntime.mark(findIndex),
    _marked9 = /*#__PURE__*/regeneratorRuntime.mark(some),
    _marked10 = /*#__PURE__*/regeneratorRuntime.mark(every);

function forEach(array, fn) {
  var index, length;
  return regeneratorRuntime.wrap(function forEach$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0, length = array.length;

        case 1:
          if (!(index < length)) {
            _context.next = 6;
            break;
          }

          return _context.delegateYield(fn(array[index], index, array), "t0", 3);

        case 3:
          index++;
          _context.next = 1;
          break;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function filter(array, fn) {
  var result, index, _iterator, _step, item;

  return regeneratorRuntime.wrap(function filter$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          result = [];
          index = 0;
          _iterator = _createForOfIteratorHelper(array);
          _context2.prev = 3;

          _iterator.s();

        case 5:
          if ((_step = _iterator.n()).done) {
            _context2.next = 12;
            break;
          }

          item = _step.value;
          return _context2.delegateYield(fn(item, index++, array), "t0", 8);

        case 8:
          if (!_context2.t0) {
            _context2.next = 10;
            break;
          }

          result.push(item);

        case 10:
          _context2.next = 5;
          break;

        case 12:
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t1 = _context2["catch"](3);

          _iterator.e(_context2.t1);

        case 17:
          _context2.prev = 17;

          _iterator.f();

          return _context2.finish(17);

        case 20:
          return _context2.abrupt("return", result);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, null, [[3, 14, 17, 20]]);
}

function reduce(array, fn, initial) {
  var result, index, _iterator2, _step2, item;

  return regeneratorRuntime.wrap(function reduce$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          result = initial || array[0];
          index = 0;
          _iterator2 = _createForOfIteratorHelper(array);
          _context3.prev = 3;

          _iterator2.s();

        case 5:
          if ((_step2 = _iterator2.n()).done) {
            _context3.next = 11;
            break;
          }

          item = _step2.value;
          return _context3.delegateYield(fn(result, item, index, array), "t0", 8);

        case 8:
          result = _context3.t0;

        case 9:
          _context3.next = 5;
          break;

        case 11:
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t1 = _context3["catch"](3);

          _iterator2.e(_context3.t1);

        case 16:
          _context3.prev = 16;

          _iterator2.f();

          return _context3.finish(16);

        case 19:
          return _context3.abrupt("return", result);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3, null, [[3, 13, 16, 19]]);
}

function concat(array1, array2) {
  var result, l;
  return regeneratorRuntime.wrap(function concat$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return true;

        case 2:
          result = new Array(array1.length + array2.length);
          _context4.next = 5;
          return;

        case 5:
          l = array1.length;
          return _context4.delegateYield(forEach(array1, yielding(function (a, i) {
            return result[i] = a;
          })), "t0", 7);

        case 7:
          return _context4.delegateYield(forEach(array2, yielding(function (a, i) {
            return result[i + l] = a;
          })), "t1", 8);

        case 8:
          return _context4.abrupt("return", result);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4);
}

function append(array1, array2) {
  var l;
  return regeneratorRuntime.wrap(function append$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          l = array1.length;
          _context5.next = 3;
          return true;

        case 3:
          array1.length += array2.length;
          _context5.next = 6;
          return;

        case 6:
          return _context5.delegateYield(forEach(array2, yielding(function (a, i) {
            return array1[i + l] = a;
          })), "t0", 7);

        case 7:
          return _context5.abrupt("return", array1);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked5);
}

function map(array, fn) {
  var result, index, _iterator3, _step3, item;

  return regeneratorRuntime.wrap(function map$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return true;

        case 2:
          result = new Array(array.length);
          _context6.next = 5;
          return;

        case 5:
          index = 0;
          _iterator3 = _createForOfIteratorHelper(array);
          _context6.prev = 7;

          _iterator3.s();

        case 9:
          if ((_step3 = _iterator3.n()).done) {
            _context6.next = 15;
            break;
          }

          item = _step3.value;
          return _context6.delegateYield(fn(item, index, array), "t0", 12);

        case 12:
          result[index++] = _context6.t0;

        case 13:
          _context6.next = 9;
          break;

        case 15:
          _context6.next = 20;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t1 = _context6["catch"](7);

          _iterator3.e(_context6.t1);

        case 20:
          _context6.prev = 20;

          _iterator3.f();

          return _context6.finish(20);

        case 23:
          return _context6.abrupt("return", result);

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked6, null, [[7, 17, 20, 23]]);
}

function find(array, fn) {
  var index, _iterator4, _step4, item, result;

  return regeneratorRuntime.wrap(function find$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          index = 0;
          _iterator4 = _createForOfIteratorHelper(array);
          _context7.prev = 2;

          _iterator4.s();

        case 4:
          if ((_step4 = _iterator4.n()).done) {
            _context7.next = 12;
            break;
          }

          item = _step4.value;
          return _context7.delegateYield(fn(item, index++, array), "t0", 7);

        case 7:
          result = _context7.t0;

          if (!result) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", item);

        case 10:
          _context7.next = 4;
          break;

        case 12:
          _context7.next = 17;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t1 = _context7["catch"](2);

          _iterator4.e(_context7.t1);

        case 17:
          _context7.prev = 17;

          _iterator4.f();

          return _context7.finish(17);

        case 20:
          return _context7.abrupt("return", undefined);

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked7, null, [[2, 14, 17, 20]]);
}

function findIndex(array, fn) {
  var index, _iterator5, _step5, item, result;

  return regeneratorRuntime.wrap(function findIndex$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          index = 0;
          _iterator5 = _createForOfIteratorHelper(array);
          _context8.prev = 2;

          _iterator5.s();

        case 4:
          if ((_step5 = _iterator5.n()).done) {
            _context8.next = 12;
            break;
          }

          item = _step5.value;
          return _context8.delegateYield(fn(item, index++, array), "t0", 7);

        case 7:
          result = _context8.t0;

          if (!result) {
            _context8.next = 10;
            break;
          }

          return _context8.abrupt("return", index);

        case 10:
          _context8.next = 4;
          break;

        case 12:
          _context8.next = 17;
          break;

        case 14:
          _context8.prev = 14;
          _context8.t1 = _context8["catch"](2);

          _iterator5.e(_context8.t1);

        case 17:
          _context8.prev = 17;

          _iterator5.f();

          return _context8.finish(17);

        case 20:
          return _context8.abrupt("return", -1);

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  }, _marked8, null, [[2, 14, 17, 20]]);
}

function some(array, fn) {
  var index, _iterator6, _step6, item, result;

  return regeneratorRuntime.wrap(function some$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          index = 0;
          _iterator6 = _createForOfIteratorHelper(array);
          _context9.prev = 2;

          _iterator6.s();

        case 4:
          if ((_step6 = _iterator6.n()).done) {
            _context9.next = 12;
            break;
          }

          item = _step6.value;
          return _context9.delegateYield(fn(item, index++, array), "t0", 7);

        case 7:
          result = _context9.t0;

          if (!result) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", true);

        case 10:
          _context9.next = 4;
          break;

        case 12:
          _context9.next = 17;
          break;

        case 14:
          _context9.prev = 14;
          _context9.t1 = _context9["catch"](2);

          _iterator6.e(_context9.t1);

        case 17:
          _context9.prev = 17;

          _iterator6.f();

          return _context9.finish(17);

        case 20:
          return _context9.abrupt("return", false);

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, _marked9, null, [[2, 14, 17, 20]]);
}

function every(array, fn) {
  var index, _iterator7, _step7, item, result;

  return regeneratorRuntime.wrap(function every$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          index = 0;
          _iterator7 = _createForOfIteratorHelper(array);
          _context10.prev = 2;

          _iterator7.s();

        case 4:
          if ((_step7 = _iterator7.n()).done) {
            _context10.next = 12;
            break;
          }

          item = _step7.value;
          return _context10.delegateYield(fn(item, index++, array), "t0", 7);

        case 7:
          result = _context10.t0;

          if (result) {
            _context10.next = 10;
            break;
          }

          return _context10.abrupt("return", false);

        case 10:
          _context10.next = 4;
          break;

        case 12:
          _context10.next = 17;
          break;

        case 14:
          _context10.prev = 14;
          _context10.t1 = _context10["catch"](2);

          _iterator7.e(_context10.t1);

        case 17:
          _context10.prev = 17;

          _iterator7.f();

          return _context10.finish(17);

        case 20:
          return _context10.abrupt("return", true);

        case 21:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked10, null, [[2, 14, 17, 20]]);
}

function yielding(fn) {
  var frequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var yieldCount = 0;
  return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var result,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            result = fn.apply(void 0, _args11);

            if (!(yieldCount++ % frequency === 0)) {
              _context11.next = 4;
              break;
            }

            _context11.next = 4;
            return;

          case 4:
            return _context11.abrupt("return", result);

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee);
  });
}

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(coroutine) {
    var loopWhileMsRemains,
        timeout,
        options,
        terminated,
        resolver,
        result,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            loopWhileMsRemains = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : 1;
            timeout = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 16 * 10;
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

            return _context12.abrupt("return", result);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee2);
  }));
  return _run.apply(this, arguments);
}

function update(_x2) {
  return _update.apply(this, arguments);
}

function _update() {
  _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(coroutine) {
    var terminated, resolver, result;
    return regeneratorRuntime.wrap(function _callee3$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
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

            return _context13.abrupt("return", result);

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee3);
  }));
  return _update.apply(this, arguments);
}

function runAsync(_x3) {
  return _runAsync.apply(this, arguments);
}

function _runAsync() {
  _runAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(coroutine) {
    var loopWhileMsRemains,
        timeout,
        options,
        terminated,
        resolver,
        result,
        _args16 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            loopWhileMsRemains = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : 1;
            timeout = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : 160;
            options = {
              timeout: timeout
            };
            terminated = false;
            resolver = null;
            result = new Promise( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, reject) {
                var iterator, run, _run2;

                return regeneratorRuntime.wrap(function _callee5$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _run2 = function _run4() {
                          _run2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(api) {
                            var minTime, _yield$iterator$next, value, done;

                            return regeneratorRuntime.wrap(function _callee4$(_context14) {
                              while (1) {
                                switch (_context14.prev = _context14.next) {
                                  case 0:
                                    if (!terminated) {
                                      _context14.next = 3;
                                      break;
                                    }

                                    iterator.return();
                                    return _context14.abrupt("return");

                                  case 3:
                                    minTime = Math.max(0.5, loopWhileMsRemains);
                                    _context14.prev = 4;

                                  case 5:
                                    _context14.next = 7;
                                    return iterator.next();

                                  case 7:
                                    _yield$iterator$next = _context14.sent;
                                    value = _yield$iterator$next.value;
                                    done = _yield$iterator$next.done;

                                    if (!done) {
                                      _context14.next = 13;
                                      break;
                                    }

                                    resolve(value);
                                    return _context14.abrupt("return");

                                  case 13:
                                    if (!(value === true)) {
                                      _context14.next = 15;
                                      break;
                                    }

                                    return _context14.abrupt("break", 16);

                                  case 15:
                                    if (api.timeRemaining() > minTime) {
                                      _context14.next = 5;
                                      break;
                                    }

                                  case 16:
                                    _context14.next = 22;
                                    break;

                                  case 18:
                                    _context14.prev = 18;
                                    _context14.t0 = _context14["catch"](4);
                                    reject(_context14.t0);
                                    return _context14.abrupt("return");

                                  case 22:
                                    window.requestIdleCallback(run, options);

                                  case 23:
                                  case "end":
                                    return _context14.stop();
                                }
                              }
                            }, _callee4, null, [[4, 18]]);
                          }));
                          return _run2.apply(this, arguments);
                        };

                        run = function _run3(_x6) {
                          return _run2.apply(this, arguments);
                        };

                        resolver = resolve;
                        _context15.next = 5;
                        return Promise.resolve(coroutine());

                      case 5:
                        iterator = _context15.sent;
                        window.requestIdleCallback(run);

                      case 7:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee5);
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

            return _context16.abrupt("return", result);

          case 8:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee6);
  }));
  return _runAsync.apply(this, arguments);
}

var _default = run;
exports.default = _default;