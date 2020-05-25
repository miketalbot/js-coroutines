"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.ASTParser = void 0;

var _tokenizer = require("./tokenizer");

var _ast = require("./ast");

var _expression = require("./expression");

var _token = require("./token");

var _yielder = require("./yielder");

var _marked = /*#__PURE__*/regeneratorRuntime.mark(parse);

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ASTParser = /*#__PURE__*/function () {
  function ASTParser(ast) {
    _classCallCheck(this, ASTParser);

    this.ast = ast;
  }

  _createClass(ASTParser, [{
    key: "getJson",
    value: /*#__PURE__*/regeneratorRuntime.mark(function getJson() {
      var outputJson;
      return regeneratorRuntime.wrap(function getJson$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(this.handleJson(this.ast), "t0", 1);

            case 1:
              outputJson = _context.t0;
              return _context.abrupt("return", outputJson);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, getJson, this);
    })
  }, {
    key: "handleJson",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleJson(astNode) {
      var output, node, _iterator, _step, item, value, _iterator2, _step2, _item, prop, _value;

      return regeneratorRuntime.wrap(function handleJson$(_context2) {
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
                _context2.next = 29;
                break;
              }

              output = [];
              _iterator = _createForOfIteratorHelper(node.childNodeList);
              _context2.prev = 6;

              _iterator.s();

            case 8:
              if ((_step = _iterator.n()).done) {
                _context2.next = 19;
                break;
              }

              item = _step.value;

              if (!(item.type === _expression.ExprType.Value)) {
                _context2.next = 16;
                break;
              }

              return _context2.delegateYield(this.handleValue(item.value), "t0", 12);

            case 12:
              value = _context2.t0;
              output.push(value);
              _context2.next = 17;
              break;

            case 16:
              throw new Error("[parse AST error] unexpected node type, expect Value");

            case 17:
              _context2.next = 8;
              break;

            case 19:
              _context2.next = 24;
              break;

            case 21:
              _context2.prev = 21;
              _context2.t1 = _context2["catch"](6);

              _iterator.e(_context2.t1);

            case 24:
              _context2.prev = 24;

              _iterator.f();

              return _context2.finish(24);

            case 27:
              _context2.next = 59;
              break;

            case 29:
              if (!(node.type === _expression.ExprType.Object)) {
                _context2.next = 58;
                break;
              }

              output = {};
              _iterator2 = _createForOfIteratorHelper(node.childNodeList);
              _context2.prev = 32;

              _iterator2.s();

            case 34:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 48;
                break;
              }

              _item = _step2.value;

              if (!(_item.type === _expression.ExprType.Prop)) {
                _context2.next = 45;
                break;
              }

              prop = _item.propName;

              if (!(_item.childNodeList[0].type !== _expression.ExprType.Value)) {
                _context2.next = 40;
                break;
              }

              throw new Error("[parse AST error] unexpected node type, expect Value");

            case 40:
              return _context2.delegateYield(this.handleValue(_item.childNodeList[0].value), "t2", 41);

            case 41:
              _value = _context2.t2;
              output[prop] = _value;
              _context2.next = 46;
              break;

            case 45:
              throw new Error("[parse AST error] unexpected node type, expect Prop");

            case 46:
              _context2.next = 34;
              break;

            case 48:
              _context2.next = 53;
              break;

            case 50:
              _context2.prev = 50;
              _context2.t3 = _context2["catch"](32);

              _iterator2.e(_context2.t3);

            case 53:
              _context2.prev = 53;

              _iterator2.f();

              return _context2.finish(53);

            case 56:
              _context2.next = 59;
              break;

            case 58:
              throw new Error("[parse AST error] unexpected second node type");

            case 59:
              return _context2.abrupt("return", output);

            case 60:
            case "end":
              return _context2.stop();
          }
        }
      }, handleJson, this, [[6, 21, 24, 27], [32, 50, 53, 56]]);
    })
  }, {
    key: "handleValue",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleValue(astNode) {
      var token, num;
      return regeneratorRuntime.wrap(function handleValue$(_context3) {
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
              _context3.next = _context3.t0 === _token.TokenType.Null ? 6 : _context3.t0 === _token.TokenType.Boolean ? 7 : _context3.t0 === _token.TokenType.Number ? 17 : _context3.t0 === _token.TokenType.String ? 22 : _context3.t0 === _expression.ExprType.Json ? 24 : 26;
              break;

            case 6:
              return _context3.abrupt("return", null);

            case 7:
              token = astNode.tokens[0].text;

              if (!(token === "true")) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("return", true);

            case 12:
              if (!(token === "false")) {
                _context3.next = 16;
                break;
              }

              return _context3.abrupt("return", false);

            case 16:
              throw new Error("[parse AST error] unexpected boolean node value");

            case 17:
              token = astNode.tokens[0].text;
              num = parseFloat(token);

              if (!isNaN(num)) {
                _context3.next = 21;
                break;
              }

              throw new Error("[parse AST error] unexpected number node value");

            case 21:
              return _context3.abrupt("return", num);

            case 22:
              token = astNode.tokens[0].text;
              return _context3.abrupt("return", token.slice(1, token.length - 1));

            case 24:
              return _context3.delegateYield(this.handleJson(astNode), "t1", 25);

            case 25:
              return _context3.abrupt("return", _context3.t1);

            case 26:
              throw new Error("[parse AST error] unexpected node type, expect a valid Value node");

            case 27:
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
  return regeneratorRuntime.wrap(function parse$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          tokenizer = new _tokenizer.Tokenizer();
          _context4.next = 3;
          return;

        case 3:
          return _context4.delegateYield(tokenizer.tokenize(jsonString), "t0", 4);

        case 4:
          tokens = _context4.t0;
          astInst = new _ast.AST(tokens);
          _context4.next = 8;
          return;

        case 8:
          return _context4.delegateYield(astInst.buildTree(), "t1", 9);

        case 9:
          ast = _context4.t1;
          astParser = new ASTParser(ast);
          _context4.next = 13;
          return;

        case 13:
          return _context4.delegateYield(astParser.getJson(), "t2", 14);

        case 14:
          return _context4.abrupt("return", _context4.t2);

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked);
}