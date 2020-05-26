"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unescapeJsonString = unescapeJsonString;
exports.isHexDigit = isHexDigit;

var _yielder = require("./yielder");

var _marked = /*#__PURE__*/regeneratorRuntime.mark(unescapeJsonString);

function unescapeJsonString(text) {
  var plain, iter, cur, i, one, two, three, four;
  return regeneratorRuntime.wrap(function unescapeJsonString$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(text.length < 32000 && !text.includes("\\"))) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", text);

        case 2:
          // Holds the unescaped string as we build it.
          plain = ""; // Use a string iterator over code points for proper unicode support.

          iter = text[Symbol.iterator]();
          i = 0;

        case 5:
          if ((cur = iter.next()).done) {
            _context.next = 22;
            break;
          }

          if (!((i++ & 7) == 0 && (0, _yielder.yielder)())) {
            _context.next = 9;
            break;
          }

          _context.next = 9;
          return;

        case 9:
          if (!(cur.value === "\\")) {
            _context.next = 19;
            break;
          }

          cur = iter.next();

          if (!cur.done) {
            _context.next = 16;
            break;
          }

          plain += "\\";
          return _context.abrupt("break", 22);

        case 16:
          if (cur.value === '"') {
            plain += '"';
          } else if (cur.value === "\\") {
            plain += "\\";
          } else if (cur.value === "/") {
            plain += "/";
          } else if (cur.value === "b") {
            plain += "\b";
          } else if (cur.value === "f") {
            plain += "\f";
          } else if (cur.value === "n") {
            plain += "\n";
          } else if (cur.value === "r") {
            plain += "\r";
          } else if (cur.value === "t") {
            plain += "\t";
          } else if (cur.value === "u") {
            one = iter.next();

            if (one.done) {
              plain += "\\u";
            } else if (!this.isHexDigit(one.value)) {
              plain += "\\u" + one.value;
            } else {
              two = iter.next();

              if (two.done) {
                plain += "\\u" + one.value;
              } else if (!this.isHexDigit(two.value)) {
                plain += "\\u" + one.value + two.value;
              } else {
                three = iter.next();

                if (three.done) {
                  plain += "\\u" + one.value + two.value;
                } else if (!this.isHexDigit(three.value)) {
                  plain += "\\u" + one.value + two.value + three.value;
                } else {
                  four = iter.next();

                  if (four.done) {
                    plain += "\\u" + one.value + two.value + three.value;
                  } else if (!this.isHexDigit(four.value)) {
                    plain += "\\u" + one.value + two.value + three.value + four.value;
                  } else {
                    try {
                      plain += JSON.parse("\"\\u" + one.value + two.value + three.value + four.value + '"');
                    } catch (_unused) {
                      // Something went wrong even though it looked like a valid hex value.
                      plain += "\\u" + one.value + two.value + three.value + four.value;
                    }
                  }
                }
              }
            }
          } else {
            plain += cur.value;
          }

        case 17:
          _context.next = 20;
          break;

        case 19:
          plain += cur.value;

        case 20:
          _context.next = 5;
          break;

        case 22:
          return _context.abrupt("return", plain);

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

function isHexDigit(char) {
  return char === "0" || char === "1" || char === "2" || char === "3" || char === "4" || char === "5" || char === "6" || char === "7" || char === "8" || char === "9" || char === "A" || char === "B" || char === "C" || char === "D" || char === "E" || char === "F" || char === "a" || char === "b" || char === "c" || char === "d" || char === "e" || char === "f";
}