"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.keyByAsync=void 0;var _asyncWrapperUtils=require("./async-wrapper-utils"),_keyBy=require("./key-by"),keyByAsync=(0,_asyncWrapperUtils.wrapAsPromiseAndYieldFn)(_keyBy.keyBy);exports.keyByAsync=keyByAsync;