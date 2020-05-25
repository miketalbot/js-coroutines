"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tokenizer = void 0;

var _token = require("./token");

var _yielder = require("./yielder");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SINGLE_CHAR_TOKEN_LIST = ["[", "]", "{", "}", ":", ","];
var INVISIBLE_CHAR_CODE_TOKEN_LIST = [10, 13, 32];
var STATE_INIT = "init";
var STATE_KW_NULL = "null";
var STATE_KW_TRUE = "boolean_true";
var STATE_KW_FALSE = "boolean_false";
var STATE_NUMBER = "number";
var STATE_STRING = "string";

var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer() {
    _classCallCheck(this, Tokenizer);

    this.state = STATE_INIT;
    this.pos = 0;
    this.sourceCode = "";
    this.tokens = [];
    this.curToken = "";
  }

  _createClass(Tokenizer, [{
    key: "tokenize",
    value: /*#__PURE__*/regeneratorRuntime.mark(function tokenize(src) {
      var text, state;
      return regeneratorRuntime.wrap(function tokenize$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.sourceCode = src;

            case 1:
              if (!this.shouldContinue()) {
                _context.next = 25;
                break;
              }

              if (!(0, _yielder.yielder)()) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return;

            case 5:
              text = this.read();
              state = this.state;
              _context.t0 = state;
              _context.next = _context.t0 === STATE_INIT ? 10 : _context.t0 === STATE_KW_NULL ? 12 : _context.t0 === STATE_KW_TRUE ? 14 : _context.t0 === STATE_KW_FALSE ? 16 : _context.t0 === STATE_NUMBER ? 18 : _context.t0 === STATE_STRING ? 20 : 22;
              break;

            case 10:
              this.initToken(text);
              return _context.abrupt("break", 23);

            case 12:
              this.handleTokenNull(text);
              return _context.abrupt("break", 23);

            case 14:
              this.handleTokenTrue(text);
              return _context.abrupt("break", 23);

            case 16:
              this.handleTokenFalse(text);
              return _context.abrupt("break", 23);

            case 18:
              this.handleTokenNumber(text);
              return _context.abrupt("break", 23);

            case 20:
              this.handleTokenString(text);
              return _context.abrupt("break", 23);

            case 22:
              throw new Error("finite state machine get an unexpected state: ".concat(this.state));

            case 23:
              _context.next = 1;
              break;

            case 25:
              return _context.abrupt("return", this.tokens);

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, tokenize, this);
    })
  }, {
    key: "shouldContinue",
    value: function shouldContinue() {
      return this.pos < this.sourceCode.length;
    }
  }, {
    key: "read",
    value: function read() {
      var ch = this.sourceCode[this.pos];
      this.pos++;
      return ch;
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.sourceCode[this.pos];
    }
  }, {
    key: "initToken",
    value: function initToken(text) {
      if (SINGLE_CHAR_TOKEN_LIST.includes(text)) {
        var token;

        switch (text) {
          case "[":
            token = {
              text: text,
              type: _token.TokenType.LeftBracket
            };
            break;

          case "]":
            token = {
              text: text,
              type: _token.TokenType.RightBracket
            };
            break;

          case "{":
            token = {
              text: text,
              type: _token.TokenType.LeftBrace
            };
            break;

          case "}":
            token = {
              text: text,
              type: _token.TokenType.RightBrace
            };
            break;

          case ":":
            token = {
              text: text,
              type: _token.TokenType.Colon
            };
            break;

          default:
            token = {
              text: text,
              type: _token.TokenType.Comma
            };
            break;
        }

        this.tokens.push(token);
      } else if (!INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(text.charCodeAt(0))) {
        throw new Error("state INIT, unexpected token ".concat(text));
      }

      var nextCh = this.peek();

      if (nextCh === undefined) {
        return;
      }

      switch (nextCh) {
        case "[":
        case "]":
        case "{":
        case "}":
        case ":":
        case ",":
          this.state = STATE_INIT;
          break;

        case "n":
          this.state = STATE_KW_NULL;
          break;

        case "t":
          this.state = STATE_KW_TRUE;
          break;

        case "f":
          this.state = STATE_KW_FALSE;
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "-":
          this.state = STATE_NUMBER;
          break;

        case '"':
          this.state = STATE_STRING;
          break;

        default:
          if (!INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(nextCh.charCodeAt(0))) {
            throw new Error("state INIT, unexpected token ".concat(nextCh));
          }

          break;
      }
    }
  }, {
    key: "handleTokenNull",
    value: function handleTokenNull(ch) {
      switch (ch) {
        case "n":
          if (this.curToken !== "") {
            throw new Error("state NULL, unexpected token ".concat(ch));
          }

          this.curToken = ch;
          this.state = STATE_KW_NULL;
          break;

        case "u":
          if (this.curToken !== "n") {
            throw new Error("state NULL, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          this.state = STATE_KW_NULL;
          break;

        case "l":
          this.curToken += ch;

          if (this.curToken === "null") {
            var token = {
              text: this.curToken,
              type: _token.TokenType.Null
            };
            this.tokens.push(token);
            this.curToken = "";
            this.state = STATE_INIT;
          } else if (this.curToken === "nul") {
            this.state = STATE_KW_NULL;
          } else {
            throw new Error("state NULL, unexpected token ".concat(ch));
          }

          break;

        default:
          throw new Error("state NULL, unexpected token ".concat(ch));
      }
    }
  }, {
    key: "handleTokenTrue",
    value: function handleTokenTrue(ch) {
      switch (ch) {
        case "t":
          if (this.curToken !== "") {
            throw new Error("state TRUE, unexpected token ".concat(ch));
          }

          this.curToken = ch;
          this.state = STATE_KW_TRUE;
          break;

        case "r":
          if (this.curToken !== "t") {
            throw new Error("state TRUE, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          this.state = STATE_KW_TRUE;
          break;

        case "u":
          if (this.curToken !== "tr") {
            throw new Error("state TRUE, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          this.state = STATE_KW_TRUE;
          break;

        case "e":
          if (this.curToken !== "tru") {
            throw new Error("state TRUE, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          var token = {
            text: this.curToken,
            type: _token.TokenType.Boolean
          };
          this.tokens.push(token);
          this.curToken = "";
          this.state = STATE_INIT;
          break;

        default:
          throw new Error("state TRUE, unexpected token ".concat(ch));
      }
    }
  }, {
    key: "handleTokenFalse",
    value: function handleTokenFalse(ch) {
      switch (ch) {
        case "f":
          this.curToken = ch;
          this.state = STATE_KW_FALSE;
          break;

        case "a":
          this.curToken += ch;
          this.state = STATE_KW_FALSE;
          break;

        case "l":
          this.curToken += ch;
          this.state = STATE_KW_FALSE;
          break;

        case "s":
          this.curToken += ch;
          this.state = STATE_KW_FALSE;
          break;

        case "e":
          this.curToken += ch;
          var token = {
            text: this.curToken,
            type: _token.TokenType.Boolean
          };
          this.tokens.push(token);
          this.curToken = "";
          this.state = STATE_INIT;
          break;

        default:
          throw new Error("state FALSE, unexpected token ".concat(ch));
      }
    }
  }, {
    key: "handleTokenNumber",
    value: function handleTokenNumber(ch) {
      var nextCh;

      switch (ch) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.curToken += ch;
          nextCh = this.peek();

          if (/[0-9]|\.|-/.test(nextCh)) {
            this.state = STATE_NUMBER;
          } else {
            var token = {
              text: this.curToken,
              type: _token.TokenType.Number
            };
            this.tokens.push(token);
            this.curToken = "";
            this.state = STATE_INIT;
          }

          break;

        case "-":
          if (!this.curToken === "") {
            throw new Error("state NUMBER, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          nextCh = this.peek();

          if (/[0-9]/.test(nextCh)) {
            this.state = STATE_NUMBER;
          } else {
            throw new Error("state NUMBER, unexpected token ".concat(ch));
          }

          break;

        case ".":
          if (this.curToken === "" || !/[0-9]/.test(this.curToken[this.curToken.length - 1])) {
            throw new Error("state NUMBER, unexpected token ".concat(ch));
          }

          this.curToken += ch;
          nextCh = this.peek();

          if (/[0-9]/.test(nextCh)) {
            this.state = STATE_NUMBER;
          } else {
            throw new Error("state NUMBER, unexpected token ".concat(ch));
          }

          break;

        default:
          throw new Error("state NUMBER, unexpected token ".concat(ch));
      }
    }
  }, {
    key: "handleTokenString",
    value: function handleTokenString(ch) {
      switch (ch) {
        case '"':
          if (this.curToken === "") {
            this.curToken = ch;
            this.state = STATE_STRING;
          } else {
            this.curToken += ch;

            if (this.curToken[this.curToken.length - 2] === "\\") {
              var pos = this.curToken.length - 3;
              var slashCount = 1;

              while (this.curToken[pos] === "\\") {
                slashCount++;
                pos++;
              }

              if (slashCount % 2 === 1) {
                this.state = STATE_STRING;
                break;
              }
            }

            var token = {
              text: this.curToken,
              type: _token.TokenType.String
            };
            this.tokens.push(token);
            this.curToken = "";
            this.state = STATE_INIT;
          }

          break;

        default:
          try {
            this.curToken += ch;
            this.state = STATE_STRING;
          } catch (e) {
            throw new Error("state STRING, unexpected token ".concat(ch));
          }

          break;
      }
    }
  }]);

  return Tokenizer;
}();

exports.Tokenizer = Tokenizer;