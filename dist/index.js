"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  compress: true,
  decompress: true,
  stringify: true,
  parse: true,
  sort: true
};
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function get() {
    return _json.stringify;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _parse.parse;
  }
});
Object.defineProperty(exports, "sort", {
  enumerable: true,
  get: function get() {
    return _timsort.sort;
  }
});
exports.decompress = exports.compress = void 0;

require("./polyfill");

var _json = require("./json");

var _parse = require("./yastjson/lib/parse");

var _lzString = require("./lz-string/lz-string");

Object.keys(_lzString).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _lzString[key];
    }
  });
});

var _timsort = require("./timsort");

var _arrayUtilities = require("./array-utilities");

Object.keys(_arrayUtilities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _arrayUtilities[key];
    }
  });
});

var _wrappers = require("./wrappers");

Object.keys(_wrappers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _wrappers[key];
    }
  });
});

var _coroutines = require("./coroutines");

Object.keys(_coroutines).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _coroutines[key];
    }
  });
});

var _asyncWrappers = require("./async-wrappers");

Object.keys(_asyncWrappers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _asyncWrappers[key];
    }
  });
});

var _base64String = require("./lz-string/base64-string");

Object.keys(_base64String).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _base64String[key];
    }
  });
});
var compress = _lzString.LZStringGenerator.compress;
exports.compress = compress;
var decompress = _lzString.LZStringGenerator.decompress;
exports.decompress = decompress;