"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base64StringGenerator = void 0;
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
//           (c) 2020 Mike Talbot (generator modifications)
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// This lib is a DERIVATION of part of the lz-string project.
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/index.html
//
// Base64 compression / decompression for already compressed content (gif, png, jpg, mp3, ...)
// version 1.4.1
var Base64StringGenerator = {
  compressToUTF16: /*#__PURE__*/regeneratorRuntime.mark(function compressToUTF16(input) {
    var output, i, c, current, status;
    return regeneratorRuntime.wrap(function compressToUTF16$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            output = [], status = 0;
            return _context.delegateYield(this.compress(input), "t0", 2);

          case 2:
            input = _context.t0;
            i = 0;

          case 4:
            if (!(i < input.length)) {
              _context.next = 61;
              break;
            }

            if (!((i & 511) === 0)) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return;

          case 8:
            c = input.charCodeAt(i);
            _context.t1 = status++;
            _context.next = _context.t1 === 0 ? 12 : _context.t1 === 1 ? 15 : _context.t1 === 2 ? 18 : _context.t1 === 3 ? 21 : _context.t1 === 4 ? 24 : _context.t1 === 5 ? 27 : _context.t1 === 6 ? 30 : _context.t1 === 7 ? 33 : _context.t1 === 8 ? 36 : _context.t1 === 9 ? 39 : _context.t1 === 10 ? 42 : _context.t1 === 11 ? 45 : _context.t1 === 12 ? 48 : _context.t1 === 13 ? 51 : _context.t1 === 14 ? 54 : 57;
            break;

          case 12:
            output.push(String.fromCharCode((c >> 1) + 32));
            current = (c & 1) << 14;
            return _context.abrupt("break", 58);

          case 15:
            output.push(String.fromCharCode(current + (c >> 2) + 32));
            current = (c & 3) << 13;
            return _context.abrupt("break", 58);

          case 18:
            output.push(String.fromCharCode(current + (c >> 3) + 32));
            current = (c & 7) << 12;
            return _context.abrupt("break", 58);

          case 21:
            output.push(String.fromCharCode(current + (c >> 4) + 32));
            current = (c & 15) << 11;
            return _context.abrupt("break", 58);

          case 24:
            output.push(String.fromCharCode(current + (c >> 5) + 32));
            current = (c & 31) << 10;
            return _context.abrupt("break", 58);

          case 27:
            output.push(String.fromCharCode(current + (c >> 6) + 32));
            current = (c & 63) << 9;
            return _context.abrupt("break", 58);

          case 30:
            output.push(String.fromCharCode(current + (c >> 7) + 32));
            current = (c & 127) << 8;
            return _context.abrupt("break", 58);

          case 33:
            output.push(String.fromCharCode(current + (c >> 8) + 32));
            current = (c & 255) << 7;
            return _context.abrupt("break", 58);

          case 36:
            output.push(String.fromCharCode(current + (c >> 9) + 32));
            current = (c & 511) << 6;
            return _context.abrupt("break", 58);

          case 39:
            output.push(String.fromCharCode(current + (c >> 10) + 32));
            current = (c & 1023) << 5;
            return _context.abrupt("break", 58);

          case 42:
            output.push(String.fromCharCode(current + (c >> 11) + 32));
            current = (c & 2047) << 4;
            return _context.abrupt("break", 58);

          case 45:
            output.push(String.fromCharCode(current + (c >> 12) + 32));
            current = (c & 4095) << 3;
            return _context.abrupt("break", 58);

          case 48:
            output.push(String.fromCharCode(current + (c >> 13) + 32));
            current = (c & 8191) << 2;
            return _context.abrupt("break", 58);

          case 51:
            output.push(String.fromCharCode(current + (c >> 14) + 32));
            current = (c & 16383) << 1;
            return _context.abrupt("break", 58);

          case 54:
            output.push(String.fromCharCode(current + (c >> 15) + 32, (c & 32767) + 32));
            status = 0;
            return _context.abrupt("break", 58);

          case 57:
            return _context.abrupt("break", 58);

          case 58:
            i++;
            _context.next = 4;
            break;

          case 61:
            output.push(String.fromCharCode(current + 32));
            return _context.abrupt("return", output.join(""));

          case 63:
          case "end":
            return _context.stop();
        }
      }
    }, compressToUTF16, this);
  }),
  decompressFromUTF16: /*#__PURE__*/regeneratorRuntime.mark(function decompressFromUTF16(input) {
    var output, current, c, status, i;
    return regeneratorRuntime.wrap(function decompressFromUTF16$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            output = [], status = 0, i = 0;

          case 1:
            if (!(i < input.length)) {
              _context2.next = 60;
              break;
            }

            if (!((i && 511) === 0)) {
              _context2.next = 5;
              break;
            }

            _context2.next = 5;
            return;

          case 5:
            c = input.charCodeAt(i) - 32;
            _context2.t0 = status++;
            _context2.next = _context2.t0 === 0 ? 9 : _context2.t0 === 1 ? 11 : _context2.t0 === 2 ? 14 : _context2.t0 === 3 ? 17 : _context2.t0 === 4 ? 20 : _context2.t0 === 5 ? 23 : _context2.t0 === 6 ? 26 : _context2.t0 === 7 ? 29 : _context2.t0 === 8 ? 32 : _context2.t0 === 9 ? 35 : _context2.t0 === 10 ? 38 : _context2.t0 === 11 ? 41 : _context2.t0 === 12 ? 44 : _context2.t0 === 13 ? 47 : _context2.t0 === 14 ? 50 : _context2.t0 === 15 ? 53 : 56;
            break;

          case 9:
            current = c << 1;
            return _context2.abrupt("break", 57);

          case 11:
            output.push(String.fromCharCode(current | c >> 14));
            current = (c & 16383) << 2;
            return _context2.abrupt("break", 57);

          case 14:
            output.push(String.fromCharCode(current | c >> 13));
            current = (c & 8191) << 3;
            return _context2.abrupt("break", 57);

          case 17:
            output.push(String.fromCharCode(current | c >> 12));
            current = (c & 4095) << 4;
            return _context2.abrupt("break", 57);

          case 20:
            output.push(String.fromCharCode(current | c >> 11));
            current = (c & 2047) << 5;
            return _context2.abrupt("break", 57);

          case 23:
            output.push(String.fromCharCode(current | c >> 10));
            current = (c & 1023) << 6;
            return _context2.abrupt("break", 57);

          case 26:
            output.push(String.fromCharCode(current | c >> 9));
            current = (c & 511) << 7;
            return _context2.abrupt("break", 57);

          case 29:
            output.push(String.fromCharCode(current | c >> 8));
            current = (c & 255) << 8;
            return _context2.abrupt("break", 57);

          case 32:
            output.push(String.fromCharCode(current | c >> 7));
            current = (c & 127) << 9;
            return _context2.abrupt("break", 57);

          case 35:
            output.push(String.fromCharCode(current | c >> 6));
            current = (c & 63) << 10;
            return _context2.abrupt("break", 57);

          case 38:
            output.push(String.fromCharCode(current | c >> 5));
            current = (c & 31) << 11;
            return _context2.abrupt("break", 57);

          case 41:
            output.push(String.fromCharCode(current | c >> 4));
            current = (c & 15) << 12;
            return _context2.abrupt("break", 57);

          case 44:
            output.push(String.fromCharCode(current | c >> 3));
            current = (c & 7) << 13;
            return _context2.abrupt("break", 57);

          case 47:
            output.push(String.fromCharCode(current | c >> 2));
            current = (c & 3) << 14;
            return _context2.abrupt("break", 57);

          case 50:
            output.push(String.fromCharCode(current | c >> 1));
            current = (c & 1) << 15;
            return _context2.abrupt("break", 57);

          case 53:
            output.push(String.fromCharCode(current | c));
            status = 0;
            return _context2.abrupt("break", 57);

          case 56:
            return _context2.abrupt("break", 57);

          case 57:
            i++;
            _context2.next = 1;
            break;

          case 60:
            return _context2.delegateYield(this.decompress(output.join("")), "t1", 61);

          case 61:
            return _context2.abrupt("return", _context2.t1);

          case 62:
          case "end":
            return _context2.stop();
        }
      }
    }, decompressFromUTF16, this);
  }),
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  decompress: /*#__PURE__*/regeneratorRuntime.mark(function decompress(input) {
    var output, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, odd, ii;
    return regeneratorRuntime.wrap(function decompress$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            output = [];
            i = 1;
            odd = input.charCodeAt(0) >> 8;
            ii = 0;

          case 4:
            if (!(i < input.length * 2 && (i < input.length * 2 - 1 || odd === 0))) {
              _context3.next = 21;
              break;
            }

            if (!((ii++ & 511) === 0)) {
              _context3.next = 8;
              break;
            }

            _context3.next = 8;
            return;

          case 8:
            if (i % 2 === 0) {
              chr1 = input.charCodeAt(i / 2) >> 8;
              chr2 = input.charCodeAt(i / 2) & 255;
              if (i / 2 + 1 < input.length) chr3 = input.charCodeAt(i / 2 + 1) >> 8;else chr3 = NaN;
            } else {
              chr1 = input.charCodeAt((i - 1) / 2) & 255;

              if ((i + 1) / 2 < input.length) {
                chr2 = input.charCodeAt((i + 1) / 2) >> 8;
                chr3 = input.charCodeAt((i + 1) / 2) & 255;
              } else chr2 = chr3 = NaN;
            }

            i += 3;
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;

            if (isNaN(chr2) || i === input.length * 2 + 1 && odd) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3) || i === input.length * 2 && odd) {
              enc4 = 64;
            }

            output.push(this._keyStr.charAt(enc1));
            output.push(this._keyStr.charAt(enc2));
            output.push(this._keyStr.charAt(enc3));
            output.push(this._keyStr.charAt(enc4));
            _context3.next = 4;
            break;

          case 21:
            return _context3.abrupt("return", output.join(""));

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, decompress, this);
  }),
  compress: /*#__PURE__*/regeneratorRuntime.mark(function compress(input) {
    var output, ol, output_, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, flush;
    return regeneratorRuntime.wrap(function compress$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            output = [], ol = 1, i = 0, flush = false;
            input = input.replace(/[^A-Za-z0-9+/=]/g, "");

          case 2:
            if (!(i < input.length)) {
              _context4.next = 17;
              break;
            }

            if (!((i && 1023) === 0)) {
              _context4.next = 6;
              break;
            }

            _context4.next = 6;
            return;

          case 6:
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;

            if (ol % 2 === 0) {
              output_ = chr1 << 8;
              flush = true;

              if (enc3 !== 64) {
                output.push(String.fromCharCode(output_ | chr2));
                flush = false;
              }

              if (enc4 !== 64) {
                output_ = chr3 << 8;
                flush = true;
              }
            } else {
              output.push(String.fromCharCode(output_ | chr1));
              flush = false;

              if (enc3 !== 64) {
                output_ = chr2 << 8;
                flush = true;
              }

              if (enc4 !== 64) {
                output.push(String.fromCharCode(output_ | chr3));
                flush = false;
              }
            }

            ol += 3;
            _context4.next = 2;
            break;

          case 17:
            _context4.next = 19;
            return;

          case 19:
            if (flush) {
              output.push(String.fromCharCode(output_));
              output = output.join("");
              output = String.fromCharCode(output.charCodeAt(0) | 256) + output.substring(1);
            } else {
              output = output.join("");
            }

            return _context4.abrupt("return", output);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, compress, this);
  })
};
exports.Base64StringGenerator = Base64StringGenerator;