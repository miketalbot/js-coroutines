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
const DEFAULT_MIN_MERGE = 32;

const YIELD_FREQ = 127;

/**
 * Minimum ordered subsequece required to do galloping.
 */
const DEFAULT_MIN_GALLOPING = 7;

/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
const DEFAULT_TMP_STORAGE_LENGTH = 256;

function* copy(target, source, items, offset = 0, offset2 = 0) {
  let loop = items & 7
  let bigLoops = (items & ~7) + offset
  let i = offset
  let j = offset2
  for (; i < bigLoops; i += 8, j += 8) {
    target[i] = source[j]
    target[i + 1] = source[j + 1]
    target[i + 2] = source[j + 2]
    target[i + 3] = source[j + 3]
    target[i + 4] = source[j + 4]
    target[i + 5] = source[j + 5]
    target[i + 6] = source[j + 6]
    target[i + 7] = source[j + 7]
    if (checkYield()) yield;
  }
  let end = loop + i
  for (; i < end; i++, j++) {
    target[i] = source[j]
  }
}

/**
 * Compute minimum run length for TimSort
 *
 * @param {number} n - The size of the array to sort.
 */
function minRunLength(n) {
  let r = 0;

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
function* makeAscendingRun(array, lo, hi, compare) {
  let runHi = lo + 1;

  if (runHi === hi) {
    return 1;
  }

  // Descending
  if (compare(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
      if ((runHi & YIELD_FREQ) === 0) {
        yield;
      }
    }

    yield* reverseRun(array, lo, runHi);
    // Ascending
  } else {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
      if ((runHi & YIELD_FREQ) === 0) {
        yield;
      }
    }
  }

  return runHi - lo;
}

/**
 * Reverse an array in the range [lo, hi).
 *
 * @param {array} array - The array to reverse.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 */
function* reverseRun(array, lo, hi) {
  hi--;

  while (lo < hi) {
    let t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
    if ((hi & 127) === 0) yield;
  }
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
    let pivot = array[start];

    // Ranges of the array where pivot belongs
    let left = lo;
    let right = start;

    /*
     *   pivot >= array[i] for i in [lo, left)
     *   pivot <  array[i] for i in  in [right, start)
     */

    while (left < right) {
      let mid = (left + right) >>> 1;
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
    let n = start - left;
    // Switch is just an optimization for small arrays
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

let yieldCounter = 0;
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
function* gallopLeft(value, array, start, length, hint, compare) {
  yield;
  let lastOffset = 0;
  let maxOffset = 0;
  let offset = 1;

  if (compare(value, array[start + hint]) > 0) {
    maxOffset = length - hint;

    while (
      offset < maxOffset &&
      compare(value, array[start + hint + offset]) > 0
    ) {
      if (checkYield()) yield;
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    lastOffset += hint;
    offset += hint;

    // value <= array[start + hint]
  } else {
    maxOffset = hint + 1;

    while (
      offset < maxOffset &&
      compare(value, array[start + hint - offset]) <= 0
    ) {
      if (checkYield()) yield;
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    let tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++;
  while (lastOffset < offset) {
    let m = lastOffset + ((offset - lastOffset) >>> 1);
    if (checkYield()) yield;
    if (compare(value, array[start + m]) > 0) {
      lastOffset = m + 1;
    } else {
      offset = m;
    }
  }
  return offset;
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
function* gallopRight(value, array, start, length, hint, compare) {
  yield;
  let lastOffset = 0;
  let maxOffset = 0;
  let offset = 1;

  if (compare(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;

    while (
      offset < maxOffset &&
      compare(value, array[start + hint - offset]) < 0
    ) {
      if (checkYield()) yield;
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    let tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;

    // value >= array[start + hint]
  } else {
    maxOffset = length - hint;
    while (
      offset < maxOffset &&
      compare(value, array[start + hint + offset]) >= 0
    ) {
      if (checkYield()) yield;
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    // Make offsets relative to start
    lastOffset += hint;
    offset += hint;
  }

  /*
   * Now array[start+lastOffset] < value <= array[start+offset], so value
   * belongs somewhere in the range (start + lastOffset, start + offset]. Do a
   * binary search, with invariant array[start + lastOffset - 1] < value <=
   * array[start + offset].
   */
  lastOffset++;
  while (lastOffset < offset) {
    let m = lastOffset + ((offset - lastOffset) >>> 1);
    if (checkYield()) yield;
    if (compare(value, array[start + m]) < 0) {
      offset = m;
    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

class TimSort {
  array = null;
  compare = null;
  minGallop = DEFAULT_MIN_GALLOPING;
  length = 0;
  tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
  stackLength = 0;
  runStart = null;
  runLength = null;
  stackSize = 0;

  constructor(array, compare) {
    this.array = array;
    this.compare = compare;

    this.length = array.length;

    if (this.length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
      this.tmpStorageLength = this.length >>> 1;
    }

    this.tmp = new Array(this.tmpStorageLength);

    this.stackLength =
      this.length < 120
        ? 5
        : this.length < 1542
        ? 10
        : this.length < 119151
        ? 19
        : 40;

    this.runStart = new Array(this.stackLength);
    this.runLength = new Array(this.stackLength);
  }

  /**
   * Push a new run on TimSort's stack.
   *
   * @param {number} runStart - Start index of the run in the original array.
   * @param {number} runLength - Length of the run;
   */
  pushRun(runStart, runLength) {
    this.runStart[this.stackSize] = runStart;
    this.runLength[this.stackSize] = runLength;
    this.stackSize += 1;
  }

  /**
   * Merge runs on TimSort's stack so that the following holds for all i:
   * 1) runLength[i - 3] > runLength[i - 2] + runLength[i - 1]
   * 2) runLength[i - 2] > runLength[i - 1]
   */
  *mergeRuns() {
    while (this.stackSize > 1) {
      let n = this.stackSize - 2;

      if (
        (n >= 1 &&
          this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1]) ||
        (n >= 2 &&
          this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])
      ) {
        if (this.runLength[n - 1] < this.runLength[n + 1]) {
          n--;
        }
      } else if (this.runLength[n] > this.runLength[n + 1]) {
        break;
      }
      yield* this.mergeAt(n);
    }
  }

  /**
   * Merge all runs on TimSort's stack until only one remains.
   */
  *forceMergeRuns() {
    while (this.stackSize > 1) {
      let n = this.stackSize - 2;

      if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
        n--;
      }

      yield* this.mergeAt(n);
    }
  }

  /**
   * Merge the runs on the stack at positions i and i+1. Must be always be called
   * with i=stackSize-2 or i=stackSize-3 (that is, we merge on top of the stack).
   *
   * @param {number} i - Index of the run to merge in TimSort's stack.
   */
  *mergeAt(i) {
    yield;
    let compare = this.compare;
    let array = this.array;

    let start1 = this.runStart[i];
    let length1 = this.runLength[i];
    let start2 = this.runStart[i + 1];
    let length2 = this.runLength[i + 1];

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
    let k = yield* gallopRight(
      array[start2],
      array,
      start1,
      length1,
      0,
      compare
    );
    start1 += k;
    length1 -= k;

    if (length1 === 0) {
      return;
    }

    /*
     * Find where the last element in the first run goes in run2. Next elements
     * in run2 are already in place
     */
    length2 = yield* gallopLeft(
      array[start1 + length1 - 1],
      array,
      start2,
      length2,
      length2 - 1,
      compare
    );

    if (length2 === 0) {
      return;
    }

    /*
     * Merge remaining runs. A tmp array with length = min(length1, length2) is
     * used
     */
    if (length1 <= length2) {
      yield* this.mergeLow(start1, length1, start2, length2);
    } else {
      yield* this.mergeHigh(start1, length1, start2, length2);
    }
  }

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
  *mergeLow(start1, length1, start2, length2) {
    let compare = this.compare;
    let array = this.array;
    let tmp = this.tmp;
    yield * copy(tmp, array, length1, 0, start1)

    let cursor1 = 0;
    let cursor2 = start2;
    let dest = start1;

    array[dest++] = array[cursor2++];

    if (--length2 === 0) {
      yield * copy(array, tmp, length1, dest, cursor1)
      return;
    }

    if (length1 === 1) {
      yield * copy(array, array, length2, dest, cursor2)
      array[dest + length2] = tmp[cursor1];
      return;
    }

    let minGallop = this.minGallop;

    while (true) {
      let count1 = 0;
      let count2 = 0;
      let exit = false;

      do {
        if (checkYield()) yield;
        if (compare(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;

          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;
          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);

      if (exit) {
        break;
      }

      do {
        if (checkYield()) yield;
        count1 = yield* gallopRight(
          array[cursor2],
          tmp,
          cursor1,
          length1,
          0,
          compare
        );

        if (count1 !== 0) {
          yield * copy(array, tmp, count1, dest, cursor1)

          dest += count1;
          cursor1 += count1;
          length1 -= count1;
          if (length1 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
          exit = true;
          break;
        }

        count2 = yield* gallopLeft(
          tmp[cursor1],
          array,
          cursor2,
          length2,
          0,
          compare
        );

        if (count2 !== 0) {
          yield * copy(array, array, count2, dest, cursor2)

          dest += count2;
          cursor2 += count2;
          length2 -= count2;

          if (length2 === 0) {
            exit = true;
            break;
          }
        }
        array[dest++] = tmp[cursor1++];

        if (--length1 === 1) {
          exit = true;
          break;
        }

        minGallop--;
      } while (
        count1 >= DEFAULT_MIN_GALLOPING ||
        count2 >= DEFAULT_MIN_GALLOPING
      );

      if (exit) {
        break;
      }

      if (minGallop < 0) {
        minGallop = 0;
      }

      minGallop += 2;
    }

    this.minGallop = minGallop;

    if (minGallop < 1) {
      this.minGallop = 1;
    }

    if (length1 === 1) {
      yield * copy(array, array, length2, dest, cursor2)
      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error("mergeLow preconditions were not respected");
    } else {
      yield * copy(array, tmp, length1, dest, cursor1)

    }
  }

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
  *mergeHigh(start1, length1, start2, length2) {
    let compare = this.compare;
    let array = this.array;
    let tmp = this.tmp;
    let i = 0;
    yield * copy(tmp, array, length2, 0, start2)

    let cursor1 = start1 + length1 - 1;
    let cursor2 = length2 - 1;
    let dest = start2 + length2 - 1;
    let customCursor = 0;
    let customDest = 0;

    array[dest--] = array[cursor1--];

    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);
      yield * copy(array, tmp, length2, customCursor, 0)

      return;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        if (checkYield()) yield;
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
      return;
    }

    let minGallop = this.minGallop;

    while (true) {
      let count1 = 0;
      let count2 = 0;
      let exit = false;

      do {
        if (checkYield()) yield;
        if (compare(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;
          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;
          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < minGallop);

      if (exit) {
        break;
      }

      do {
        count1 =
          length1 -
          (yield* gallopRight(
            tmp[cursor2],
            array,
            start1,
            length1,
            length1 - 1,
            compare
          ));

        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;
          for (i = count1 - 1; i >= 0; i--) {
            if (checkYield()) yield;
            array[customDest + i] = array[customCursor + i];
          }

          if (length1 === 0) {
            exit = true;
            break;
          }
        }

        array[dest--] = tmp[cursor2--];

        if (--length2 === 1) {
          exit = true;
          break;
        }

        count2 =
          length2 -
          (yield* gallopLeft(
            array[cursor1],
            tmp,
            0,
            length2,
            length2 - 1,
            compare
          ));

        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;
          yield * copy(array, tmp, count2, customDest, customCursor)

          if (length2 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
          exit = true;
          break;
        }

        minGallop--;
      } while (
        count1 >= DEFAULT_MIN_GALLOPING ||
        count2 >= DEFAULT_MIN_GALLOPING
      );

      if (exit) {
        break;
      }

      if (minGallop < 0) {
        minGallop = 0;
      }

      minGallop += 2;
    }

    this.minGallop = minGallop;

    if (minGallop < 1) {
      this.minGallop = 1;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        if (checkYield()) yield;
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error("mergeHigh preconditions were not respected");
    } else {
      customCursor = dest - (length2 - 1);
      yield * copy(array, tmp, length2, customCursor, 0)
    }
  }
}

function simpleCompare(a,b) {
  return a===b ? 0 : a > b ? 1 : -1
}

/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {function} compare - Item comparison function.
 * @param {number} [lo] - First element in the range (inclusive).
 * @param {number} [hi] - Last element in the range.
 *     comparator.
 * @returns {array} the sorted array
 */
export function* sort(array, compare, lo, hi) {
  if (!Array.isArray(array)) {
    throw new TypeError("Can only sort arrays");
  }

  /*
   * Handle the case where a comparison function is not provided. We do
   * lexicographic sorting
   */
  if (!compare) {
    compare = simpleCompare;
  } else if (typeof compare !== "function") {
    hi = lo;
    lo = compare;
    compare = simpleCompare;
  } else {
    if (compare.length === 1) {
      let itemExtract = compare;
      compare = (a, b) => {
        const va = itemExtract(a);
        const vb = itemExtract(b);
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

  let remaining = hi - lo;

  // The array is already sorted
  if (remaining < 2) {
    return array;
  }

  let runLength = 0;
  // On small arrays binary sort can be used directly
  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = yield* makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    yield;
    return array;
  }

  let ts = new TimSort(array, compare);

  let minRun = minRunLength(remaining);

  do {
    runLength = yield* makeAscendingRun(array, lo, hi, compare);
    if (runLength < minRun) {
      let force = remaining;
      if (force > minRun) {
        force = minRun;
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
      yield;
      runLength = force;
    }
    // Push new run and merge if necessary
    ts.pushRun(lo, runLength);
    yield* ts.mergeRuns();

    // Go find next run
    remaining -= runLength;
    lo += runLength;
  } while (remaining !== 0);

  // Force merging of remaining runs
  yield* ts.forceMergeRuns();
  return array
}
