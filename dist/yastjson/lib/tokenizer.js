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

var INVISIBLE_CHAR_CODE_TOKEN_LIST = [10, 13, 32];
var STATE_INIT = "init";
var STATE_KW_NULL = "null";
var STATE_KW_TRUE = "boolean_true";
var STATE_KW_FALSE = "boolean_false";
var STATE_NUMBER = "number";
var STATE_STRING = "string";
var STATE_STRING_ESCAPE = "escape";
var INITIAL_STATE = {
  "[": _token.TokenType.LeftBracket,
  "]": _token.TokenType.RightBracket,
  "{": _token.TokenType.LeftBrace,
  "}": _token.TokenType.RightBrace,
  ":": _token.TokenType.Colon,
  ",": _token.TokenType.Comma
};
var MOVE_TO = {
  "[": STATE_INIT,
  "]": STATE_INIT,
  "{": STATE_INIT,
  "}": STATE_INIT,
  ":": STATE_INIT,
  ",": STATE_INIT,
  n: STATE_KW_NULL,
  t: STATE_KW_TRUE,
  f: STATE_KW_FALSE,
  "0": STATE_NUMBER,
  "1": STATE_NUMBER,
  "2": STATE_NUMBER,
  "3": STATE_NUMBER,
  "4": STATE_NUMBER,
  "5": STATE_NUMBER,
  "6": STATE_NUMBER,
  "7": STATE_NUMBER,
  "8": STATE_NUMBER,
  "9": STATE_NUMBER,
  "-": STATE_NUMBER,
  '"': STATE_STRING
};

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
      var length, text;
      return regeneratorRuntime.wrap(function tokenize$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.sourceCode = src;
              length = src.length;

            case 2:
              if (!(this.pos < length)) {
                _context.next = 27;
                break;
              }

              if (!((this.pos & 7) === 0 && (0, _yielder.yielder)())) {
                _context.next = 6;
                break;
              }

              _context.next = 6;
              return;

            case 6:
              text = this.read();
              _context.t0 = this.state;
              _context.next = _context.t0 === STATE_INIT ? 10 : _context.t0 === STATE_KW_NULL ? 12 : _context.t0 === STATE_KW_TRUE ? 14 : _context.t0 === STATE_KW_FALSE ? 16 : _context.t0 === STATE_NUMBER ? 18 : _context.t0 === STATE_STRING ? 20 : _context.t0 === STATE_STRING_ESCAPE ? 22 : 24;
              break;

            case 10:
              this.initToken(text);
              return _context.abrupt("break", 25);

            case 12:
              this.handleTokenNull(text);
              return _context.abrupt("break", 25);

            case 14:
              this.handleTokenTrue(text);
              return _context.abrupt("break", 25);

            case 16:
              this.handleTokenFalse(text);
              return _context.abrupt("break", 25);

            case 18:
              this.handleTokenNumber(text);
              return _context.abrupt("break", 25);

            case 20:
              this.handleTokenString(text);
              return _context.abrupt("break", 25);

            case 22:
              this.handleTokenStringEscape(text);
              return _context.abrupt("break", 25);

            case 24:
              throw new Error("finite state machine get an unexpected state: ".concat(this.state));

            case 25:
              _context.next = 2;
              break;

            case 27:
              return _context.abrupt("return", this.tokens);

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, tokenize, this);
    })
  }, {
    key: "read",
    value: function read() {
      return this.sourceCode[this.pos++];
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.sourceCode[this.pos];
    }
  }, {
    key: "initToken",
    value: function initToken(ch) {
      var type = INITIAL_STATE[ch];

      if (!type && !INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(ch.charCodeAt(0))) {
        throw new Error("state INIT, unexpected token ".concat(ch));
      }

      this.tokens.push({
        text: ch,
        type: type
      });
      var nextCh = this.peek();

      if (nextCh === undefined) {
        return;
      }

      this.state = MOVE_TO[nextCh];

      if (!this.state) {
        throw new Error("Unexpected character in JSON");
      }
    }
  }, {
    key: "handleTokenNull",
    value: function handleTokenNull(ch) {
      switch (ch) {
        case "n":
        case "u":
          this.curToken += ch;
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
          } else if (this.curToken === "nul") {} else {
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
        case "r":
        case "u":
          this.curToken += ch;
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
        case "a":
        case "l":
        case "s":
          this.curToken += ch;
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

          if (!/[0-9]|\.|-/.test(this.peek())) {
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
        case ".":
          this.curToken += ch;
          break;

        default:
          throw new Error("state NUMBER, unexpected token ".concat(ch));
      }
    }
  }, {
    key: "handleTokenStringEscape",
    value: function handleTokenStringEscape(ch) {
      if (ch === "u") {
        this.curToken += JSON.parse("\"\\u".concat(this.read()).concat(this.read()).concat(this.read()).concat(this.read(), "\""));
        this.state = STATE_STRING;
        return;
      }

      this.curToken += JSON.parse("\"\\".concat(ch, "\""));
      this.state = STATE_STRING;
    }
  }, {
    key: "handleTokenString",
    value: function handleTokenString(ch) {
      switch (ch) {
        case "\\":
          this.state = STATE_STRING_ESCAPE;
          break;

        case '"':
          if (this.curToken === "") {
            this.curToken = ch;
          } else {
            this.curToken += ch;
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
          this.curToken += ch;
          break;
      }
    }
  }]);

  return Tokenizer;
}();

exports.Tokenizer = Tokenizer;