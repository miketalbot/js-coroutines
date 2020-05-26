/**
 * Copyright (c) 2020 5u9ar (zhuyingda) (c) 2020 Mike Talbot (Generator mods)
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { TokenType } from "./token";
import { yielder } from "./yielder";
const SINGLE_CHAR_TOKEN_LIST = ["[", "]", "{", "}", ":", ","];
const INVISIBLE_CHAR_CODE_TOKEN_LIST = [10, 13, 32];

const STATE_INIT = "init";
const STATE_KW_NULL = "null";
const STATE_KW_TRUE = "boolean_true";
const STATE_KW_FALSE = "boolean_false";
const STATE_NUMBER = "number";
const STATE_STRING = "string";
const STATE_STRING_ESCAPE = "escape";

const INITIAL_STATE = {
  "[": TokenType.LeftBracket,
  "]": TokenType.RightBracket,
  "{": TokenType.LeftBrace,
  "}": TokenType.RightBrace,
  ":": TokenType.Colon,
  ",": TokenType.Comma,
};

const MOVE_TO = {
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
  '"': STATE_STRING,
};

export class Tokenizer {
  constructor() {
    this.state = STATE_INIT;
    this.pos = 0;
    this.sourceCode = "";
    this.tokens = [];
    this.curToken = "";
  }

  *tokenize(src) {
    this.sourceCode = src;
    const length = src.length;
    while (this.pos < length) {
      if (yielder()) yield;
      let text = this.read();
      let state = this.state;
      switch (state) {
        case STATE_INIT:
          this.initToken(text);
          break;
        case STATE_KW_NULL:
          this.handleTokenNull(text);
          break;
        case STATE_KW_TRUE:
          this.handleTokenTrue(text);
          break;
        case STATE_KW_FALSE:
          this.handleTokenFalse(text);
          break;
        case STATE_NUMBER:
          this.handleTokenNumber(text);
          break;
        case STATE_STRING:
          this.handleTokenString(text);
          break;
        case STATE_STRING_ESCAPE:
          this.handleTokenStringEscape(text);
          break;
        default:
          throw new Error(
            `finite state machine get an unexpected state: ${this.state}`
          );
      }
    }
    return this.tokens;
  }

  read() {
    return this.sourceCode[this.pos++];
  }

  peek() {
    return this.sourceCode[this.pos];
  }

  initToken(text) {
    if (SINGLE_CHAR_TOKEN_LIST.includes(text)) {
      let token = { text, type: INITIAL_STATE[text] };
      this.tokens.push(token);
    } else if (!INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(text.charCodeAt(0))) {
      throw new Error(`state INIT, unexpected token ${text}`);
    }
    let nextCh = this.peek();
    if (nextCh === undefined) {
      return;
    }
    this.state = MOVE_TO[nextCh];
    if (!this.state) {
      throw new Error("Unexpected character in JSON");
    }
  }

  handleTokenNull(ch) {
    switch (ch) {
      case "n":
      case "u":
        this.curToken += ch;
        break;
      case "l":
        this.curToken += ch;
        if (this.curToken === "null") {
          let token = { text: this.curToken, type: TokenType.Null };
          this.tokens.push(token);
          this.curToken = "";
          this.state = STATE_INIT;
        } else if (this.curToken === "nul") {
        } else {
          throw new Error(`state NULL, unexpected token ${ch}`);
        }
        break;
      default:
        throw new Error(`state NULL, unexpected token ${ch}`);
    }
  }

  handleTokenTrue(ch) {
    switch (ch) {
      case "t":
      case "r":
      case "u":
        this.curToken += ch;
        break;
      case "e":
        if (this.curToken !== "tru") {
          throw new Error(`state TRUE, unexpected token ${ch}`);
        }
        this.curToken += ch;
        let token = { text: this.curToken, type: TokenType.Boolean };
        this.tokens.push(token);
        this.curToken = "";
        this.state = STATE_INIT;
        break;
      default:
        throw new Error(`state TRUE, unexpected token ${ch}`);
    }
  }

  handleTokenFalse(ch) {
    switch (ch) {
      case "f":
      case "a":
      case "l":
      case "s":
        this.curToken += ch;
        break;
      case "e":
        this.curToken += ch;
        let token = { text: this.curToken, type: TokenType.Boolean };
        this.tokens.push(token);
        this.curToken = "";
        this.state = STATE_INIT;
        break;
      default:
        throw new Error(`state FALSE, unexpected token ${ch}`);
    }
  }

  handleTokenNumber(ch) {
    let nextCh;
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
        if (!/[0-9]|\.|-/.test(nextCh)) {
          let token = { text: this.curToken, type: TokenType.Number };
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
        throw new Error(`state NUMBER, unexpected token ${ch}`);
    }
  }

  handleTokenStringEscape(ch) {
    if (ch === "u") {
      this.curToken += JSON.parse(
        `"\\u${this.read()}${this.read()}${this.read()}${this.read()}"`
      );
      this.state = STATE_STRING;
      return;
    }
    this.curToken += JSON.parse(`"\\${ch}"`);
    this.state = STATE_STRING;
  }

  handleTokenString(ch) {
    switch (ch) {
      case "\\":
        this.state = STATE_STRING_ESCAPE;
        break;
      case '"':
        if (this.curToken === "") {
          this.curToken = ch;
        } else {
          this.curToken += ch;
          let token = { text: this.curToken, type: TokenType.String };
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
}
