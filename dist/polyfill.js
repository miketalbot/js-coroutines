"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCallback = getCallback;
var initialized = false;

if (typeof navigator != 'undefined' && navigator.product === 'ReactNative') {
  try {
    if (!initialized && global && !global.requestIdleCallback) {
      initialized = true;
      var MAX_TIME = 15;
      var callbacks = [];

      global.requestIdleCallback = function (fn) {
        callbacks.push(fn);
      };

      (function idle() {
        requestAnimationFrame(startFrame);

        function startFrame() {
          var time = Date.now();
          setImmediate(function () {
            return endOfWork(time);
          });
        }

        function endOfWork() {
          var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
          var api = {
            timeRemaining: function timeRemaining() {
              return MAX_TIME - (Date.now() - time);
            }
          };

          while (callbacks.length > 0 && api.timeRemaining() > 1) {
            var cb = callbacks.pop();

            try {
              cb(api);
            } catch (e) {
              console.error(e);
            }
          }

          requestAnimationFrame(startFrame);
        }
      })();
    }
  } catch (e) {}
}

try {
  if (!initialized && window && !window.requestIdleCallback) {
    var _MAX_TIME = 14;
    var _callbacks = [];

    window.requestIdleCallback = function (fn) {
      _callbacks.push(fn);
    };

    (function idle() {
      requestAnimationFrame(startFrame);

      function startFrame() {
        var time = Date.now();
        setTimeout(function () {
          return endOfWork(time);
        });
      }

      function endOfWork() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
        var api = {
          timeRemaining: function timeRemaining() {
            return _MAX_TIME - (Date.now() - time);
          }
        };

        while (_callbacks.length > 0 && api.timeRemaining() > 1) {
          var cb = _callbacks.pop();

          try {
            cb(api);
          } catch (e) {
            console.error(e);
          }
        }

        requestAnimationFrame(startFrame);
      }
    })();
  }
} catch (e) {
  console.error(e);
}

var cached = null;

function getCallback() {
  if (cached) return cached;
  var MAX_TIME = 16;
  var callbacks = [];

  var result = function result(fn) {
    callbacks.push(fn);
  };

  (function idle() {
    requestAnimationFrame(startFrame);

    function startFrame() {
      var time = Date.now();
      setTimeout(function () {
        return endOfWork(time);
      });
    }

    function endOfWork() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var api = {
        timeRemaining: function timeRemaining() {
          return MAX_TIME - (Date.now() - time);
        }
      };

      while (callbacks.length > 0 && api.timeRemaining() > 1) {
        var cb = callbacks.pop();

        try {
          cb(api);
        } catch (e) {
          console.error(e);
        }
      }

      requestAnimationFrame(startFrame);
    }
  })();

  cached = result;
  return result;
}