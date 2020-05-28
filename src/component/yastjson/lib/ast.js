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
import { ExprType } from "./expression";
import { yielder } from "./yielder";

export class ASTNode {
  constructor(tokens, type) {
    this.type = type;
    this.tokens = tokens;
    this.childNodeList = [];
  }

  addChild(node) {
    this.childNodeList.push(node);
  }
}

export class AST {
  constructor(tokens) {
    this.tokens = tokens;
  }

  *buildTree() {
    return yield* this.handleExprJson(this.tokens);
  }

  *handleExprJson(tokens) {
    if (yielder()) yield;
    let node = new ASTNode(tokens, ExprType.Json);
    let firstToken = tokens[0];

    if (firstToken.type === TokenType.LeftBracket) {
      let arrayExpr = yield* this.handleExprArray(tokens);
      node.addChild(arrayExpr);
    } else if (firstToken.type === TokenType.LeftBrace) {
      let objectExpr = yield* this.handleExprObject(tokens);
      node.addChild(objectExpr);
    } else {
      throw new Error(
        `[json expression error] unexpected token ${firstToken.text}`
      );
    }

    return node;
  }

  *handleExprArray(tokens) {
    // empty array
    if (
      tokens.length === 2 &&
      tokens[0].type === TokenType.LeftBracket &&
      tokens[1].type === TokenType.RightBracket
    ) {
      return new ASTNode(tokens, ExprType.Array);
    }
    let node = new ASTNode(tokens, ExprType.Array);

    let valueTokens = [];
    let brace = 0;
    let bracket = 0;

    for (let index = 1, length = tokens.length - 1; index < length; index++) {
      if (yielder()) yield;
      let token = tokens[index];
      if (token.type === TokenType.Comma && brace === 0 && bracket === 0) {
        let valueExpr =
          valueTokens.length === 1
            ? this.handleExprValueDirect(valueTokens)
            : yield* this.handleExprValue(valueTokens);
        valueTokens = [];
        node.addChild(valueExpr);
      } else {
        switch (token.type) {
          case TokenType.RightBrace:
            brace--;
            break;
          case TokenType.RightBracket:
            bracket--;
            break;
          case TokenType.LeftBrace:
            brace++;
            break;
          case TokenType.LeftBracket:
            bracket++;
            break;
          default:
            break;
        }
        valueTokens.push(token);
      }
    }

    // last array value
    let valueExpr =
      valueTokens.length === 1
        ? this.handleExprValueDirect(valueTokens)
        : yield* this.handleExprValue(valueTokens);
    node.addChild(valueExpr);

    return node;
  }

  *handleExprObject(tokens) {
    // empty object
    if (
      tokens.length === 2 &&
      tokens[0].type === TokenType.LeftBrace &&
      tokens[1].type === TokenType.RightBrace
    ) {
      return new ASTNode(tokens, ExprType.Object);
    }

    let node = new ASTNode(tokens, ExprType.Object);
    let propExprNode;
    let propTokens = [];
    let valueTokens = [];
    let brace = 0;
    let bracket = 0;
    let state = "prop";
    for (let index = 1, length = tokens.length - 1; index < length; index++) {
      if (yielder()) yield;
      let token = tokens[index];
      if (token.type === TokenType.Colon && state === "prop") {
        propExprNode = yield* this.handleExprProp(propTokens);
        propTokens = [];
        state = "value";
      } else if (
        token.type === TokenType.Comma &&
        state === "prop" &&
        brace === 0 &&
        bracket === 0
      ) {
        let valueExpr =
          valueTokens.length === 1
            ? this.handleExprValueDirect(valueTokens)
            : yield* this.handleExprValue(valueTokens);
        valueTokens = [];
        propExprNode.addChild(valueExpr);
        node.addChild(propExprNode);
      } else {
        switch (state) {
          case "prop":
            propTokens.push(token);
            break;
          case "value":
            switch (token.type) {
              case TokenType.RightBrace:
                brace--;
                break;
              case TokenType.RightBracket:
                bracket--;
                break;
              case TokenType.LeftBrace:
                brace++;
                break;
              case TokenType.LeftBracket:
                bracket++;
                break;
              default:
                break;
            }

            valueTokens.push(token);

            if (brace === 0 && bracket === 0) {
              state = "prop";
            }
            break;
          default:
            throw new Error("[object expression error] unexpected state");
        }
      }
    }

    // last prop value
    let valueExpr =
      valueTokens.length === 1
        ? this.handleExprValueDirect(valueTokens)
        : yield* this.handleExprValue(valueTokens);
    propExprNode.addChild(valueExpr);
    node.addChild(propExprNode);

    return node;
  }

  *handleExprProp(tokens) {
    if (yielder()) yield;
    let node = new ASTNode(tokens, ExprType.Prop);
    node.propName = tokens[0].text.slice(1, -1);
    return node;
  }

  handleExprValueDirect(tokens) {
    let node = new ASTNode(tokens, ExprType.Value);

    let tokenType = tokens[0].type;
    switch (tokenType) {
      case TokenType.Null:
      case TokenType.Boolean:
      case TokenType.Number:
      case TokenType.String:
        node.value = new ASTNode(tokens, tokenType);
        break;
      default:
        throw new Error("[value expression error] unknown single token type");
    }

    return node;
  }

  *handleExprValue(tokens) {
    if (yielder()) yield;
    let node = new ASTNode(tokens, ExprType.Value);
    node.value = yield* this.handleExprJson(tokens);
    return node;
  }
}
