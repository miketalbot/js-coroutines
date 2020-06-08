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

var _wrappers = require("./wrappers");

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

/**
 * @callback Process
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 */

/**
 * @callback Filter
 * @param {any} element
 * @param {number} index
 * @param {Array} collection
 * @returns {boolean} true if included in the filter
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
 * @generator
 * @param {Array} array
 * @param {process} fn
 */
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
/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns array of elements matching the filter
 */


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
/**
 * @param {Array} array
 * @param {Reduce} fn
 * @param {any} [initialValue]
 * @returns The result of processing the reduction function on all
 * of the items in the array
 */


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
/**
 * Concatenate two arrays into a new array
 * @generator
 * @param {Array} array1
 * @param {Array} array2
 * @returns {Array} the concatenated arrays
 */


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
          return _context4.delegateYield(forEach(array1, (0, _wrappers.yielding)(function (a, i) {
            return result[i] = a;
          })), "t0", 7);

        case 7:
          return _context4.delegateYield(forEach(array2, (0, _wrappers.yielding)(function (a, i) {
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
/**
 * Appends one array to another
 * @generator
 * @param {Array} array1 - the destination
 * @param {Array} array2 - the source
 * @returns {Array} returns <code>array1</code>
 */


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
          return _context5.delegateYield(forEach(array2, (0, _wrappers.yielding)(function (a, i) {
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
/**
 * @generator
 * @param {Array} array
 * @param {Map} fn
 * @returns {Array} new array of mapped values
 */


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
/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {any} the first matching value in the array or null
 */


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
/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {number} Index of matching element or -1
 */


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
/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {boolean} true if at least one item matched the filter
 */


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
/**
 * @generator
 * @param {Array} array
 * @param {Filter} fn
 * @returns {boolean} true if all of the array items matched the filter
 */


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