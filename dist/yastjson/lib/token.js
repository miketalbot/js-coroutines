"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = exports.TokenType = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * Copyright (c) 2020 5u9ar (zhuyingda)
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
var TokenType = {
  LeftBrace: "{",
  RightBrace: "}",
  LeftBracket: "l",
  RightBracket: "r",
  Comma: "c",
  Colon: "n",
  Null: "0",
  Boolean: "t",
  Number: "n",
  String: "s"
};
exports.TokenType = TokenType;

var Token = /*#__PURE__*/function () {
  function Token(text, type) {
    (0, _classCallCheck2.default)(this, Token);
    this.text = text;
    this.type = type;
  }

  (0, _createClass2.default)(Token, [{
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }]);
  return Token;
}();

exports.Token = Token;