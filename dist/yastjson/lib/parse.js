"use strict";

var _regeneratorRuntime2 = require("@babel/runtime/regenerator");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.ASTParser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _tokenizer = require("./tokenizer");

var _ast = require("./ast");

var _expression = require("./expression");

var _token = require("./token");

var _yielder = require("./yielder");

var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(parse);

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ASTParser = /*#__PURE__*/function () {
  function ASTParser(ast) {
    (0, _classCallCheck2.default)(this, ASTParser);
    this.ast = ast;
  }

  (0, _createClass2.default)(ASTParser, [{
    key: "getJson",
    value: /*#__PURE__*/_regenerator.default.mark(function getJson() {
      return _regenerator.default.wrap(function getJson$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(this.handleValue(this.ast), "t0", 1);

            case 1:
              return _context.abrupt("return", _context.t0);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, getJson, this);
    })
  }, {
    key: "handleJson",
    value: /*#__PURE__*/_regenerator.default.mark(function handleJson(astNode) {
      var output, node, _iterator, _step, item, _iterator2, _step2, _item;

      return _regenerator.default.wrap(function handleJson$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(astNode.type !== _expression.ExprType.Json)) {
                _context2.next = 2;
                break;
              }

              throw new Error("[parse AST error] unexpected node type, expect Json");

            case 2:
              node = astNode.childNodeList[0];

              if (!(node.type === _expression.ExprType.Array)) {
                _context2.next = 26;
                break;
              }

              output = [];
              _iterator = _createForOfIteratorHelper(node.childNodeList);
              _context2.prev = 6;

              _iterator.s();

            case 8:
              if ((_step = _iterator.n()).done) {
                _context2.next = 16;
                break;
              }

              item = _step.value;
              _context2.t0 = output;
              return _context2.delegateYield(this.handleValue(item.value), "t1", 12);

            case 12:
              _context2.t2 = _context2.t1;

              _context2.t0.push.call(_context2.t0, _context2.t2);

            case 14:
              _context2.next = 8;
              break;

            case 16:
              _context2.next = 21;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t3 = _context2["catch"](6);

              _iterator.e(_context2.t3);

            case 21:
              _context2.prev = 21;

              _iterator.f();

              return _context2.finish(21);

            case 24:
              _context2.next = 48;
              break;

            case 26:
              if (!(node.type === _expression.ExprType.Object)) {
                _context2.next = 47;
                break;
              }

              output = {};
              _iterator2 = _createForOfIteratorHelper(node.childNodeList);
              _context2.prev = 29;

              _iterator2.s();

            case 31:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 37;
                break;
              }

              _item = _step2.value;
              return _context2.delegateYield(this.handleValue(_item.childNodeList[0].value), "t4", 34);

            case 34:
              output[_item.propName] = _context2.t4;

            case 35:
              _context2.next = 31;
              break;

            case 37:
              _context2.next = 42;
              break;

            case 39:
              _context2.prev = 39;
              _context2.t5 = _context2["catch"](29);

              _iterator2.e(_context2.t5);

            case 42:
              _context2.prev = 42;

              _iterator2.f();

              return _context2.finish(42);

            case 45:
              _context2.next = 48;
              break;

            case 47:
              throw new Error("[parse AST error] unexpected second node type");

            case 48:
              return _context2.abrupt("return", output);

            case 49:
            case "end":
              return _context2.stop();
          }
        }
      }, handleJson, this, [[6, 18, 21, 24], [29, 39, 42, 45]]);
    })
  }, {
    key: "handleValue",
    value: /*#__PURE__*/_regenerator.default.mark(function handleValue(astNode) {
      var token, num;
      return _regenerator.default.wrap(function handleValue$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(0, _yielder.yielder)()) {
                _context3.next = 3;
                break;
              }

              _context3.next = 3;
              return;

            case 3:
              _context3.t0 = astNode.type;
              _context3.next = _context3.t0 === _token.TokenType.Null ? 6 : _context3.t0 === _token.TokenType.Boolean ? 7 : _context3.t0 === _token.TokenType.Number ? 9 : _context3.t0 === _token.TokenType.String ? 11 : _context3.t0 === _expression.ExprType.Json ? 12 : 14;
              break;

            case 6:
              return _context3.abrupt("return", null);

            case 7:
              token = astNode.tokens[0].text;
              return _context3.abrupt("return", token === "true");

            case 9:
              num = +astNode.tokens[0].text;
              return _context3.abrupt("return", num);

            case 11:
              return _context3.abrupt("return", astNode.tokens[0].text.slice(1, -1));

            case 12:
              return _context3.delegateYield(this.handleJson(astNode), "t1", 13);

            case 13:
              return _context3.abrupt("return", _context3.t1);

            case 14:
              throw new Error("[parse AST error] unexpected node type, expect a valid Value node");

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, handleValue, this);
    })
  }]);
  return ASTParser;
}();

exports.ASTParser = ASTParser;

function parse(jsonString) {
  var tokenizer, tokens, astInst, ast, astParser;
  return _regenerator.default.wrap(function parse$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          tokenizer = new _tokenizer.Tokenizer();
          return _context4.delegateYield(tokenizer.tokenize(jsonString), "t0", 2);

        case 2:
          tokens = _context4.t0;
          astInst = new _ast.AST(tokens);
          return _context4.delegateYield(astInst.buildTree(), "t1", 5);

        case 5:
          ast = _context4.t1;
          astParser = new ASTParser(ast);
          return _context4.delegateYield(astParser.getJson(), "t2", 8);

        case 8:
          return _context4.abrupt("return", _context4.t2);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked);
}