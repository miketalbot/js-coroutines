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
import { Tokenizer } from "./tokenizer";
import { AST } from "./ast";
import { ExprType } from "./expression";
import { TokenType } from "./token";
import { yielder } from "./yielder";

export class ASTParser {
  constructor(ast) {
    this.ast = ast;
  }

  *getJson() {
    return yield* this.handleValue(this.ast);
  }

  *handleJson(astNode) {
    if (astNode.type !== ExprType.Json) {
      throw new Error("[parse AST error] unexpected node type, expect Json");
    }

    let output;
    let node = astNode.childNodeList[0];
    if (node.type === ExprType.Array) {
      output = [];
      for (let item of node.childNodeList) {
        output.push(yield* this.handleValue(item.value));
      }
    } else if (node.type === ExprType.Object) {
      output = {};
      for (let item of node.childNodeList) {
        output[item.propName] = yield* this.handleValue(
          item.childNodeList[0].value
        );
      }
    } else {
      throw new Error("[parse AST error] unexpected second node type");
    }
    return output;
  }

  *handleValue(astNode) {
    if (yielder()) yield;
    let token;
    switch (astNode.type) {
      case TokenType.Null:
        return null;
      case TokenType.Boolean:
        token = astNode.tokens[0].text;
        return token === "true";
      case TokenType.Number:
        let num = +astNode.tokens[0].text;
        return num;
      case TokenType.String:
        return astNode.tokens[0].text.slice(1, -1);
      case ExprType.Json:
        return yield* this.handleJson(astNode);
      default:
        throw new Error(
          "[parse AST error] unexpected node type, expect a valid Value node"
        );
    }
  }
}

export function* parse(jsonString) {
  const tokenizer = new Tokenizer();
  const tokens = yield* tokenizer.tokenize(jsonString);
  const astInst = new AST(tokens);
  const ast = yield* astInst.buildTree();
  const astParser = new ASTParser(ast);
  return yield* astParser.getJson();
}
