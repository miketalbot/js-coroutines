"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AST = exports.ASTNode = void 0;

var _token = require("./token");

var _expression = require("./expression");

var _yielder = require("./yielder");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ASTNode = /*#__PURE__*/function () {
  function ASTNode(tokens, type) {
    _classCallCheck(this, ASTNode);

    this.type = type;
    this.tokens = tokens;
    this.childNodeList = [];
  }

  _createClass(ASTNode, [{
    key: "addChild",
    value: function addChild(node) {
      this.childNodeList.push(node);
    }
  }]);

  return ASTNode;
}();

exports.ASTNode = ASTNode;

var AST = /*#__PURE__*/function () {
  function AST(tokens) {
    _classCallCheck(this, AST);

    this.tokens = tokens;
    this.buildTree();
  }

  _createClass(AST, [{
    key: "buildTree",
    value: /*#__PURE__*/regeneratorRuntime.mark(function buildTree() {
      var rootNode;
      return regeneratorRuntime.wrap(function buildTree$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(this.handleExprJson(this.tokens), "t0", 1);

            case 1:
              rootNode = _context.t0;
              return _context.abrupt("return", rootNode);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, buildTree, this);
    })
  }, {
    key: "handleExprJson",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprJson(tokens) {
      var node, firstToken, arrayExpr, objectExpr;
      return regeneratorRuntime.wrap(function handleExprJson$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(0, _yielder.yielder)()) {
                _context2.next = 3;
                break;
              }

              _context2.next = 3;
              return;

            case 3:
              node = new ASTNode(tokens, _expression.ExprType.Json);
              firstToken = tokens[0];

              if (!(firstToken.type === _token.TokenType.LeftBracket)) {
                _context2.next = 11;
                break;
              }

              return _context2.delegateYield(this.handleExprArray(tokens), "t0", 7);

            case 7:
              arrayExpr = _context2.t0;
              node.addChild(arrayExpr);
              _context2.next = 18;
              break;

            case 11:
              if (!(firstToken.type === _token.TokenType.LeftBrace)) {
                _context2.next = 17;
                break;
              }

              return _context2.delegateYield(this.handleExprObject(tokens), "t1", 13);

            case 13:
              objectExpr = _context2.t1;
              node.addChild(objectExpr);
              _context2.next = 18;
              break;

            case 17:
              throw new Error("[json expression error] unexpected token ".concat(firstToken.text));

            case 18:
              return _context2.abrupt("return", node);

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, handleExprJson, this);
    })
  }, {
    key: "handleExprArray",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprArray(tokens) {
      var firstToken, lastToken, node, index, valueTokens, vfStack, expectComma, token, _valueExpr, flag, _flag, valueExpr;

      return regeneratorRuntime.wrap(function handleExprArray$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              firstToken = tokens[0];
              lastToken = tokens[tokens.length - 1]; // empty array

              if (!(tokens.length === 2 && tokens[0].type === _token.TokenType.LeftBracket && tokens[1].type === _token.TokenType.RightBracket)) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return", new ASTNode(tokens, _expression.ExprType.Array));

            case 4:
              node = new ASTNode(tokens, _expression.ExprType.Array);
              index = 1;
              valueTokens = [];
              vfStack = [];
              expectComma = true;

            case 9:
              if (!(index < tokens.length - 1)) {
                _context3.next = 32;
                break;
              }

              if (!(0, _yielder.yielder)()) {
                _context3.next = 13;
                break;
              }

              _context3.next = 13;
              return;

            case 13:
              token = tokens[index];

              if (!(token.type === _token.TokenType.Comma && expectComma && isValueFinish(vfStack))) {
                _context3.next = 26;
                break;
              }

              if (!(valueTokens.length === 1)) {
                _context3.next = 19;
                break;
              }

              _context3.t0 = this.handleExprValueDirect(valueTokens);
              _context3.next = 21;
              break;

            case 19:
              return _context3.delegateYield(this.handleExprValue(valueTokens), "t1", 20);

            case 20:
              _context3.t0 = _context3.t1;

            case 21:
              _valueExpr = _context3.t0;
              valueTokens = [];
              node.addChild(_valueExpr);
              _context3.next = 29;
              break;

            case 26:
              if (token.type === _token.TokenType.RightBrace || token.type === _token.TokenType.RightBracket) {
                flag = token.type;
                vfStack.push(flag);
              } else if (token.type === _token.TokenType.LeftBrace || token.type === _token.TokenType.LeftBracket) {
                _flag = token.type;
                vfStack.push(_flag);
                expectComma = false;
              }

              valueTokens.push(token);

              if (isValueFinish(vfStack)) {
                expectComma = true;
                vfStack = [];
              }

            case 29:
              index++;
              _context3.next = 9;
              break;

            case 32:
              if (!(valueTokens.length === 1)) {
                _context3.next = 36;
                break;
              }

              _context3.t2 = this.handleExprValueDirect(valueTokens);
              _context3.next = 38;
              break;

            case 36:
              return _context3.delegateYield(this.handleExprValue(valueTokens), "t3", 37);

            case 37:
              _context3.t2 = _context3.t3;

            case 38:
              valueExpr = _context3.t2;
              node.addChild(valueExpr);
              return _context3.abrupt("return", node);

            case 41:
            case "end":
              return _context3.stop();
          }
        }
      }, handleExprArray, this);
    })
  }, {
    key: "handleExprObject",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprObject(tokens) {
      var node, index, propExprNode, propTokens, valueTokens, vfStack, state, token, _valueExpr2, flag, valueExpr;

      return regeneratorRuntime.wrap(function handleExprObject$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(tokens.length === 2 && tokens[0].type === _token.TokenType.LeftBrace && tokens[1].type === _token.TokenType.RightBrace)) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt("return", new ASTNode(tokens, _expression.ExprType.Object));

            case 2:
              node = new ASTNode(tokens, _expression.ExprType.Object);
              index = 1;
              propTokens = [];
              valueTokens = [];
              vfStack = [];
              state = "prop";

            case 8:
              if (!(index < tokens.length - 1)) {
                _context4.next = 46;
                break;
              }

              if (!(0, _yielder.yielder)()) {
                _context4.next = 12;
                break;
              }

              _context4.next = 12;
              return;

            case 12:
              token = tokens[index];

              if (!(token.type === _token.TokenType.Colon && state === "prop")) {
                _context4.next = 20;
                break;
              }

              return _context4.delegateYield(this.handleExprProp(propTokens), "t0", 15);

            case 15:
              propExprNode = _context4.t0;
              propTokens = [];
              state = "value";
              _context4.next = 43;
              break;

            case 20:
              if (!(token.type === _token.TokenType.Comma && state === "prop" && isValueFinish(vfStack))) {
                _context4.next = 33;
                break;
              }

              if (!(valueTokens.length === 1)) {
                _context4.next = 25;
                break;
              }

              _context4.t1 = this.handleExprValueDirect(valueTokens);
              _context4.next = 27;
              break;

            case 25:
              return _context4.delegateYield(this.handleExprValue(valueTokens), "t2", 26);

            case 26:
              _context4.t1 = _context4.t2;

            case 27:
              _valueExpr2 = _context4.t1;
              valueTokens = [];
              propExprNode.addChild(_valueExpr2);
              node.addChild(propExprNode);
              _context4.next = 43;
              break;

            case 33:
              _context4.t3 = state;
              _context4.next = _context4.t3 === "prop" ? 36 : _context4.t3 === "value" ? 38 : 42;
              break;

            case 36:
              propTokens.push(token);
              return _context4.abrupt("break", 43);

            case 38:
              if (token.type === _token.TokenType.RightBracket || token.type === _token.TokenType.RightBrace || token.type === _token.TokenType.LeftBracket || token.type === _token.TokenType.LeftBrace) {
                flag = token.type;
                vfStack.push(flag);
              }

              valueTokens.push(token);

              if (isValueFinish(vfStack)) {
                state = "prop";
              }

              return _context4.abrupt("break", 43);

            case 42:
              throw new Error("[object expression error] unexpected state");

            case 43:
              index++;
              _context4.next = 8;
              break;

            case 46:
              if (!(valueTokens.length === 1)) {
                _context4.next = 50;
                break;
              }

              _context4.t4 = this.handleExprValueDirect(valueTokens);
              _context4.next = 52;
              break;

            case 50:
              return _context4.delegateYield(this.handleExprValue(valueTokens), "t5", 51);

            case 51:
              _context4.t4 = _context4.t5;

            case 52:
              valueExpr = _context4.t4;
              propExprNode.addChild(valueExpr);
              node.addChild(propExprNode);
              return _context4.abrupt("return", node);

            case 56:
            case "end":
              return _context4.stop();
          }
        }
      }, handleExprObject, this);
    })
  }, {
    key: "handleExprProp",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprProp(tokens) {
      var node, propName;
      return regeneratorRuntime.wrap(function handleExprProp$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(0, _yielder.yielder)()) {
                _context5.next = 3;
                break;
              }

              _context5.next = 3;
              return;

            case 3:
              node = new ASTNode(tokens, _expression.ExprType.Prop);
              propName = tokens[0].text;
              propName = propName.slice(1, propName.length - 1);
              node.propName = propName;
              return _context5.abrupt("return", node);

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, handleExprProp);
    })
  }, {
    key: "handleExprValueDirect",
    value: function handleExprValueDirect(tokens) {
      var node = new ASTNode(tokens, _expression.ExprType.Value);
      var tokenType = tokens[0].type;

      switch (tokenType) {
        case _token.TokenType.Null:
        case _token.TokenType.Boolean:
        case _token.TokenType.Number:
        case _token.TokenType.String:
          node.value = new ASTNode(tokens, tokenType);
          break;

        default:
          throw new Error("[value expression error] unknown single token type");
      }

      return node;
    }
  }, {
    key: "handleExprValue",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprValue(tokens) {
      var node;
      return regeneratorRuntime.wrap(function handleExprValue$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(0, _yielder.yielder)()) {
                _context6.next = 3;
                break;
              }

              _context6.next = 3;
              return;

            case 3:
              node = new ASTNode(tokens, _expression.ExprType.Value);
              return _context6.delegateYield(this.handleExprJson(tokens), "t0", 5);

            case 5:
              node.value = _context6.t0;
              return _context6.abrupt("return", node);

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, handleExprValue, this);
    })
  }]);

  return AST;
}();

exports.AST = AST;

function isValueFinish(stack) {
  var braceCount = 0;
  var bracketCount = 0;

  var _iterator = _createForOfIteratorHelper(stack),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var token = _step.value;

      switch (token) {
        case _token.TokenType.LeftBrace:
          braceCount++;
          break;

        case _token.TokenType.LeftBracket:
          bracketCount++;
          break;

        case _token.TokenType.RightBrace:
          braceCount--;
          break;

        case _token.TokenType.RightBracket:
          bracketCount--;
          break;

        default:
          break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return braceCount === 0 && bracketCount === 0;
}