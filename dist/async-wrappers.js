"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64Decompress = exports.base64decompressFromUTF16Async = exports.decompressAsync = exports.decompressFromEncodedURIComponent = exports.decompressFromUint8Array = exports.decompressFromUTF16 = exports.decompressFromBase64Async = exports.base64Compress = exports.base64CompressToUTF16Async = exports.compressAsync = exports.compressToEncodedURIComponent = exports.compressToUint8Array = exports.compressToUTF16 = exports.compressToBase64Async = exports.everyAsync = exports.someAsync = exports.forEachAsync = exports.concatAsync = exports.appendAsync = exports.reduceAsync = exports.filterAsync = exports.mapAsync = exports.findIndexAsync = exports.findAsync = exports.sortAsync = exports.parseAsync = exports.stringifyAsync = void 0;

var _wrappers = require("./wrappers");

var _json = require("./json");

var _parse = require("./yastjson/lib/parse");

var _timsort = require("./timsort");

var _arrayUtilities = require("./array-utilities");

var _lzString = require("./lz-string/lz-string");

var _base64String = require("./lz-string/base64-string");

function wrapAsPromiseAndYieldFn(fn) {
  var yielder = (0, _wrappers.wrapAsPromise)(fn);
  return function (array, fn) {
    return yielder(array, (0, _wrappers.yielding)(fn));
  };
}

var stringifyAsync = (0, _wrappers.wrapAsPromise)(_json.stringify);
exports.stringifyAsync = stringifyAsync;
var parseAsync = (0, _wrappers.wrapAsPromise)(_parse.parse);
exports.parseAsync = parseAsync;
var sortAsync = (0, _wrappers.wrapAsPromise)(_timsort.sort);
exports.sortAsync = sortAsync;
var findAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.find);
exports.findAsync = findAsync;
var findIndexAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.findIndex);
exports.findIndexAsync = findIndexAsync;
var mapAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.map);
exports.mapAsync = mapAsync;
var filterAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.filter);
exports.filterAsync = filterAsync;
var reduceAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.reduce);
exports.reduceAsync = reduceAsync;
var appendAsync = (0, _wrappers.wrapAsPromise)(_arrayUtilities.append);
exports.appendAsync = appendAsync;
var concatAsync = (0, _wrappers.wrapAsPromise)(_arrayUtilities.concat);
exports.concatAsync = concatAsync;
var forEachAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.forEach);
exports.forEachAsync = forEachAsync;
var someAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.some);
exports.someAsync = someAsync;
var everyAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.every); // Compression

exports.everyAsync = everyAsync;
var compressToBase64Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToBase64);
exports.compressToBase64Async = compressToBase64Async;
var compressToUTF16 = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToUTF16);
exports.compressToUTF16 = compressToUTF16;
var compressToUint8Array = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToUint8Array);
exports.compressToUint8Array = compressToUint8Array;
var compressToEncodedURIComponent = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compressToEncodedURIComponent);
exports.compressToEncodedURIComponent = compressToEncodedURIComponent;
var compressAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.compress);
exports.compressAsync = compressAsync;
var base64CompressToUTF16Async = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.compressToUTF16);
exports.base64CompressToUTF16Async = base64CompressToUTF16Async;
var base64Compress = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.compress); // Decompression

exports.base64Compress = base64Compress;
var decompressFromBase64Async = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromBase64);
exports.decompressFromBase64Async = decompressFromBase64Async;
var decompressFromUTF16 = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromUTF16);
exports.decompressFromUTF16 = decompressFromUTF16;
var decompressFromUint8Array = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromUint8Array);
exports.decompressFromUint8Array = decompressFromUint8Array;
var decompressFromEncodedURIComponent = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompressFromURIComponent);
exports.decompressFromEncodedURIComponent = decompressFromEncodedURIComponent;
var decompressAsync = (0, _wrappers.wrapAsPromise)(_lzString.LZStringGenerator.decompress);
exports.decompressAsync = decompressAsync;
var base64decompressFromUTF16Async = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.decompressFromUTF16);
exports.base64decompressFromUTF16Async = base64decompressFromUTF16Async;
var base64Decompress = (0, _wrappers.wrapAsPromise)(_base64String.Base64StringGenerator.decompress);
exports.base64Decompress = base64Decompress;