"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yielding = yielding;
exports.wrapAsPromise = wrapAsPromise;

var _coroutines = _interopRequireDefault(require("./coroutines"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function yielding(fn) {
  var frequency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var yieldCount = 0;
  return /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = fn.apply(void 0, _args);

            if (!(yieldCount++ % frequency === 0)) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return;

          case 4:
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  });
}

function wrapAsPromise(coroutine) {
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _len,
        params,
        _key,
        _args3 = arguments;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            for (_len = _args3.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = _args3[_key];
            }

            _context3.next = 3;
            return (0, _coroutines.default)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      return _context2.delegateYield(coroutine.apply(void 0, params), "t0", 1);

                    case 1:
                      return _context2.abrupt("return", _context2.t0);

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}