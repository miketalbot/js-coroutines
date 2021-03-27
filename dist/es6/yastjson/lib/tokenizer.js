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
import {TokenType} from './token'
import {yielder} from './yielder'

const INVISIBLE_CHAR_CODE_TOKEN_LIST = [10, 13, 32]

const STATE_INIT = 'init'
const STATE_KW_NULL = 'null'
const STATE_KW_TRUE = 'boolean_true'
const STATE_KW_FALSE = 'boolean_false'
const STATE_NUMBER = 'number'
const STATE_STRING = 'string'
const STATE_STRING_ESCAPE = 'escape'

const INITIAL_STATE = {
    '[': TokenType.LeftBracket,
    ']': TokenType.RightBracket,
    '{': TokenType.LeftBrace,
    '}': TokenType.RightBrace,
    ':': TokenType.Colon,
    ',': TokenType.Comma,
}

const MOVE_TO = {
    '[': STATE_INIT,
    ']': STATE_INIT,
    '{': STATE_INIT,
    '}': STATE_INIT,
    ':': STATE_INIT,
    ',': STATE_INIT,
    n: STATE_KW_NULL,
    t: STATE_KW_TRUE,
    f: STATE_KW_FALSE,
    '0': STATE_NUMBER,
    '1': STATE_NUMBER,
    '2': STATE_NUMBER,
    '3': STATE_NUMBER,
    '4': STATE_NUMBER,
    '5': STATE_NUMBER,
    '6': STATE_NUMBER,
    '7': STATE_NUMBER,
    '8': STATE_NUMBER,
    '9': STATE_NUMBER,
    '-': STATE_NUMBER,
    '"': STATE_STRING,
}

export class Tokenizer {
    constructor() {
        this.state = STATE_INIT
        this.pos = 0
        this.sourceCode = ''
        this.tokens = []
        this.curToken = ''
    }

    * tokenizeArray(src) {
        this.sourceCode = src
        this.type = 'uint8'

        const length = src.length
        while (this.pos < length) {
            if ((this.pos & 15) === 0 && yielder()) yield
            let text = this.readCharacter()
            switch (this.state) {
                case STATE_INIT:
                    this.initToken(text)
                    break
                case STATE_KW_NULL:
                    this.handleTokenNull(text)
                    break
                case STATE_KW_TRUE:
                    this.handleTokenTrue(text)
                    break
                case STATE_KW_FALSE:
                    this.handleTokenFalse(text)
                    break
                case STATE_NUMBER:
                    this.handleTokenNumber(text)
                    break
                case STATE_STRING:
                    this.handleTokenString(text)
                    break
                case STATE_STRING_ESCAPE:
                    this.handleTokenStringEscape(text)
                    break
                default:
                    throw new Error(
                        `finite state machine get an unexpected state: ${this.state}`
                    )
            }
        }
        return this.tokens
    }

    * tokenize(src) {
        if (src instanceof Uint8Array) return yield* this.tokenizeArray(src)
        this.type = 'char'
        this.sourceCode = src
        const length = src.length
        while (this.pos < length) {
            if ((this.pos & 7) === 0 && yielder()) yield
            let text = this.read()
            switch (this.state) {
                case STATE_INIT:
                    this.initToken(text)
                    break
                case STATE_KW_NULL:
                    this.handleTokenNull(text)
                    break
                case STATE_KW_TRUE:
                    this.handleTokenTrue(text)
                    break
                case STATE_KW_FALSE:
                    this.handleTokenFalse(text)
                    break
                case STATE_NUMBER:
                    this.handleTokenNumber(text)
                    break
                case STATE_STRING:
                    this.handleTokenString(text)
                    break
                case STATE_STRING_ESCAPE:
                    this.handleTokenStringEscape(text)
                    break
                default:
                    throw new Error(
                        `finite state machine get an unexpected state: ${this.state}`
                    )
            }
        }
        return this.tokens
    }

    read() {
        let code
        do {
            code = this.sourceCode[this.pos++]
        } while(code && code.charCodeAt(0)<32)
        return code
    }

    readCharacter() {
        const c = this.sourceCode[this.pos++] /* ? */
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                return String.fromCharCode(c)
            case 12:
            case 13:
                return String.fromCharCode(((c & 0x1f) << 6) | (this.sourceCode[this.pos++] & 0x3f))
            case 14:
                return String.fromCharCode(((c & 0x0f) << 12) |
                    ((this.sourceCode[this.pos++] & 0x3f) << 6) | (this.sourceCode[this.pos++] & 0x3f))
            default:
                throw new Error("Bad encoding")
        }

    }


    peek() {
        let o = this.pos
        if(this.type === 'char') {
            while (this.sourceCode[o] && this.sourceCode[o].charCodeAt(0) < 32) {
                o++
            }
            return this.sourceCode[o]
        } else {
            let code = this.sourceCode
            let value = read()
            while (value.charCodeAt(0) < 32 && o < code.length) {
                value = read()
            }
            return value.charCodeAt(0) === 0 ? undefined : value
            function read() {
                const c = code[o++] /* ? */
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        return String.fromCharCode(c)
                    case 12:
                    case 13:
                        return String.fromCharCode(((c & 0x1f) << 6) | (code[o++] & 0x3f))
                    case 14:
                        return String.fromCharCode(((c & 0x0f) << 12) |
                            ((code[o++] & 0x3f) << 6) | (code[o++] & 0x3f))
                    default:
                        throw new Error("Bad encoding")
                }
            }
        }
    }

    initToken(ch) {
        while(ch && ch.charCodeAt(0) <= 32) {
            ch = this.sourceCode[this.pos++]
        }
        const type = INITIAL_STATE[ch]
        if (!type && !INVISIBLE_CHAR_CODE_TOKEN_LIST.includes(ch.charCodeAt(0))) {
            throw new Error(`state INIT, unexpected token ${ch}`)
        }
        this.tokens.push({text: ch, type})
        while(this.peek() === ' ') {
            this.pos++
        }
        let nextCh = this.peek()
        if (nextCh === undefined) {
            return
        }
        this.state = MOVE_TO[nextCh]
        if (!this.state) {
            throw new Error(`Unexpected character [${type}:${nextCh.charCodeAt(0)}] '${ch}' @ ${this.pos} - ${this.sourceCode.slice(Math.max(0, this.pos - 16), this.pos+16)}`)
        }
    }

    handleTokenNull(ch) {
        switch (ch) {
            case 'n':
            case 'u':
                this.curToken += ch
                break
            case 'l':
                this.curToken += ch
                if (this.curToken === 'null') {
                    let token = {text: this.curToken, type: TokenType.Null}
                    this.tokens.push(token)
                    this.curToken = ''
                    this.state = STATE_INIT
                } else if (this.curToken === 'nul') {
                } else {
                    throw new Error(`state NULL, unexpected token ${ch}`)
                }
                break
            default:
                throw new Error(`state NULL, unexpected token ${ch}`)
        }
    }

    handleTokenTrue(ch) {
        switch (ch) {
            case 't':
            case 'r':
            case 'u':
                this.curToken += ch
                break
            case 'e':
                if (this.curToken !== 'tru') {
                    throw new Error(`state TRUE, unexpected token ${ch}`)
                }
                this.curToken += ch
                let token = {text: this.curToken, type: TokenType.Boolean}
                this.tokens.push(token)
                this.curToken = ''
                this.state = STATE_INIT
                break
            default:
                throw new Error(`state TRUE, unexpected token ${ch}`)
        }
    }

    handleTokenFalse(ch) {
        switch (ch) {
            case 'f':
            case 'a':
            case 'l':
            case 's':
                this.curToken += ch
                break
            case 'e':
                this.curToken += ch
                let token = {text: this.curToken, type: TokenType.Boolean}
                this.tokens.push(token)
                this.curToken = ''
                this.state = STATE_INIT
                break
            default:
                throw new Error(`state FALSE, unexpected token ${ch}`)
        }
    }

    handleTokenNumber(ch) {
        switch (ch) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.curToken += ch
                if (!/[0-9]|\.|-/.test(this.peek())) {
                    let token = {text: this.curToken, type: TokenType.Number}
                    this.tokens.push(token)
                    this.curToken = ''
                    this.state = STATE_INIT
                }
                break
            case '-':
            case '.':
                this.curToken += ch
                break
            default:
                throw new Error(`state NUMBER, unexpected token ${ch}`)
        }
    }

    handleTokenStringEscape(ch) {
        if (ch === 'u') {
            this.curToken += JSON.parse(
                `"\\u${this.read()}${this.read()}${this.read()}${this.read()}"`
            )
            this.state = STATE_STRING
            return
        }
        this.curToken += JSON.parse(`"\\${ch}"`)
        this.state = STATE_STRING
    }

    handleTokenString(ch) {
        switch (ch) {
            case '\\':
                this.state = STATE_STRING_ESCAPE
                break
            case '"':
                if (this.curToken === '') {
                    this.curToken = ch
                } else {
                    this.curToken += ch
                    let token = {text: this.curToken, type: TokenType.String}
                    this.tokens.push(token)
                    this.curToken = ''
                    this.state = STATE_INIT
                }
                break
            default:
                this.curToken += ch
                break
        }
    }
}
