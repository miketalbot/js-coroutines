"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.useInternalEngine=useInternalEngine,exports.request=void 0;var _polyfill=require("./polyfill"),request="undefined"==typeof window?(0,_polyfill.getNodeCallback)():window.requestIdleCallback;exports.request=request;function useInternalEngine(a){exports.request=request=a?(0,_polyfill.getCallback)():request}