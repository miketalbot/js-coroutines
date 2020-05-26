"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(quote),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(str),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(stringify);

//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  https://github.com/douglascrockford/JSON-js
//eslint-disable-next-line no-control-regex
var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; //eslint-disable-next-line no-control-regex

var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var gap;
var indent;
var meta;
var yieldCount = 0;

function yielder() {
  yieldCount++;

  if (yieldCount > 256) {
    yieldCount = 0;
    return true;
  }

  return false;
}

function quote(string) {
  var result, i, l, c, r;
  return regeneratorRuntime.wrap(function quote$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          result = '"';
          i = 0, l = string.length;

        case 2:
          if (!(i < l)) {
            _context.next = 11;
            break;
          }

          if (!((i & 7) === 0 && yielder())) {
            _context.next = 6;
            break;
          }

          _context.next = 6;
          return;

        case 6:
          c = string[i];

          if (rx_escapable.test(c)) {
            r = meta[c];

            if (typeof r === "string") {
              result += r;
            } else {
              result += "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
            }
          } else if (!rx_dangerous.test(c)) {
            result += c;
          }

        case 8:
          i++;
          _context.next = 2;
          break;

        case 11:
          return _context.abrupt("return", result + '"');

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function str(key, holder, ctrl) {
  var rep, i, k, v, length, mind, partial, value;
  return regeneratorRuntime.wrap(function str$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Produce a string from holder[key].
          rep = ctrl.rep;

          if (!yielder()) {
            _context2.next = 4;
            break;
          }

          _context2.next = 4;
          return;

        case 4:
          mind = gap;
          value = holder[key]; // If we were called with a replacer function, then call the replacer to
          // obtain a replacement value.

          if (value && _typeof(value) === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
          }

          if (typeof rep === "function") {
            value = rep.call(holder, key, value);
          } // What happens next depends on the value's type.


          _context2.t0 = _typeof(value);
          _context2.next = _context2.t0 === "string" ? 11 : _context2.t0 === "number" ? 13 : _context2.t0 === "boolean" ? 14 : _context2.t0 === "null" ? 14 : 15;
          break;

        case 11:
          return _context2.delegateYield(quote(value), "t1", 12);

        case 12:
          return _context2.abrupt("return", _context2.t1);

        case 13:
          return _context2.abrupt("return", isFinite(value) ? String(value) : "null");

        case 14:
          return _context2.abrupt("return", String(value));

        case 15:
          if (value) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", "null");

        case 17:
          // Make an array to hold the partial results of stringifying this object value.
          gap += indent;
          partial = []; // Is the value an array?

          if (!(Object.prototype.toString.apply(value) === "[object Array]")) {
            _context2.next = 34;
            break;
          }

          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.
          length = value.length;
          v = "[";
          i = 0;

        case 23:
          if (!(i < length)) {
            _context2.next = 33;
            break;
          }

          _context2.t2 = v;
          return _context2.delegateYield(str(i, value, ctrl) || "null", "t3", 26);

        case 26:
          _context2.t4 = _context2.t3;
          _context2.t5 = _context2.t2 + _context2.t4;
          _context2.t6 = i !== length - 1 ? "," : "";
          v = _context2.t5 + _context2.t6;

        case 30:
          i += 1;
          _context2.next = 23;
          break;

        case 33:
          return _context2.abrupt("return", v + "]");

        case 34:
          if (!(rep && _typeof(rep) === "object")) {
            _context2.next = 56;
            break;
          }

          length = rep.length;
          i = 0;

        case 37:
          if (!(i < length)) {
            _context2.next = 54;
            break;
          }

          if (!(typeof rep[i] === "string")) {
            _context2.next = 51;
            break;
          }

          k = rep[i];
          return _context2.delegateYield(str(k, value, ctrl), "t7", 41);

        case 41:
          v = _context2.t7;

          if (!v) {
            _context2.next = 51;
            break;
          }

          _context2.t8 = partial;
          return _context2.delegateYield(quote(k), "t9", 45);

        case 45:
          _context2.t10 = _context2.t9;
          _context2.t11 = gap ? ": " : ":";
          _context2.t12 = _context2.t10 + _context2.t11;
          _context2.t13 = v;
          _context2.t14 = _context2.t12 + _context2.t13;

          _context2.t8.push.call(_context2.t8, _context2.t14);

        case 51:
          i += 1;
          _context2.next = 37;
          break;

        case 54:
          _context2.next = 73;
          break;

        case 56:
          _context2.t15 = regeneratorRuntime.keys(value);

        case 57:
          if ((_context2.t16 = _context2.t15()).done) {
            _context2.next = 73;
            break;
          }

          k = _context2.t16.value;

          if (!Object.prototype.hasOwnProperty.call(value, k)) {
            _context2.next = 71;
            break;
          }

          return _context2.delegateYield(str(k, value, ctrl), "t17", 61);

        case 61:
          v = _context2.t17;

          if (!v) {
            _context2.next = 71;
            break;
          }

          _context2.t18 = partial;
          return _context2.delegateYield(quote(k), "t19", 65);

        case 65:
          _context2.t20 = _context2.t19;
          _context2.t21 = gap ? ": " : ":";
          _context2.t22 = _context2.t20 + _context2.t21;
          _context2.t23 = v;
          _context2.t24 = _context2.t22 + _context2.t23;

          _context2.t18.push.call(_context2.t18, _context2.t24);

        case 71:
          _context2.next = 57;
          break;

        case 73:
          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.
          v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
          gap = mind;
          return _context2.abrupt("return", v);

        case 76:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2);
} // If the JSON object does not yet have a stringify method, give it one.


meta = {
  // table of character substitutions
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  '"': '\\"',
  "\\": "\\\\"
};

function stringify(value, replacer, space) {
  var i;
  return regeneratorRuntime.wrap(function stringify$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // The stringify method takes a value and an optional replacer, and an optional
          // space parameter, and returns a JSON text. The replacer can be a function
          // that can replace values, or an array of strings that will select the keys.
          // A default replacer method can be provided. Use of the space parameter can
          // produce text that is more easily readable.
          gap = "";
          indent = ""; // If the space parameter is a number, make an indent string containing that
          // many spaces.

          if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
              indent += " ";
            } // If the space parameter is a string, it will be used as the indent string.

          } else if (typeof space === "string") {
            indent = space;
          } // If there is a replacer, it must be a function or an array.
          // Otherwise, throw an error.


          if (!(replacer && typeof replacer !== "function" && (_typeof(replacer) !== "object" || typeof replacer.length !== "number"))) {
            _context3.next = 5;
            break;
          }

          throw new Error("JSON.stringify");

        case 5:
          return _context3.delegateYield(str("", {
            "": value
          }, {
            rep: replacer
          }), "t0", 6);

        case 6:
          return _context3.abrupt("return", _context3.t0);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3);
}