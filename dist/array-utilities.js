"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exitWith = exitWith;
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
exports.includes = includes;
exports.indexOf = indexOf;
exports.lastIndexOf = lastIndexOf;
exports.keyBy = keyBy;
exports.groupBy = groupBy;
exports.uniqueBy = uniqueBy;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _wrappers = require("./wrappers");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _marked = /*#__PURE__*/_regenerator.default.mark(forEach),
    _marked2 = /*#__PURE__*/_regenerator.default.mark(filter),
    _marked3 = /*#__PURE__*/_regenerator.default.mark(reduce),
    _marked4 = /*#__PURE__*/_regenerator.default.mark(concat),
    _marked5 = /*#__PURE__*/_regenerator.default.mark(append),
    _marked6 = /*#__PURE__*/_regenerator.default.mark(map),
    _marked7 = /*#__PURE__*/_regenerator.default.mark(find),
    _marked8 = /*#__PURE__*/_regenerator.default.mark(findIndex),
    _marked9 = /*#__PURE__*/_regenerator.default.mark(some),
    _marked10 = /*#__PURE__*/_regenerator.default.mark(every),
    _marked11 = /*#__PURE__*/_regenerator.default.mark(includes),
    _marked12 = /*#__PURE__*/_regenerator.default.mark(indexOf),
    _marked13 = /*#__PURE__*/_regenerator.default.mark(lastIndexOf),
    _marked14 = /*#__PURE__*/_regenerator.default.mark(keyBy),
    _marked15 = /*#__PURE__*/_regenerator.default.mark(groupBy),
    _marked16 = /*#__PURE__*/_regenerator.default.mark(uniqueBy);

function isObject(v) {
  return (0, _typeof2.default)(v) === 'object' && !Array.isArray(v);
}
/**
 * @callback Filter
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {Generator} a generator for a value of true if included in the filter
 */

/**
 * @callback Map
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {any} updated item
 */

/**
 * @callback Reduce
 * @param {any} accumulator
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {any} updated value
 */

/**
 * @callback Process
 * @param {any} value - the value being processed
 * @param {number|string} key - the key or index of the value
 * @param {Array} collection - the collection being iterated
 */


var doReturn = Symbol('return');

function exitWith(value) {
  var _ref;

  return _ref = {}, (0, _defineProperty2.default)(_ref, doReturn, true), (0, _defineProperty2.default)(_ref, "value", value), _ref;
}
/**
 * @generator
 * @param {Array} collection
 * @param {Process} fn
 * @param {number|string} [start]
 * @returns {Generator<*, *, *>}
 */


function forEach(collection, fn, start) {
  var started, key, result, index, length, _result;

  return _regenerator.default.wrap(function forEach$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!isObject(collection)) {
            _context.next = 16;
            break;
          }

          started = !start;
          _context.t0 = _regenerator.default.keys(collection);

        case 3:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 14;
            break;
          }

          key = _context.t1.value;

          if (!started) {
            started = key === start;
          }

          if (!started) {
            _context.next = 12;
            break;
          }

          if (!Object.prototype.hasOwnProperty.call(collection, key)) {
            _context.next = 12;
            break;
          }

          return _context.delegateYield(fn(collection[key], key, collection), "t2", 9);

        case 9:
          result = _context.t2;

          if (!(result && result[doReturn])) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", result.value);

        case 12:
          _context.next = 3;
          break;

        case 14:
          _context.next = 25;
          break;

        case 16:
          index = start || 0, length = collection.length;

        case 17:
          if (!(index < length)) {
            _context.next = 25;
            break;
          }

          return _context.delegateYield(fn(collection[index], index, collection), "t3", 19);

        case 19:
          _result = _context.t3;

          if (!(_result && _result[doReturn])) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", _result.value);

        case 22:
          index++;
          _context.next = 17;
          break;

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, Object|Array, *>} collection of elements matching the filter
 */


function filter(collection, fn) {
  var result, _result2;

  return _regenerator.default.wrap(function filter$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!isObject(collection)) {
            _context4.next = 5;
            break;
          }

          result = {};
          return _context4.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee(value, key, array) {
            return _regenerator.default.wrap(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.delegateYield(fn(value, key, array), "t0", 1);

                  case 1:
                    if (!_context2.t0) {
                      _context2.next = 3;
                      break;
                    }

                    result[key] = value;

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee);
          })), "t0", 3);

        case 3:
          _context4.next = 8;
          break;

        case 5:
          _result2 = [];
          return _context4.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee2(value, key, array) {
            return _regenerator.default.wrap(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    return _context3.delegateYield(fn(value, key, array), "t0", 1);

                  case 1:
                    if (!_context3.t0) {
                      _context3.next = 3;
                      break;
                    }

                    _result2.push(value);

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee2);
          })), "t1", 7);

        case 7:
          return _context4.abrupt("return", _result2);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked2);
}
/**
 * @param {Array|Object} target
 * @param {Reduce} fn
 * @param {any} [initial]
 * @returns {Generator<*, *, *>} The result of processing the reduction function on all
 * of the items in the target
 * @example
 *
 * async function sumAge(items) {
 *     const output = await reduceAsync(items, (acc,cur)=>acc += cur.age, 0)
 * }
 */


function reduce(target, fn, initial) {
  var result;
  return _regenerator.default.wrap(function reduce$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          result = initial !== undefined ? initial : target[0];
          return _context6.delegateYield(forEach(target, /*#__PURE__*/_regenerator.default.mark(function _callee3(item, key) {
            return _regenerator.default.wrap(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    return _context5.delegateYield(fn(result, item, key, target), "t0", 1);

                  case 1:
                    result = _context5.t0;

                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee3);
          })), "t0", 2);

        case 2:
          return _context6.abrupt("return", result);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked3);
}
/**
 * Concatenate two arrays into a new array
 * @generator
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Generator<*, Array, *>} the concatenated arrays
 */


function concat(array1, array2) {
  var result, l;
  return _regenerator.default.wrap(function concat$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return true;

        case 2:
          result = new Array(array1.length + array2.length);
          _context7.next = 5;
          return;

        case 5:
          l = array1.length;
          return _context7.delegateYield(forEach(array1, (0, _wrappers.yielding)(function (a, i) {
            return result[i] = a;
          })), "t0", 7);

        case 7:
          return _context7.delegateYield(forEach(array2, (0, _wrappers.yielding)(function (a, i) {
            return result[i + l] = a;
          })), "t1", 8);

        case 8:
          return _context7.abrupt("return", result);

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked4);
}
/**
 * Appends one array to another
 * @generator
 * @param {Array} array1 - the destination
 * @param {Array} array2 - the source
 * @returns {Generator<*, Array, *>} returns <code>array1</code>
 */


function append(array1, array2) {
  var l;
  return _regenerator.default.wrap(function append$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          l = array1.length;
          _context8.next = 3;
          return true;

        case 3:
          array1.length += array2.length;
          _context8.next = 6;
          return;

        case 6:
          return _context8.delegateYield(forEach(array2, (0, _wrappers.yielding)(function (a, i) {
            return array1[i + l] = a;
          })), "t0", 7);

        case 7:
          return _context8.abrupt("return", array1);

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  }, _marked5);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, Array|Object, *>} new collection of mapped values
 */


function map(collection, fn) {
  var result;
  return _regenerator.default.wrap(function map$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          result = isObject(collection) ? {} : [];
          return _context10.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee4(value, key) {
            return _regenerator.default.wrap(function _callee4$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    return _context9.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    result[key] = _context9.t0;

                  case 2:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee4);
          })), "t0", 2);

        case 2:
          return _context10.abrupt("return", result);

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked6);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @param {any} [start] - the key to start at
 * @returns {Generator<*, *, *>} the first matching value in the collection or null
 */


function find(collection, fn, start) {
  var output;
  return _regenerator.default.wrap(function find$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          output = undefined;
          return _context12.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee5(value, key) {
            var result;
            return _regenerator.default.wrap(function _callee5$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    return _context11.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    result = _context11.t0;

                    if (!result) {
                      _context11.next = 5;
                      break;
                    }

                    output = value;
                    return _context11.abrupt("return", exitWith(value));

                  case 5:
                  case "end":
                    return _context11.stop();
                }
              }
            }, _callee5);
          }), start), "t0", 2);

        case 2:
          return _context12.abrupt("return", output);

        case 3:
        case "end":
          return _context12.stop();
      }
    }
  }, _marked7);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, number, *>} Index of matching element or -1
 */


function findIndex(collection, fn, start) {
  var output;
  return _regenerator.default.wrap(function findIndex$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          output = -1;
          return _context14.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee6(value, key) {
            var result;
            return _regenerator.default.wrap(function _callee6$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    return _context13.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    result = _context13.t0;

                    if (!result) {
                      _context13.next = 5;
                      break;
                    }

                    output = key;
                    return _context13.abrupt("return", exitWith(key));

                  case 5:
                  case "end":
                    return _context13.stop();
                }
              }
            }, _callee6);
          }), start), "t0", 2);

        case 2:
          return _context14.abrupt("return", output);

        case 3:
        case "end":
          return _context14.stop();
      }
    }
  }, _marked8);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if at least one item matched the filter
 */


function some(collection, fn) {
  var result;
  return _regenerator.default.wrap(function some$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          result = false;
          return _context16.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee7(value, key) {
            return _regenerator.default.wrap(function _callee7$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    return _context15.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    if (!_context15.t0) {
                      _context15.next = 4;
                      break;
                    }

                    result = true;
                    return _context15.abrupt("return", exitWith(true));

                  case 4:
                  case "end":
                    return _context15.stop();
                }
              }
            }, _callee7);
          })), "t0", 2);

        case 2:
          return _context16.abrupt("return", result);

        case 3:
        case "end":
          return _context16.stop();
      }
    }
  }, _marked9);
}
/**
 * @generator
 * @param {Array|Object} collection
 * @param {Filter} fn
 * @returns {Generator<*, boolean, *>} true if all of the collection items matched the filter
 */


function every(collection, fn) {
  var result;
  return _regenerator.default.wrap(function every$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          result = true;
          return _context18.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee8(value, key) {
            return _regenerator.default.wrap(function _callee8$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    return _context17.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    if (_context17.t0) {
                      _context17.next = 4;
                      break;
                    }

                    result = false;
                    return _context17.abrupt("return", exitWith(false));

                  case 4:
                  case "end":
                    return _context17.stop();
                }
              }
            }, _callee8);
          })), "t0", 2);

        case 2:
          return _context18.abrupt("return", result);

        case 3:
        case "end":
          return _context18.stop();
      }
    }
  }, _marked10);
}
/**
 * Returns true if an array includes a value
 * @param {Array} array
 * @param {any} value
 * @returns {Generator<*, boolean, *>}
 */


function includes(array, value) {
  var i, l;
  return _regenerator.default.wrap(function includes$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          i = 0, l = array.length;

        case 1:
          if (!(i < l)) {
            _context19.next = 10;
            break;
          }

          if (!(array[i] === value)) {
            _context19.next = 4;
            break;
          }

          return _context19.abrupt("return", true);

        case 4:
          if (!((i & 63) === 0)) {
            _context19.next = 7;
            break;
          }

          _context19.next = 7;
          return;

        case 7:
          i++;
          _context19.next = 1;
          break;

        case 10:
          return _context19.abrupt("return", false);

        case 11:
        case "end":
          return _context19.stop();
      }
    }
  }, _marked11);
}
/**
 * Returns a generator for an index of an item in an array
 * @param {Array} array - the array to scan
 * @param {*} value - the value to search for
 * @returns {Generator<*, number, *>}
 */


function indexOf(array, value) {
  var i, l;
  return _regenerator.default.wrap(function indexOf$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          i = 0, l = array.length;

        case 1:
          if (!(i < l)) {
            _context20.next = 10;
            break;
          }

          if (!(array[i] === value)) {
            _context20.next = 4;
            break;
          }

          return _context20.abrupt("return", i);

        case 4:
          if (!((i & 63) === 0)) {
            _context20.next = 7;
            break;
          }

          _context20.next = 7;
          return;

        case 7:
          i++;
          _context20.next = 1;
          break;

        case 10:
          return _context20.abrupt("return", -1);

        case 11:
        case "end":
          return _context20.stop();
      }
    }
  }, _marked12);
}
/**
 * Returns a generator for an index of an item in an array
 * @param {Array} array - the array to scan
 * @param {*} value - the value to search for
 * @returns {Generator<*, number, *>}
 */


function lastIndexOf(array, value) {
  var i;
  return _regenerator.default.wrap(function lastIndexOf$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          i = array.length - 1;

        case 1:
          if (!(i >= 0)) {
            _context21.next = 10;
            break;
          }

          if (!(array[i] === value)) {
            _context21.next = 4;
            break;
          }

          return _context21.abrupt("return", i);

        case 4:
          if (!((i & 63) === 0)) {
            _context21.next = 7;
            break;
          }

          _context21.next = 7;
          return;

        case 7:
          i--;
          _context21.next = 1;
          break;

        case 10:
          return _context21.abrupt("return", -1);

        case 11:
        case "end":
          return _context21.stop();
      }
    }
  }, _marked13);
}
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


function keyBy(collection, fn) {
  var result;
  return _regenerator.default.wrap(function keyBy$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          result = {};
          return _context23.delegateYield(forEach(collection, /*#__PURE__*/_regenerator.default.mark(function _callee9(value, key) {
            var newKey;
            return _regenerator.default.wrap(function _callee9$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    return _context22.delegateYield(fn(value, key, collection), "t0", 1);

                  case 1:
                    newKey = _context22.t0;
                    result[newKey] = value;

                  case 3:
                  case "end":
                    return _context22.stop();
                }
              }
            }, _callee9);
          })), "t0", 2);

        case 2:
          return _context23.abrupt("return", result);

        case 3:
        case "end":
          return _context23.stop();
      }
    }
  }, _marked14);
}
/**
 * Creates an object composed of keys generated from the results
 * of running each element of collection thru then supplied function.
 * The corresponding value of each key is an collection of the elements responsible
 * for generating the key.
 *
 * @param {Array|Object} collection
 * @param {Map} fn
 * @returns {Generator<*, {}, *>} a generator for the new object
 */


function groupBy(collection, fn) {
  var result, index, _iterator, _step, item, key, array;

  return _regenerator.default.wrap(function groupBy$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          result = {};
          index = 0;
          _iterator = _createForOfIteratorHelper(collection);
          _context24.prev = 3;

          _iterator.s();

        case 5:
          if ((_step = _iterator.n()).done) {
            _context24.next = 13;
            break;
          }

          item = _step.value;
          return _context24.delegateYield(fn(item, index++, collection), "t0", 8);

        case 8:
          key = _context24.t0;
          array = result[key] = result[key] || [];
          array.push(item);

        case 11:
          _context24.next = 5;
          break;

        case 13:
          _context24.next = 18;
          break;

        case 15:
          _context24.prev = 15;
          _context24.t1 = _context24["catch"](3);

          _iterator.e(_context24.t1);

        case 18:
          _context24.prev = 18;

          _iterator.f();

          return _context24.finish(18);

        case 21:
          return _context24.abrupt("return", result);

        case 22:
        case "end":
          return _context24.stop();
      }
    }
  }, _marked15, null, [[3, 15, 18, 21]]);
}
/**
 * Create an array with the unique values from the
 * input array, the routine is supplied with a
 * function that determines on what the array should
 * be made unique.
 * @param {Array} array
 * @param {Map} [fn] - the function to determine uniqueness, if
 * omitted then the item itself is used
 * @returns {Generator<*, Array, *>}
 */


function uniqueBy(array, fn) {
  var set, output, index, _iterator2, _step2, item, key;

  return _regenerator.default.wrap(function uniqueBy$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          set = new Set();
          output = [];
          index = 0;
          _iterator2 = _createForOfIteratorHelper(array);
          _context25.prev = 4;

          _iterator2.s();

        case 6:
          if ((_step2 = _iterator2.n()).done) {
            _context25.next = 17;
            break;
          }

          item = _step2.value;

          if (!fn) {
            _context25.next = 14;
            break;
          }

          return _context25.delegateYield(fn(item, index++, array), "t0", 10);

        case 10:
          key = _context25.t0;

          if (!set.has(key)) {
            output.push(item);
            set.add(key);
          }

          _context25.next = 15;
          break;

        case 14:
          if (!set.has(item)) {
            output.push(item);
            set.add(item);
          }

        case 15:
          _context25.next = 6;
          break;

        case 17:
          _context25.next = 22;
          break;

        case 19:
          _context25.prev = 19;
          _context25.t1 = _context25["catch"](4);

          _iterator2.e(_context25.t1);

        case 22:
          _context25.prev = 22;

          _iterator2.f();

          return _context25.finish(22);

        case 25:
          return _context25.abrupt("return", output);

        case 26:
        case "end":
          return _context25.stop();
      }
    }
  }, _marked16, null, [[4, 19, 22, 25]]);
}