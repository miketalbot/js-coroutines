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

const util = {
  mapValue: function (obj) {
    let out = [];
    for (let key in obj) {
      out.push(obj[key]);
    }
    return out;
  },
};
const terminalSignals = util.mapValue(TokenType);
const nonTerminalSignals = util.mapValue(ExprType);

export class ASTNode {
  constructor(tokens, type, parentNode) {
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
    let rootNode = yield* this.handleExprJson(this.tokens, null);
    return rootNode;
  }

  *handleExprJson(tokens, parent) {
    if (yielder()) yield;
    let node = new ASTNode(tokens, ExprType.Json, parent);
    let firstToken = tokens[0];

    if (firstToken.type === TokenType.LeftBracket) {
      let arrayExpr = yield* this.handleExprArray(tokens, node);
      node.addChild(arrayExpr);
    } else if (firstToken.type === TokenType.LeftBrace) {
      let objectExpr = yield* this.handleExprObject(tokens, node);
      node.addChild(objectExpr);
    } else {
      throw new Error(
        `[json expression error] unexpected token ${firstToken.text}`
      );
    }

    return node;
  }

  *handleExprArray(tokens, parent) {
    let firstToken = tokens[0];
    let lastToken = tokens[tokens.length - 1];
    if (
      firstToken.type !== TokenType.LeftBracket ||
      lastToken.type !== TokenType.RightBracket
    ) {
      throw new Error(`[array expression error] wrong bracket token`);
    }

    // empty array
    if (
      tokens.length === 2 &&
      tokens[0].type === TokenType.LeftBracket &&
      tokens[1].type === TokenType.RightBracket
    ) {
      return new ASTNode(tokens, ExprType.Array, parent);
    }
    let node = new ASTNode(tokens, ExprType.Array, parent);
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
            ? this.handleExprValueDirect(valueTokens, node)
            : yield* this.handleExprValue(valueTokens, node);
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
        ? this.handleExprValueDirect(valueTokens, node)
        : yield* this.handleExprValue(valueTokens, node);
    node.addChild(valueExpr);

    return node;
  }

  *handleExprObject(tokens, parent) {
    let firstToken = tokens[0];
    let lastToken = tokens[tokens.length - 1];
    if (
      firstToken.type !== TokenType.LeftBrace ||
      lastToken.type !== TokenType.RightBrace
    ) {
      throw new Error(`[object expression error] wrong brace token`);
    }

    // empty object
    if (
      tokens.length === 2 &&
      tokens[0].type === TokenType.LeftBrace &&
      tokens[1].type === TokenType.RightBrace
    ) {
      return new ASTNode(tokens, ExprType.Object, parent);
    }

    let node = new ASTNode(tokens, ExprType.Object, parent);
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
        propExprNode = yield* this.handleExprProp(propTokens, node);
        propTokens = [];
        state = "value";
      } else if (
        token.type === TokenType.Comma &&
        state === "prop" &&
        isValueFinish(vfStack)
      ) {
        let valueExpr =
          valueTokens.length === 1
            ? this.handleExprValueDirect(valueTokens, node)
            : yield* this.handleExprValue(valueTokens, node);
        valueTokens = [];
        propExprNode.addChild(valueExpr);
        node.addChild(propExprNode);
      } else {
        switch (state) {
          case "prop":
            if (propTokens.length !== 0) {
              throw new Error(
                "[object expression error] prop state got unexpected token"
              );
            }
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
        ? this.handleExprValueDirect(valueTokens, node)
        : yield* this.handleExprValue(valueTokens, node);
    propExprNode.addChild(valueExpr);
    node.addChild(propExprNode);

    return node;
  }

  *handleExprProp(tokens, parent) {
    if (yielder()) yield;
    if (tokens.length !== 1 || tokens[0].type !== TokenType.String) {
      throw new Error("[prop expression error] invalid tokens input");
    }

    let node = new ASTNode(tokens, ExprType.Prop, parent);
    let propName = tokens[0].text;
    propName = propName.slice(1, propName.length - 1);
    node.propName = propName;

    return node;
  }

  handleExprValueDirect(tokens, parent) {
    let node = new ASTNode(tokens, ExprType.Value, parent);

    let tokenType = tokens[0].type;
    switch (tokenType) {
      case TokenType.Null:
      case TokenType.Boolean:
      case TokenType.Number:
      case TokenType.String:
        node.value = new ASTNode(tokens, tokenType, node);
        break;
      default:
        throw new Error("[value expression error] unknown single token type");
    }

    return node;
  }

  *handleExprValue(tokens, parent) {
    if (yielder()) yield;
    if (tokens.length === 0) {
      throw new Error("[value expression error] empty value expr");
    }
    if (
      tokens[0].type !== TokenType.LeftBracket &&
      tokens[0].type !== TokenType.LeftBrace
    ) {
      throw new Error("[value expression error] invalid tokens input");
    }

    let node = new ASTNode(tokens, ExprType.Value, parent);

    node.value = yield* this.handleExprJson(tokens, ExprType.json, node);

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
