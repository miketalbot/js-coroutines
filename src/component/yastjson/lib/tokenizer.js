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

    while (this.shouldContinue()) {
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
        default:
          throw new Error(
            `finite state machine get an unexpected state: ${this.state}`
          );
      }
    }
    return this.tokens;
  }

  shouldContinue() {
    return this.pos < this.sourceCode.length;
  }

  read() {
    const ch = this.sourceCode[this.pos];
    this.pos++;
    return ch;
  }

  peek() {
    return this.sourceCode[this.pos];
  }

  initToken(text) {
    if (SINGLE_CHAR_TOKEN_LIST.includes(text)) {
      let token;
      switch (text) {
        case "[":
          token = { text, type: TokenType.LeftBracket };
          break;
        case "]":
          token = { text, type: TokenType.RightBracket };
          break;
        case "{":
          token = { text, type: TokenType.LeftBrace };
          break;
        case "}":
          token = { text, type: TokenType.RightBrace };
          break;
        case ":":
          token = { text, type: TokenType.Colon };
          break;
        default:
          token = { text, type: TokenType.Comma };
          break;
      }
      this.tokens.push(token);
    } else if (!INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(text.charCodeAt(0))) {
      throw new Error(`state INIT, unexpected token ${text}`);
    }
    let nextCh = this.peek();
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
          throw new Error(`state INIT, unexpected token ${nextCh}`);
        }
        break;
    }
  }

  handleTokenNull(ch) {
    switch (ch) {
      case "n":
        if (this.curToken !== "") {
          throw new Error(`state NULL, unexpected token ${ch}`);
        }
        this.curToken = ch;
        this.state = STATE_KW_NULL;
        break;
      case "u":
        if (this.curToken !== "n") {
          throw new Error(`state NULL, unexpected token ${ch}`);
        }
        this.curToken += ch;
        this.state = STATE_KW_NULL;
        break;
      case "l":
        this.curToken += ch;
        if (this.curToken === "null") {
          let token = { text: this.curToken, type: TokenType.Null };
          this.tokens.push(token);
          this.curToken = "";
          this.state = STATE_INIT;
        } else if (this.curToken === "nul") {
          this.state = STATE_KW_NULL;
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
        if (this.curToken !== "") {
          throw new Error(`state TRUE, unexpected token ${ch}`);
        }
        this.curToken = ch;
        this.state = STATE_KW_TRUE;
        break;
      case "r":
        if (this.curToken !== "t") {
          throw new Error(`state TRUE, unexpected token ${ch}`);
        }
        this.curToken += ch;
        this.state = STATE_KW_TRUE;
        break;
      case "u":
        if (this.curToken !== "tr") {
          throw new Error(`state TRUE, unexpected token ${ch}`);
        }
        this.curToken += ch;
        this.state = STATE_KW_TRUE;
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
        if (/[0-9]|\.|-/.test(nextCh)) {
          this.state = STATE_NUMBER;
        } else {
          let token = { text: this.curToken, type: TokenType.Number };
          this.tokens.push(token);
          this.curToken = "";
          this.state = STATE_INIT;
        }
        break;
      case "-":
        if (!this.curToken === "") {
          throw new Error(`state NUMBER, unexpected token ${ch}`);
        }
        this.curToken += ch;
        nextCh = this.peek();
        if (/[0-9]/.test(nextCh)) {
          this.state = STATE_NUMBER;
        } else {
          throw new Error(`state NUMBER, unexpected token ${ch}`);
        }
        break;
      case ".":
        if (
          this.curToken === "" ||
          !/[0-9]/.test(this.curToken[this.curToken.length - 1])
        ) {
          throw new Error(`state NUMBER, unexpected token ${ch}`);
        }
        this.curToken += ch;
        nextCh = this.peek();
        if (/[0-9]/.test(nextCh)) {
          this.state = STATE_NUMBER;
        } else {
          throw new Error(`state NUMBER, unexpected token ${ch}`);
        }
        break;
      default:
        throw new Error(`state NUMBER, unexpected token ${ch}`);
    }
  }

  handleTokenString(ch) {
    switch (ch) {
      case '"':
        if (this.curToken === "") {
          this.curToken = ch;
          this.state = STATE_STRING;
        } else {
          this.curToken += ch;
          if (this.curToken[this.curToken.length - 2] === "\\") {
            let pos = this.curToken.length - 3;
            let slashCount = 1;
            while (this.curToken[pos] === "\\") {
              slashCount++;
              pos++;
            }
            if (slashCount % 2 === 1) {
              this.state = STATE_STRING;
              break;
            }
          }
          let token = { text: this.curToken, type: TokenType.String };
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
          throw new Error(`state STRING, unexpected token ${ch}`);
        }
        break;
    }
  }
}
