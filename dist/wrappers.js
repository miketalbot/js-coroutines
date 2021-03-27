"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.yielding=yielding,exports.wrapAsPromise=wrapAsPromise,exports.curryRight=curryRight;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_coroutines=_interopRequireWildcard(require("./coroutines"));function yielding(fn){var frequency=1<arguments.length&&void 0!==arguments[1]?arguments[1]:16,yieldCount=0;if(fn._yielding)return fn;var result=_regenerator.default.mark(function(){var result,_args=arguments;return _regenerator.default.wrap(function(_context){for(;;)switch(_context.prev=_context.next){case 0:if(result=fn.apply(void 0,_args),0!=yieldCount++%frequency){_context.next=4;break}return void(_context.next=4);case 4:return _context.abrupt("return",result);case 5:case"end":return _context.stop();}},result)});return result._yielding=!0,result}function wrapAsPromise(coroutine){var result=function(){return(0,_coroutines.default)(coroutine.apply(void 0,arguments))};return result.with=function(){for(var _len=arguments.length,params=Array(_len),_key=0;_key<_len;_key++)params[_key]=arguments[_key];return _coroutines.call.apply(void 0,[result].concat(params))},result}function curryRight(fn,supplied,execute){return fn.length>supplied.length?function(){for(var _len2=arguments.length,params=Array(_len2),_key2=0;_key2<_len2;_key2++)params[_key2]=arguments[_key2];return curryRight.call(this,fn,[].concat(params,(0,_toConsumableArray2.default)(supplied)),execute)}:execute.apply(this,supplied)}