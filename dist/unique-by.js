"use strict";var _regeneratorRuntime2=require("@babel/runtime/regenerator"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.uniqueBy=uniqueBy;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_marked=_regeneratorRuntime2.mark(uniqueBy);function _createForOfIteratorHelper(o,a){var b;if("undefined"==typeof Symbol||null==o[Symbol.iterator]){if(Array.isArray(o)||(b=_unsupportedIterableToArray(o))||a&&o&&"number"==typeof o.length){b&&(o=b);var c=0,d=function(){};return{s:d,n:function n(){return c>=o.length?{done:!0}:{done:!1,value:o[c++]}},e:function e(a){throw a},f:d}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var e,f=!0,g=!1;return{s:function s(){b=o[Symbol.iterator]()},n:function n(){var a=b.next();return f=a.done,a},e:function e(a){g=!0,e=a},f:function f(){try{f||null==b.return||b.return()}finally{if(g)throw e}}}}function _unsupportedIterableToArray(o,a){if(o){if("string"==typeof o)return _arrayLikeToArray(o,a);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,a):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function uniqueBy(a,b){var c,d,e,f,g,h,i;return _regenerator.default.wrap(function(j){for(;;)switch(j.prev=j.next){case 0:c=new Set,d=[],e=0,f=_createForOfIteratorHelper(a),j.prev=4,f.s();case 6:if((g=f.n()).done){j.next=17;break}if(h=g.value,!b){j.next=14;break}return j.delegateYield(b(h,e++,a),"t0",10);case 10:i=j.t0,c.has(i)||(d.push(h),c.add(i)),j.next=15;break;case 14:c.has(h)||(d.push(h),c.add(h));case 15:j.next=6;break;case 17:j.next=22;break;case 19:j.prev=19,j.t1=j["catch"](4),f.e(j.t1);case 22:return j.prev=22,f.f(),j.finish(22);case 25:return j.abrupt("return",d);case 26:case"end":return j.stop();}},_marked,null,[[4,19,22,25]])}