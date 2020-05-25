"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.everyAsync = exports.someAsync = exports.forEachAsync = exports.concatAsync = exports.appendAsync = exports.reduceAsync = exports.filterAsync = exports.mapAsync = exports.findIndexAsync = exports.findAsync = exports.sortAsync = exports.parseAsync = exports.stringifyAsync = void 0;

var _wrappers = require("./wrappers");

var _json = require("./json");

var _parse = require("./yastjson/lib/parse");

var _timsort = require("./timsort");

var _arrayUtilities = require("./array-utilities");

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
var everyAsync = wrapAsPromiseAndYieldFn(_arrayUtilities.every);
exports.everyAsync = everyAsync;