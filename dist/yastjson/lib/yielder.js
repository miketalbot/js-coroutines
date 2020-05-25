"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yielder = yielder;
var yieldCount = 0;

function yielder() {
  if (yieldCount++ > 128) {
    yieldCount = 0;
    return true;
  }

  return false;
}