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

var util = {
  mapValue: function mapValue(obj) {
    var out = [];

    for (var key in obj) {
      out.push(obj[key]);
    }

    return out;
  }
};
var terminalSignals = util.mapValue(_token.TokenType);
var nonTerminalSignals = util.mapValue(_expression.ExprType);

var ASTNode = /*#__PURE__*/function () {
  function ASTNode(tokens, type, parentNode) {
    _classCallCheck(this, ASTNode);

    this.type = type;
    this.parentNode = parentNode;

    if (terminalSignals.includes(this.type)) {
      this.isTerm = true;
      this.tokens = tokens;
    } else if (nonTerminalSignals.includes(this.type)) {
      this.isTerm = false;
    }

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
              return _context.delegateYield(this.handleExprJson(this.tokens, null), "t0", 1);

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
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprJson(tokens, parent) {
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
              node = new ASTNode(tokens, _expression.ExprType.Json, parent);
              firstToken = tokens[0];

              if (!(firstToken.type === _token.TokenType.LeftBracket)) {
                _context2.next = 11;
                break;
              }

              return _context2.delegateYield(this.handleExprArray(tokens, node), "t0", 7);

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

              return _context2.delegateYield(this.handleExprObject(tokens, node), "t1", 13);

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
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprArray(tokens, parent) {
      var firstToken, lastToken, node, index, valueTokens, vfStack, expectComma, token, _valueExpr, flag, _flag, valueExpr;

      return regeneratorRuntime.wrap(function handleExprArray$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              firstToken = tokens[0];
              lastToken = tokens[tokens.length - 1];

              if (!(firstToken.type !== _token.TokenType.LeftBracket || lastToken.type !== _token.TokenType.RightBracket)) {
                _context3.next = 4;
                break;
              }

              throw new Error("[array expression error] wrong bracket token");

            case 4:
              if (!(tokens.length === 2 && tokens[0].type === _token.TokenType.LeftBracket && tokens[1].type === _token.TokenType.RightBracket)) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt("return", new ASTNode(tokens, _expression.ExprType.Array, parent));

            case 6:
              node = new ASTNode(tokens, _expression.ExprType.Array, parent);
              index = 1;
              valueTokens = [];
              vfStack = [];
              expectComma = true;

            case 11:
              if (!(index < tokens.length - 1)) {
                _context3.next = 34;
                break;
              }

              if (!(0, _yielder.yielder)()) {
                _context3.next = 15;
                break;
              }

              _context3.next = 15;
              return;

            case 15:
              token = tokens[index];

              if (!(token.type === _token.TokenType.Comma && expectComma && isValueFinish(vfStack))) {
                _context3.next = 28;
                break;
              }

              if (!(valueTokens.length === 1)) {
                _context3.next = 21;
                break;
              }

              _context3.t0 = this.handleExprValueDirect(valueTokens, node);
              _context3.next = 23;
              break;

            case 21:
              return _context3.delegateYield(this.handleExprValue(valueTokens, node), "t1", 22);

            case 22:
              _context3.t0 = _context3.t1;

            case 23:
              _valueExpr = _context3.t0;
              valueTokens = [];
              node.addChild(_valueExpr);
              _context3.next = 31;
              break;

            case 28:
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

            case 31:
              index++;
              _context3.next = 11;
              break;

            case 34:
              if (!(valueTokens.length === 1)) {
                _context3.next = 38;
                break;
              }

              _context3.t2 = this.handleExprValueDirect(valueTokens, node);
              _context3.next = 40;
              break;

            case 38:
              return _context3.delegateYield(this.handleExprValue(valueTokens, node), "t3", 39);

            case 39:
              _context3.t2 = _context3.t3;

            case 40:
              valueExpr = _context3.t2;
              node.addChild(valueExpr);
              return _context3.abrupt("return", node);

            case 43:
            case "end":
              return _context3.stop();
          }
        }
      }, handleExprArray, this);
    })
  }, {
    key: "handleExprObject",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprObject(tokens, parent) {
      var firstToken, lastToken, node, index, propExprNode, propTokens, valueTokens, vfStack, state, token, _valueExpr2, flag, valueExpr;

      return regeneratorRuntime.wrap(function handleExprObject$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              firstToken = tokens[0];
              lastToken = tokens[tokens.length - 1];

              if (!(firstToken.type !== _token.TokenType.LeftBrace || lastToken.type !== _token.TokenType.RightBrace)) {
                _context4.next = 4;
                break;
              }

              throw new Error("[object expression error] wrong brace token");

            case 4:
              if (!(tokens.length === 2 && tokens[0].type === _token.TokenType.LeftBrace && tokens[1].type === _token.TokenType.RightBrace)) {
                _context4.next = 6;
                break;
              }

              return _context4.abrupt("return", new ASTNode(tokens, _expression.ExprType.Object, parent));

            case 6:
              node = new ASTNode(tokens, _expression.ExprType.Object, parent);
              index = 1;
              propTokens = [];
              valueTokens = [];
              vfStack = [];
              state = "prop";

            case 12:
              if (!(index < tokens.length - 1)) {
                _context4.next = 52;
                break;
              }

              if (!(0, _yielder.yielder)()) {
                _context4.next = 16;
                break;
              }

              _context4.next = 16;
              return;

            case 16:
              token = tokens[index];

              if (!(token.type === _token.TokenType.Colon && state === "prop")) {
                _context4.next = 24;
                break;
              }

              return _context4.delegateYield(this.handleExprProp(propTokens, node), "t0", 19);

            case 19:
              propExprNode = _context4.t0;
              propTokens = [];
              state = "value";
              _context4.next = 49;
              break;

            case 24:
              if (!(token.type === _token.TokenType.Comma && state === "prop" && isValueFinish(vfStack))) {
                _context4.next = 37;
                break;
              }

              if (!(valueTokens.length === 1)) {
                _context4.next = 29;
                break;
              }

              _context4.t1 = this.handleExprValueDirect(valueTokens, node);
              _context4.next = 31;
              break;

            case 29:
              return _context4.delegateYield(this.handleExprValue(valueTokens, node), "t2", 30);

            case 30:
              _context4.t1 = _context4.t2;

            case 31:
              _valueExpr2 = _context4.t1;
              valueTokens = [];
              propExprNode.addChild(_valueExpr2);
              node.addChild(propExprNode);
              _context4.next = 49;
              break;

            case 37:
              _context4.t3 = state;
              _context4.next = _context4.t3 === "prop" ? 40 : _context4.t3 === "value" ? 44 : 48;
              break;

            case 40:
              if (!(propTokens.length !== 0)) {
                _context4.next = 42;
                break;
              }

              throw new Error("[object expression error] prop state got unexpected token");

            case 42:
              propTokens.push(token);
              return _context4.abrupt("break", 49);

            case 44:
              if (token.type === _token.TokenType.RightBracket || token.type === _token.TokenType.RightBrace || token.type === _token.TokenType.LeftBracket || token.type === _token.TokenType.LeftBrace) {
                flag = token.type;
                vfStack.push(flag);
              }

              valueTokens.push(token);

              if (isValueFinish(vfStack)) {
                state = "prop";
              }

              return _context4.abrupt("break", 49);

            case 48:
              throw new Error("[object expression error] unexpected state");

            case 49:
              index++;
              _context4.next = 12;
              break;

            case 52:
              if (!(valueTokens.length === 1)) {
                _context4.next = 56;
                break;
              }

              _context4.t4 = this.handleExprValueDirect(valueTokens, node);
              _context4.next = 58;
              break;

            case 56:
              return _context4.delegateYield(this.handleExprValue(valueTokens, node), "t5", 57);

            case 57:
              _context4.t4 = _context4.t5;

            case 58:
              valueExpr = _context4.t4;
              propExprNode.addChild(valueExpr);
              node.addChild(propExprNode);
              return _context4.abrupt("return", node);

            case 62:
            case "end":
              return _context4.stop();
          }
        }
      }, handleExprObject, this);
    })
  }, {
    key: "handleExprProp",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprProp(tokens, parent) {
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
              if (!(tokens.length !== 1 || tokens[0].type !== _token.TokenType.String)) {
                _context5.next = 5;
                break;
              }

              throw new Error("[prop expression error] invalid tokens input");

            case 5:
              node = new ASTNode(tokens, _expression.ExprType.Prop, parent);
              propName = tokens[0].text;
              propName = propName.slice(1, propName.length - 1);
              node.propName = propName;
              return _context5.abrupt("return", node);

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, handleExprProp);
    })
  }, {
    key: "handleExprValueDirect",
    value: function handleExprValueDirect(tokens, parent) {
      var node = new ASTNode(tokens, _expression.ExprType.Value, parent);
      var tokenType = tokens[0].type;

      switch (tokenType) {
        case _token.TokenType.Null:
        case _token.TokenType.Boolean:
        case _token.TokenType.Number:
        case _token.TokenType.String:
          node.value = new ASTNode(tokens, tokenType, node);
          break;

        default:
          throw new Error("[value expression error] unknown single token type");
      }

      return node;
    }
  }, {
    key: "handleExprValue",
    value: /*#__PURE__*/regeneratorRuntime.mark(function handleExprValue(tokens, parent) {
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
              if (!(tokens.length === 0)) {
                _context6.next = 5;
                break;
              }

              throw new Error("[value expression error] empty value expr");

            case 5:
              if (!(tokens[0].type !== _token.TokenType.LeftBracket && tokens[0].type !== _token.TokenType.LeftBrace)) {
                _context6.next = 7;
                break;
              }

              throw new Error("[value expression error] invalid tokens input");

            case 7:
              node = new ASTNode(tokens, _expression.ExprType.Value, parent);
              return _context6.delegateYield(this.handleExprJson(tokens, _expression.ExprType.json, node), "t0", 9);

            case 9:
              node.value = _context6.t0;
              return _context6.abrupt("return", node);

            case 11:
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

  if (braceCount === 0 && bracketCount === 0) {
    return true;
  } else if (braceCount < 0) {
    throw new Error("[isValueFinish] got unexpected token brace '}'");
  } else if (bracketCount < 0) {
    throw new Error("[isValueFinish] got unexpected token bracket ']'");
  } else {
    return false;
  }
}