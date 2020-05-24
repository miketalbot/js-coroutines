"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = sort;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(makeAscendingRun),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(reverseRun),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(gallopLeft),
    _marked4 = /*#__PURE__*/regeneratorRuntime.mark(gallopRight),
    _marked5 = /*#__PURE__*/regeneratorRuntime.mark(sort);

/*

Timsort

The MIT License

Copyright (c) 2015 Marco Ziccardi   (c) 2020 Mike Talbot (Generator modifications)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/**
 * Default minimum size of a run.
 */
var DEFAULT_MIN_MERGE = 32;
var YIELD_FREQ = 63;
/**
 * Minimum ordered subsequece required to do galloping.
 */

var DEFAULT_MIN_GALLOPING = 7;
/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */

var DEFAULT_TMP_STORAGE_LENGTH = 256;
/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */

var POWERS_OF_TEN = [1, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
/**
 * Estimate the logarithm base 10 of a small integer.
 *
 * @param {number} x - The integer to estimate the logarithm of.
 * @return {number} - The estimated logarithm of the integer.
 */

function log10(x) {
  if (x < 1e5) {
    if (x < 1e2) {
      return x < 1e1 ? 0 : 1;
    }

    if (x < 1e4) {
      return x < 1e3 ? 2 : 3;
    }

    return 4;
  }

  if (x < 1e7) {
    return x < 1e6 ? 5 : 6;
  }

  if (x < 1e9) {
    return x < 1e8 ? 7 : 8;
  }

  return 9;
}
/**
 * Default alphabetical comparison of items.
 *
 * @param {string|object|number} a - First element to compare.
 * @param {string|object|number} b - Second element to compare.
 * @return {number} - A positive number if a.toString() > b.toString(), a
 * negative number if .toString() < b.toString(), 0 otherwise.
 */


function alphabeticalCompare(a, b) {
  if (a === b) {
    return 0;
  }

  if (~~a === a && ~~b === b) {
    if (a === 0 || b === 0) {
      return a < b ? -1 : 1;
    }

    if (a < 0 || b < 0) {
      if (b >= 0) {
        return -1;
      }

      if (a >= 0) {
        return 1;
      }

      a = -a;
      b = -b;
    }

    var al = log10(a);
    var bl = log10(b);
    var t = 0;

    if (al < bl) {
      a *= POWERS_OF_TEN[bl - al - 1];
      b /= 10;
      t = -1;
    } else if (al > bl) {
      b *= POWERS_OF_TEN[al - bl - 1];
      a /= 10;
      t = 1;
    }

    if (a === b) {
      return t;
    }

    return a < b ? -1 : 1;
  }

  var aStr = String(a);
  var bStr = String(b);

  if (aStr === bStr) {
    return 0;
  }

  return aStr < bStr ? -1 : 1;
}
/**
 * Compute minimum run length for TimSort
 *
 * @param {number} n - The size of the array to sort.
 */


function minRunLength(n) {
  var r = 0;

  while (n >= DEFAULT_MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }

  return n + r;
}
/**
 * Counts the length of a monotonically ascending or strictly monotonically
 * descending sequence (run) starting at array[lo] in the range [lo, hi). If
 * the run is descending it is made ascending.
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {function} compare - Item comparison function.
 * @return {number} - The length of the run.
 */


function makeAscendingRun(array, lo, hi, compare) {
  var runHi;
  return regeneratorRuntime.wrap(function makeAscendingRun$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          runHi = lo + 1;

          if (!(runHi === hi)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", 1);

        case 3:
          if (!(compare(array[runHi++], array[lo]) < 0)) {
            _context.next = 14;
            break;
          }

        case 4:
          if (!(runHi < hi && compare(array[runHi], array[runHi - 1]) < 0)) {
            _context.next = 11;
            break;
          }

          runHi++;

          if (!((runHi & YIELD_FREQ) === 0)) {
            _context.next = 9;
            break;
          }

          _context.next = 9;
          return;

        case 9:
          _context.next = 4;
          break;

        case 11:
          return _context.delegateYield(reverseRun(array, lo, runHi), "t0", 12);

        case 12:
          _context.next = 21;
          break;

        case 14:
          if (!(runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0)) {
            _context.next = 21;
            break;
          }

          runHi++;

          if (!((runHi & YIELD_FREQ) === 0)) {
            _context.next = 19;
            break;
          }

          _context.next = 19;
          return;

        case 19:
          _context.next = 14;
          break;

        case 21:
          return _context.abrupt("return", runHi - lo);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
/**
 * Reverse an array in the range [lo, hi).
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 */


function reverseRun(array, lo, hi) {
  var t;
  return regeneratorRuntime.wrap(function reverseRun$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          hi--;

        case 1:
          if (!(lo < hi)) {
            _context2.next = 10;
            break;
          }

          t = array[lo];
          array[lo++] = array[hi];
          array[hi--] = t;

          if (!((hi & 127) === 0)) {
            _context2.next = 8;
            break;
          }

          _context2.next = 8;
          return;

        case 8:
          _context2.next = 1;
          break;

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2);
}
/**
 * Perform the binary sort of the array in the range [lo, hi) where start is
 * the first element possibly out of order.
 *
 * @param {array} array - The array to sort.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 * @param {number} start - First element possibly out of order.
 * @param {function} compare - Item comparison function.
 */


function binaryInsertionSort(array, lo, hi, start, compare) {
  if (start === lo) {
    start++;
  }

  for (; start < hi; start++) {
    var pivot = array[start]; // Ranges of the array where pivot belongs

    var left = lo;
    var right = start;
    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */

    while (left < right) {
      var mid = left + right >>> 1;

      if (compare(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    /*
     * Move elements right to make room for the pivot. If there are elements
     * equal to pivot, left points to the first slot after them: this is also
     * a reason for which TimSort is stable
     */


    var n = start - left; // Switch is just an optimization for small arrays

    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];

      /* falls through */

      case 2:
        array[left + 2] = array[left + 1];

      /* falls through */

      case 1:
        array[left + 1] = array[left];
        break;

      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }

    }

    array[left] = pivot;
  }
}

var yieldCounter = 0;

function checkYield() {
  return (yieldCounter++ & YIELD_FREQ) === 0;
}
/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the leftmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */


function gallopLeft(value, array, start, length, hint, compare) {
  var lastOffset, maxOffset, offset, tmp, m;
  return regeneratorRuntime.wrap(function gallopLeft$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return;

        case 2:
          lastOffset = 0;
          maxOffset = 0;
          offset = 1;

          if (!(compare(value, array[start + hint]) > 0)) {
            _context3.next = 21;
            break;
          }

          maxOffset = length - hint;

        case 7:
          if (!(offset < maxOffset && compare(value, array[start + hint + offset]) > 0)) {
            _context3.next = 16;
            break;
          }

          if (!checkYield()) {
            _context3.next = 11;
            break;
          }

          _context3.next = 11;
          return;

        case 11:
          lastOffset = offset;
          offset = (offset << 1) + 1;

          if (offset <= 0) {
            offset = maxOffset;
          }

          _context3.next = 7;
          break;

        case 16:
          if (offset > maxOffset) {
            offset = maxOffset;
          } // Make offsets relative to start


          lastOffset += hint;
          offset += hint; // value <= array[start + hint]

          _context3.next = 35;
          break;

        case 21:
          maxOffset = hint + 1;

        case 22:
          if (!(offset < maxOffset && compare(value, array[start + hint - offset]) <= 0)) {
            _context3.next = 31;
            break;
          }

          if (!checkYield()) {
            _context3.next = 26;
            break;
          }

          _context3.next = 26;
          return;

        case 26:
          lastOffset = offset;
          offset = (offset << 1) + 1;

          if (offset <= 0) {
            offset = maxOffset;
          }

          _context3.next = 22;
          break;

        case 31:
          if (offset > maxOffset) {
            offset = maxOffset;
          } // Make offsets relative to start


          tmp = lastOffset;
          lastOffset = hint - offset;
          offset = hint - tmp;

        case 35:
          /*
           * Now array[start+lastOffset] < value <= array[start+offset], so value
           * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
           * binary search, with invariant array[start + lastOffset - 1] < value <=
           * array[start + offset].
           */
          lastOffset++;

        case 36:
          if (!(lastOffset < offset)) {
            _context3.next = 44;
            break;
          }

          m = lastOffset + (offset - lastOffset >>> 1);

          if (!checkYield()) {
            _context3.next = 41;
            break;
          }

          _context3.next = 41;
          return;

        case 41:
          if (compare(value, array[start + m]) > 0) {
            lastOffset = m + 1;
          } else {
            offset = m;
          }

          _context3.next = 36;
          break;

        case 44:
          return _context3.abrupt("return", offset);

        case 45:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3);
}
/**
 * Find the position at which to insert a value in a sorted range. If the range
 * contains elements equal to the value the rightmost element index is returned
 * (for stability).
 *
 * @param {number} value - Value to insert.
 * @param {array} array - The array in which to insert value.
 * @param {number} start - First element in the range.
 * @param {number} length - Length of the range.
 * @param {number} hint - The index at which to begin the search.
 * @param {function} compare - Item comparison function.
 * @return {number} - The index where to insert value.
 */


function gallopRight(value, array, start, length, hint, compare) {
  var lastOffset, maxOffset, offset, tmp, m;
  return regeneratorRuntime.wrap(function gallopRight$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return;

        case 2:
          lastOffset = 0;
          maxOffset = 0;
          offset = 1;

          if (!(compare(value, array[start + hint]) < 0)) {
            _context4.next = 22;
            break;
          }

          maxOffset = hint + 1;

        case 7:
          if (!(offset < maxOffset && compare(value, array[start + hint - offset]) < 0)) {
            _context4.next = 16;
            break;
          }

          if (!checkYield()) {
            _context4.next = 11;
            break;
          }

          _context4.next = 11;
          return;

        case 11:
          lastOffset = offset;
          offset = (offset << 1) + 1;

          if (offset <= 0) {
            offset = maxOffset;
          }

          _context4.next = 7;
          break;

        case 16:
          if (offset > maxOffset) {
            offset = maxOffset;
          } // Make offsets relative to start


          tmp = lastOffset;
          lastOffset = hint - offset;
          offset = hint - tmp; // value >= array[start + hint]

          _context4.next = 35;
          break;

        case 22:
          maxOffset = length - hint;

        case 23:
          if (!(offset < maxOffset && compare(value, array[start + hint + offset]) >= 0)) {
            _context4.next = 32;
            break;
          }

          if (!checkYield()) {
            _context4.next = 27;
            break;
          }

          _context4.next = 27;
          return;

        case 27:
          lastOffset = offset;
          offset = (offset << 1) + 1;

          if (offset <= 0) {
            offset = maxOffset;
          }

          _context4.next = 23;
          break;

        case 32:
          if (offset > maxOffset) {
            offset = maxOffset;
          } // Make offsets relative to start


          lastOffset += hint;
          offset += hint;

        case 35:
          /*
           * Now array[start+lastOffset] < value <= array[start+offset], so value
           * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
           * binary search, with invariant array[start + lastOffset - 1] < value <=
           * array[start + offset].
           */
          lastOffset++;

        case 36:
          if (!(lastOffset < offset)) {
            _context4.next = 44;
            break;
          }

          m = lastOffset + (offset - lastOffset >>> 1);

          if (!checkYield()) {
            _context4.next = 41;
            break;
          }

          _context4.next = 41;
          return;

        case 41:
          if (compare(value, array[start + m]) < 0) {
            offset = m;
          } else {
            lastOffset = m + 1;
          }

          _context4.next = 36;
          break;

        case 44:
          return _context4.abrupt("return", offset);

        case 45:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4);
}

var TimSort = /*#__PURE__*/function () {
  function TimSort(array, compare) {
    _classCallCheck(this, TimSort);

    _defineProperty(this, "array", null);

    _defineProperty(this, "compare", null);

    _defineProperty(this, "minGallop", DEFAULT_MIN_GALLOPING);

    _defineProperty(this, "length", 0);

    _defineProperty(this, "tmpStorageLength", DEFAULT_TMP_STORAGE_LENGTH);

    _defineProperty(this, "stackLength", 0);

    _defineProperty(this, "runStart", null);

    _defineProperty(this, "runLength", null);

    _defineProperty(this, "stackSize", 0);

    this.array = array;
    this.compare = compare;
    this.length = array.length;

    if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
      this.tmpStorageLength = this.length >>> 1;
    }

    this.tmp = new Array(this.tmpStorageLength);
    this.stackLength = this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40;
    this.runStart = new Array(this.stackLength);
    this.runLength = new Array(this.stackLength);
  }
  /**
   * Push a new run on TimSort's stack.
   *
   * @param {number} runStart - Start index of the run in the original array.
   * @param {number} runLength - Length of the run;
   */


  _createClass(TimSort, [{
    key: "pushRun",
    value: function pushRun(runStart, runLength) {
      this.runStart[this.stackSize] = runStart;
      this.runLength[this.stackSize] = runLength;
      this.stackSize += 1;
    }
    /**
     * Merge runs on TimSort's stack so that the following holds for all i:
     * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
     * 2) runLength[i - 2] > runLength[i - 1]
     */

  }, {
    key: "mergeRuns",
    value: /*#__PURE__*/regeneratorRuntime.mark(function mergeRuns() {
      var n;
      return regeneratorRuntime.wrap(function mergeRuns$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(this.stackSize > 1)) {
                _context5.next = 11;
                break;
              }

              n = this.stackSize - 2;

              if (!(n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1] || n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
                _context5.next = 6;
                break;
              }

              if (this.runLength[n - 1] < this.runLength[n + 1]) {
                n--;
              }

              _context5.next = 8;
              break;

            case 6:
              if (!(this.runLength[n] > this.runLength[n + 1])) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt("break", 11);

            case 8:
              return _context5.delegateYield(this.mergeAt(n), "t0", 9);

            case 9:
              _context5.next = 0;
              break;

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, mergeRuns, this);
    })
    /**
     * Merge all runs on TimSort's stack until only one remains.
     */

  }, {
    key: "forceMergeRuns",
    value: /*#__PURE__*/regeneratorRuntime.mark(function forceMergeRuns() {
      var n;
      return regeneratorRuntime.wrap(function forceMergeRuns$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(this.stackSize > 1)) {
                _context6.next = 6;
                break;
              }

              n = this.stackSize - 2;

              if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
                n--;
              }

              return _context6.delegateYield(this.mergeAt(n), "t0", 4);

            case 4:
              _context6.next = 0;
              break;

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, forceMergeRuns, this);
    })
    /**
     * Merge the runs on the stack at positions i and i+1. Must be always be called
     * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
     *
     * @param {number} i - Index of the run to merge in TimSort's stack.
     */

  }, {
    key: "mergeAt",
    value: /*#__PURE__*/regeneratorRuntime.mark(function mergeAt(i) {
      var compare, array, start1, length1, start2, length2, k;
      return regeneratorRuntime.wrap(function mergeAt$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return;

            case 2:
              compare = this.compare;
              array = this.array;
              start1 = this.runStart[i];
              length1 = this.runLength[i];
              start2 = this.runStart[i + 1];
              length2 = this.runLength[i + 1];
              this.runLength[i] = length1 + length2;

              if (i === this.stackSize - 3) {
                this.runStart[i + 1] = this.runStart[i + 2];
                this.runLength[i + 1] = this.runLength[i + 2];
              }

              this.stackSize--;
              /*
               * Find where the first element in the second run goes in run1. Previous
               * elements in run1 are already in place
               */

              return _context7.delegateYield(gallopRight(array[start2], array, start1, length1, 0, compare), "t0", 12);

            case 12:
              k = _context7.t0;
              start1 += k;
              length1 -= k;

              if (!(length1 === 0)) {
                _context7.next = 17;
                break;
              }

              return _context7.abrupt("return");

            case 17:
              return _context7.delegateYield(gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare), "t1", 18);

            case 18:
              length2 = _context7.t1;

              if (!(length2 === 0)) {
                _context7.next = 21;
                break;
              }

              return _context7.abrupt("return");

            case 21:
              if (!(length1 <= length2)) {
                _context7.next = 25;
                break;
              }

              return _context7.delegateYield(this.mergeLow(start1, length1, start2, length2), "t2", 23);

            case 23:
              _context7.next = 26;
              break;

            case 25:
              return _context7.delegateYield(this.mergeHigh(start1, length1, start2, length2), "t3", 26);

            case 26:
            case "end":
              return _context7.stop();
          }
        }
      }, mergeAt, this);
    })
    /**
     * Merge two adjacent runs in a stable way. The runs must be such that the
     * first element of run1 is bigger than the first element in run2 and the
     * last element of run1 is greater than all the elements in run2.
     * The method should be called when run1.length <= run2.length as it uses
     * TimSort temporary array to store run1. Use mergeHigh if run1.length >
     * run2.length.
     *
     * @param {number} start1 - First element in run1.
     * @param {number} length1 - Length of run1.
     * @param {number} start2 - First element in run2.
     * @param {number} length2 - Length of run2.
     */

  }, {
    key: "mergeLow",
    value: /*#__PURE__*/regeneratorRuntime.mark(function mergeLow(start1, length1, start2, length2) {
      var compare, array, tmp, i, cursor1, cursor2, dest, minGallop, count1, count2, exit;
      return regeneratorRuntime.wrap(function mergeLow$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              compare = this.compare;
              array = this.array;
              tmp = this.tmp;
              i = 0;
              i = 0;

            case 5:
              if (!(i < length1)) {
                _context8.next = 13;
                break;
              }

              if (!checkYield()) {
                _context8.next = 9;
                break;
              }

              _context8.next = 9;
              return;

            case 9:
              tmp[i] = array[start1 + i];

            case 10:
              i++;
              _context8.next = 5;
              break;

            case 13:
              cursor1 = 0;
              cursor2 = start2;
              dest = start1;
              array[dest++] = array[cursor2++];

              if (!(--length2 === 0)) {
                _context8.next = 28;
                break;
              }

              i = 0;

            case 19:
              if (!(i < length1)) {
                _context8.next = 27;
                break;
              }

              if (!checkYield()) {
                _context8.next = 23;
                break;
              }

              _context8.next = 23;
              return;

            case 23:
              array[dest + i] = tmp[cursor1 + i];

            case 24:
              i++;
              _context8.next = 19;
              break;

            case 27:
              return _context8.abrupt("return");

            case 28:
              if (!(length1 === 1)) {
                _context8.next = 40;
                break;
              }

              i = 0;

            case 30:
              if (!(i < length2)) {
                _context8.next = 38;
                break;
              }

              if (!checkYield()) {
                _context8.next = 34;
                break;
              }

              _context8.next = 34;
              return;

            case 34:
              array[dest + i] = array[cursor2 + i];

            case 35:
              i++;
              _context8.next = 30;
              break;

            case 38:
              array[dest + length2] = tmp[cursor1];
              return _context8.abrupt("return");

            case 40:
              minGallop = this.minGallop;

            case 41:
              if (!true) {
                _context8.next = 121;
                break;
              }

              count1 = 0;
              count2 = 0;
              exit = false;

            case 45:
              if (!checkYield()) {
                _context8.next = 48;
                break;
              }

              _context8.next = 48;
              return;

            case 48:
              if (!(compare(array[cursor2], tmp[cursor1]) < 0)) {
                _context8.next = 57;
                break;
              }

              array[dest++] = array[cursor2++];
              count2++;
              count1 = 0;

              if (!(--length2 === 0)) {
                _context8.next = 55;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 64);

            case 55:
              _context8.next = 63;
              break;

            case 57:
              array[dest++] = tmp[cursor1++];
              count1++;
              count2 = 0;

              if (!(--length1 === 1)) {
                _context8.next = 63;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 64);

            case 63:
              if ((count1 | count2) < minGallop) {
                _context8.next = 45;
                break;
              }

            case 64:
              if (!exit) {
                _context8.next = 66;
                break;
              }

              return _context8.abrupt("break", 121);

            case 66:
              if (!checkYield()) {
                _context8.next = 69;
                break;
              }

              _context8.next = 69;
              return;

            case 69:
              return _context8.delegateYield(gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare), "t0", 70);

            case 70:
              count1 = _context8.t0;

              if (!(count1 !== 0)) {
                _context8.next = 87;
                break;
              }

              i = 0;

            case 73:
              if (!(i < count1)) {
                _context8.next = 81;
                break;
              }

              if (!checkYield()) {
                _context8.next = 77;
                break;
              }

              _context8.next = 77;
              return;

            case 77:
              array[dest + i] = tmp[cursor1 + i];

            case 78:
              i++;
              _context8.next = 73;
              break;

            case 81:
              dest += count1;
              cursor1 += count1;
              length1 -= count1;

              if (!(length1 <= 1)) {
                _context8.next = 87;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 115);

            case 87:
              array[dest++] = array[cursor2++];

              if (!(--length2 === 0)) {
                _context8.next = 91;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 115);

            case 91:
              return _context8.delegateYield(gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare), "t1", 92);

            case 92:
              count2 = _context8.t1;

              if (!(count2 !== 0)) {
                _context8.next = 109;
                break;
              }

              i = 0;

            case 95:
              if (!(i < count2)) {
                _context8.next = 103;
                break;
              }

              if (!checkYield()) {
                _context8.next = 99;
                break;
              }

              _context8.next = 99;
              return;

            case 99:
              array[dest + i] = array[cursor2 + i];

            case 100:
              i++;
              _context8.next = 95;
              break;

            case 103:
              dest += count2;
              cursor2 += count2;
              length2 -= count2;

              if (!(length2 === 0)) {
                _context8.next = 109;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 115);

            case 109:
              array[dest++] = tmp[cursor1++];

              if (!(--length1 === 1)) {
                _context8.next = 113;
                break;
              }

              exit = true;
              return _context8.abrupt("break", 115);

            case 113:
              minGallop--;

            case 114:
              if (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING) {
                _context8.next = 66;
                break;
              }

            case 115:
              if (!exit) {
                _context8.next = 117;
                break;
              }

              return _context8.abrupt("break", 121);

            case 117:
              if (minGallop < 0) {
                minGallop = 0;
              }

              minGallop += 2;
              _context8.next = 41;
              break;

            case 121:
              this.minGallop = minGallop;

              if (minGallop < 1) {
                this.minGallop = 1;
              }

              if (!(length1 === 1)) {
                _context8.next = 136;
                break;
              }

              i = 0;

            case 125:
              if (!(i < length2)) {
                _context8.next = 133;
                break;
              }

              if (!checkYield()) {
                _context8.next = 129;
                break;
              }

              _context8.next = 129;
              return;

            case 129:
              array[dest + i] = array[cursor2 + i];

            case 130:
              i++;
              _context8.next = 125;
              break;

            case 133:
              array[dest + length2] = tmp[cursor1];
              _context8.next = 149;
              break;

            case 136:
              if (!(length1 === 0)) {
                _context8.next = 140;
                break;
              }

              throw new Error("mergeLow preconditions were not respected");

            case 140:
              i = 0;

            case 141:
              if (!(i < length1)) {
                _context8.next = 149;
                break;
              }

              if (!checkYield()) {
                _context8.next = 145;
                break;
              }

              _context8.next = 145;
              return;

            case 145:
              array[dest + i] = tmp[cursor1 + i];

            case 146:
              i++;
              _context8.next = 141;
              break;

            case 149:
            case "end":
              return _context8.stop();
          }
        }
      }, mergeLow, this);
    })
    /**
     * Merge two adjacent runs in a stable way. The runs must be such that the
     * first element of run1 is bigger than the first element in run2 and the
     * last element of run1 is greater than all the elements in run2.
     * The method should be called when run1.length > run2.length as it uses
     * TimSort temporary array to store run2. Use mergeLow if run1.length <=
     * run2.length.
     *
     * @param {number} start1 - First element in run1.
     * @param {number} length1 - Length of run1.
     * @param {number} start2 - First element in run2.
     * @param {number} length2 - Length of run2.
     */

  }, {
    key: "mergeHigh",
    value: /*#__PURE__*/regeneratorRuntime.mark(function mergeHigh(start1, length1, start2, length2) {
      var compare, array, tmp, i, cursor1, cursor2, dest, customCursor, customDest, minGallop, count1, count2, exit;
      return regeneratorRuntime.wrap(function mergeHigh$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              compare = this.compare;
              array = this.array;
              tmp = this.tmp;
              i = 0;
              i = 0;

            case 5:
              if (!(i < length2)) {
                _context9.next = 13;
                break;
              }

              if (!checkYield()) {
                _context9.next = 9;
                break;
              }

              _context9.next = 9;
              return;

            case 9:
              tmp[i] = array[start2 + i];

            case 10:
              i++;
              _context9.next = 5;
              break;

            case 13:
              cursor1 = start1 + length1 - 1;
              cursor2 = length2 - 1;
              dest = start2 + length2 - 1;
              customCursor = 0;
              customDest = 0;
              array[dest--] = array[cursor1--];

              if (!(--length1 === 0)) {
                _context9.next = 31;
                break;
              }

              customCursor = dest - (length2 - 1);
              i = 0;

            case 22:
              if (!(i < length2)) {
                _context9.next = 30;
                break;
              }

              if (!checkYield()) {
                _context9.next = 26;
                break;
              }

              _context9.next = 26;
              return;

            case 26:
              array[customCursor + i] = tmp[i];

            case 27:
              i++;
              _context9.next = 22;
              break;

            case 30:
              return _context9.abrupt("return");

            case 31:
              if (!(length2 === 1)) {
                _context9.next = 47;
                break;
              }

              dest -= length1;
              cursor1 -= length1;
              customDest = dest + 1;
              customCursor = cursor1 + 1;
              i = length1 - 1;

            case 37:
              if (!(i >= 0)) {
                _context9.next = 45;
                break;
              }

              if (!checkYield()) {
                _context9.next = 41;
                break;
              }

              _context9.next = 41;
              return;

            case 41:
              array[customDest + i] = array[customCursor + i];

            case 42:
              i--;
              _context9.next = 37;
              break;

            case 45:
              array[dest] = tmp[cursor2];
              return _context9.abrupt("return");

            case 47:
              minGallop = this.minGallop;

            case 48:
              if (!true) {
                _context9.next = 133;
                break;
              }

              count1 = 0;
              count2 = 0;
              exit = false;

            case 52:
              if (!checkYield()) {
                _context9.next = 55;
                break;
              }

              _context9.next = 55;
              return;

            case 55:
              if (!(compare(tmp[cursor2], array[cursor1]) < 0)) {
                _context9.next = 64;
                break;
              }

              array[dest--] = array[cursor1--];
              count1++;
              count2 = 0;

              if (!(--length1 === 0)) {
                _context9.next = 62;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 71);

            case 62:
              _context9.next = 70;
              break;

            case 64:
              array[dest--] = tmp[cursor2--];
              count2++;
              count1 = 0;

              if (!(--length2 === 1)) {
                _context9.next = 70;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 71);

            case 70:
              if ((count1 | count2) < minGallop) {
                _context9.next = 52;
                break;
              }

            case 71:
              if (!exit) {
                _context9.next = 73;
                break;
              }

              return _context9.abrupt("break", 133);

            case 73:
              _context9.t0 = length1;
              return _context9.delegateYield(gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare), "t1", 75);

            case 75:
              _context9.t2 = _context9.t1;
              count1 = _context9.t0 - _context9.t2;

              if (!(count1 !== 0)) {
                _context9.next = 95;
                break;
              }

              dest -= count1;
              cursor1 -= count1;
              length1 -= count1;
              customDest = dest + 1;
              customCursor = cursor1 + 1;
              i = count1 - 1;

            case 84:
              if (!(i >= 0)) {
                _context9.next = 92;
                break;
              }

              if (!checkYield()) {
                _context9.next = 88;
                break;
              }

              _context9.next = 88;
              return;

            case 88:
              array[customDest + i] = array[customCursor + i];

            case 89:
              i--;
              _context9.next = 84;
              break;

            case 92:
              if (!(length1 === 0)) {
                _context9.next = 95;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 127);

            case 95:
              array[dest--] = tmp[cursor2--];

              if (!(--length2 === 1)) {
                _context9.next = 99;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 127);

            case 99:
              _context9.t3 = length2;
              return _context9.delegateYield(gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare), "t4", 101);

            case 101:
              _context9.t5 = _context9.t4;
              count2 = _context9.t3 - _context9.t5;

              if (!(count2 !== 0)) {
                _context9.next = 121;
                break;
              }

              dest -= count2;
              cursor2 -= count2;
              length2 -= count2;
              customDest = dest + 1;
              customCursor = cursor2 + 1;
              i = 0;

            case 110:
              if (!(i < count2)) {
                _context9.next = 118;
                break;
              }

              if (!checkYield()) {
                _context9.next = 114;
                break;
              }

              _context9.next = 114;
              return;

            case 114:
              array[customDest + i] = tmp[customCursor + i];

            case 115:
              i++;
              _context9.next = 110;
              break;

            case 118:
              if (!(length2 <= 1)) {
                _context9.next = 121;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 127);

            case 121:
              array[dest--] = array[cursor1--];

              if (!(--length1 === 0)) {
                _context9.next = 125;
                break;
              }

              exit = true;
              return _context9.abrupt("break", 127);

            case 125:
              minGallop--;

            case 126:
              if (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING) {
                _context9.next = 73;
                break;
              }

            case 127:
              if (!exit) {
                _context9.next = 129;
                break;
              }

              return _context9.abrupt("break", 133);

            case 129:
              if (minGallop < 0) {
                minGallop = 0;
              }

              minGallop += 2;
              _context9.next = 48;
              break;

            case 133:
              this.minGallop = minGallop;

              if (minGallop < 1) {
                this.minGallop = 1;
              }

              if (!(length2 === 1)) {
                _context9.next = 152;
                break;
              }

              dest -= length1;
              cursor1 -= length1;
              customDest = dest + 1;
              customCursor = cursor1 + 1;
              i = length1 - 1;

            case 141:
              if (!(i >= 0)) {
                _context9.next = 149;
                break;
              }

              if (!checkYield()) {
                _context9.next = 145;
                break;
              }

              _context9.next = 145;
              return;

            case 145:
              array[customDest + i] = array[customCursor + i];

            case 146:
              i--;
              _context9.next = 141;
              break;

            case 149:
              array[dest] = tmp[cursor2];
              _context9.next = 166;
              break;

            case 152:
              if (!(length2 === 0)) {
                _context9.next = 156;
                break;
              }

              throw new Error("mergeHigh preconditions were not respected");

            case 156:
              customCursor = dest - (length2 - 1);
              i = 0;

            case 158:
              if (!(i < length2)) {
                _context9.next = 166;
                break;
              }

              if (!checkYield()) {
                _context9.next = 162;
                break;
              }

              _context9.next = 162;
              return;

            case 162:
              array[customCursor + i] = tmp[i];

            case 163:
              i++;
              _context9.next = 158;
              break;

            case 166:
            case "end":
              return _context9.stop();
          }
        }
      }, mergeHigh, this);
    })
  }]);

  return TimSort;
}();
/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {function=} compare - Item comparison function. Default is
 *     alphabetical
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 *     comparator.
 */


function sort(array, compare, lo, hi) {
  var itemExtract, remaining, runLength, ts, minRun, force;
  return regeneratorRuntime.wrap(function sort$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (Array.isArray(array)) {
            _context10.next = 2;
            break;
          }

          throw new TypeError("Can only sort arrays");

        case 2:
          /*
           * Handle the case where a comparison function is not provided. We do
           * lexicographic sorting
           */
          if (!compare) {
            compare = alphabeticalCompare;
          } else if (typeof compare !== "function") {
            hi = lo;
            lo = compare;
            compare = alphabeticalCompare;
          } else {
            if (compare.length === 1) {
              itemExtract = compare;

              compare = function compare(a, b) {
                var va = itemExtract(a);
                var vb = itemExtract(b);
                if (va === vb) return 0;
                return vb > va ? -1 : 1;
              };
            }
          }

          if (!lo) {
            lo = 0;
          }

          if (!hi) {
            hi = array.length;
          }

          remaining = hi - lo; // The array is already sorted

          if (!(remaining < 2)) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return");

        case 8:
          runLength = 0; // On small arrays binary sort can be used directly

          if (!(remaining < DEFAULT_MIN_MERGE)) {
            _context10.next = 16;
            break;
          }

          return _context10.delegateYield(makeAscendingRun(array, lo, hi, compare), "t0", 11);

        case 11:
          runLength = _context10.t0;
          binaryInsertionSort(array, lo, hi, lo + runLength, compare);
          _context10.next = 15;
          return;

        case 15:
          return _context10.abrupt("return");

        case 16:
          ts = new TimSort(array, compare);
          minRun = minRunLength(remaining);

        case 18:
          return _context10.delegateYield(makeAscendingRun(array, lo, hi, compare), "t1", 19);

        case 19:
          runLength = _context10.t1;

          if (!(runLength < minRun)) {
            _context10.next = 27;
            break;
          }

          force = remaining;

          if (force > minRun) {
            force = minRun;
          }

          binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
          _context10.next = 26;
          return;

        case 26:
          runLength = force;

        case 27:
          // Push new run and merge if necessary
          ts.pushRun(lo, runLength);
          return _context10.delegateYield(ts.mergeRuns(), "t2", 29);

        case 29:
          // Go find next run
          remaining -= runLength;
          lo += runLength;

        case 31:
          if (remaining !== 0) {
            _context10.next = 18;
            break;
          }

        case 32:
          return _context10.delegateYield(ts.forceMergeRuns(), "t3", 33);

        case 33:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked5);
}