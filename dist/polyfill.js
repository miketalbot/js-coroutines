"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getCallback=getCallback,exports.getNodeCallback=getNodeCallback;var initialized=!1;if("undefined"!=typeof navigator&&"ReactNative"===navigator.product)try{if(!initialized&&global&&!global.requestIdleCallback){initialized=!0;var MAX_TIME=15,callbacks=[];global.requestIdleCallback=function(fn){callbacks.push(fn)},function(){function startFrame(){var time=Date.now();setImmediate(function(){return endOfWork(time)})}function endOfWork(){for(var cb,time=0<arguments.length&&void 0!==arguments[0]?arguments[0]:100,api={timeRemaining:function timeRemaining(){return MAX_TIME-(Date.now()-time)}};0<callbacks.length&&1<api.timeRemaining();){cb=callbacks.pop();try{cb(api)}catch(e){console.error(e)}}requestAnimationFrame(startFrame)}requestAnimationFrame(startFrame)}()}}catch(e){}try{if(!initialized&&"undefined"!=typeof window&&!window.requestIdleCallback){initialized=!0;var _MAX_TIME=14,_callbacks=[];window.requestIdleCallback=function(fn){_callbacks.push(fn)},function(){function startFrame(){var time=Date.now();setTimeout(function(){return endOfWork(time)})}function endOfWork(){for(var time=0<arguments.length&&void 0!==arguments[0]?arguments[0]:100,api={timeRemaining:function timeRemaining(){return _MAX_TIME-(Date.now()-time)}};0<_callbacks.length&&1<api.timeRemaining();){var cb=_callbacks.pop();try{cb(api)}catch(e){console.error(e)}}requestAnimationFrame(startFrame)}requestAnimationFrame(startFrame)}()}}catch(e){console.error(e)}var cached=null;function getCallback(){if(cached)return cached;if("undefined"==typeof window)return getNodeCallback();var callbacks=[],result=function(fn){callbacks.push(fn)};return function(){function startFrame(){var time=Date.now();setTimeout(function(){return endOfWork(time)})}function endOfWork(){var time=0<arguments.length&&void 0!==arguments[0]?arguments[0]:100;requestAnimationFrame(startFrame);for(var cb,api={timeRemaining:function timeRemaining(){return 14-(Date.now()-time)}};0<callbacks.length&&1<api.timeRemaining();){cb=callbacks.pop();try{cb(api)}catch(e){console.error(e)}}}requestAnimationFrame(startFrame)}(),cached=result,result}var nodeCallbacks=[],NODE_MAX_TIME=20;function getNodeCallback(){if(cached)return cached;var result=function(fn){nodeCallbacks.push(fn)};return setTimeout(endOfWork),cached=result,result}function endOfWork(){for(var time=Date.now(),api={timeRemaining:function timeRemaining(){return NODE_MAX_TIME-(Date.now()-time)}};0<nodeCallbacks.length&&1<api.timeRemaining();){var cb=nodeCallbacks.pop();try{cb(api)}catch(e){console.error(e)}}setImmediate(endOfWork)}