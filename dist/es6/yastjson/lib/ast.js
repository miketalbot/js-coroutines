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
    this.buildTree();
  }

  *buildTree() {
    let rootNode = yield* this.handleExprJson(this.tokens);
    return rootNode;
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
    let firstToken = tokens[0];
    let lastToken = tokens[tokens.length - 1];
    // empty array
    if (
      tokens.length === 2 &&
      tokens[0].type === TokenType.LeftBracket &&
      tokens[1].type === TokenType.RightBracket
    ) {
      return new ASTNode(tokens, ExprType.Array);
    }
    let node = new ASTNode(tokens, ExprType.Array);
    let index = 1;
    let valueTokens = [];
    let vfStack = [];
    let expectComma = true;
    for (; index < tokens.length - 1; index++) {
      if (yielder()) yield;
      let token = tokens[index];
      if (
        token.type === TokenType.Comma &&
        expectComma &&
        isValueFinish(vfStack)
      ) {
        let valueExpr =
          valueTokens.length === 1
            ? this.handleExprValueDirect(valueTokens)
            : yield* this.handleExprValue(valueTokens);
        valueTokens = [];
        node.addChild(valueExpr);
      } else {
        if (
          token.type === TokenType.RightBrace ||
          token.type === TokenType.RightBracket
        ) {
          let flag = token.type;
          vfStack.push(flag);
        } else if (
          token.type === TokenType.LeftBrace ||
          token.type === TokenType.LeftBracket
        ) {
          let flag = token.type;
          vfStack.push(flag);
          expectComma = false;
        }

        valueTokens.push(token);

        if (isValueFinish(vfStack)) {
          expectComma = true;
          vfStack = [];
        }
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
    let index = 1;
    let propExprNode;
    let propTokens = [];
    let valueTokens = [];
    let vfStack = [];
    let state = "prop";
    for (; index < tokens.length - 1; index++) {
      if (yielder()) yield;
      let token = tokens[index];
      if (token.type === TokenType.Colon && state === "prop") {
        propExprNode = yield* this.handleExprProp(propTokens);
        propTokens = [];
        state = "value";
      } else if (
        token.type === TokenType.Comma &&
        state === "prop" &&
        isValueFinish(vfStack)
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
            if (
              token.type === TokenType.RightBracket ||
              token.type === TokenType.RightBrace ||
              token.type === TokenType.LeftBracket ||
              token.type === TokenType.LeftBrace
            ) {
              let flag = token.type;
              vfStack.push(flag);
            }

            valueTokens.push(token);

            if (isValueFinish(vfStack)) {
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
    let propName = tokens[0].text;
    propName = propName.slice(1, propName.length - 1);
    node.propName = propName;
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

function isValueFinish(stack) {
  let braceCount = 0;
  let bracketCount = 0;
  for (let token of stack) {
    switch (token) {
      case TokenType.LeftBrace:
        braceCount++;
        break;
      case TokenType.LeftBracket:
        bracketCount++;
        break;
      case TokenType.RightBrace:
        braceCount--;
        break;
      case TokenType.RightBracket:
        bracketCount--;
        break;
      default:
        break;
    }
  }
  return braceCount === 0 && bracketCount === 0;
}
