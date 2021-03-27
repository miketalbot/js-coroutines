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
const fcc = String.fromCharCode
const _k ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="


export const Base64StringGenerator = {
  compressToUTF16: function* (input) {
    var o = [],
      i,
      c,
      cr,
      st = 0;

    input = yield* this.compress(input);

    for (i = 0; i < input.length; i++) {
      if ((i & 511) === 0) yield;
      c = input.charCodeAt(i);
      switch (st++) {
        case 0:
          o.push(fcc((c >> 1) + 32));
          cr = (c & 1) << 14;
          break;
        case 1:
          o.push(fcc(cr + (c >> 2) + 32));
          cr = (c & 3) << 13;
          break;
        case 2:
          o.push(fcc(cr + (c >> 3) + 32));
          cr = (c & 7) << 12;
          break;
        case 3:
          o.push(fcc(cr + (c >> 4) + 32));
          cr = (c & 15) << 11;
          break;
        case 4:
          o.push(fcc(cr + (c >> 5) + 32));
          cr = (c & 31) << 10;
          break;
        case 5:
          o.push(fcc(cr + (c >> 6) + 32));
          cr = (c & 63) << 9;
          break;
        case 6:
          o.push(fcc(cr + (c >> 7) + 32));
          cr = (c & 127) << 8;
          break;
        case 7:
          o.push(fcc(cr + (c >> 8) + 32));
          cr = (c & 255) << 7;
          break;
        case 8:
          o.push(fcc(cr + (c >> 9) + 32));
          cr = (c & 511) << 6;
          break;
        case 9:
          o.push(fcc(cr + (c >> 10) + 32));
          cr = (c & 1023) << 5;
          break;
        case 10:
          o.push(fcc(cr + (c >> 11) + 32));
          cr = (c & 2047) << 4;
          break;
        case 11:
          o.push(fcc(cr + (c >> 12) + 32));
          cr = (c & 4095) << 3;
          break;
        case 12:
          o.push(fcc(cr + (c >> 13) + 32));
          cr = (c & 8191) << 2;
          break;
        case 13:
          o.push(fcc(cr + (c >> 14) + 32));
          cr = (c & 16383) << 1;
          break;
        case 14:
          o.push(
            fcc(cr + (c >> 15) + 32, (c & 32767) + 32)
          );
          st = 0;
          break;
        default:
          break;
      }
    }
    o.push(fcc(cr + 32));
    return o.join("");
  },

  decompressFromUTF16: function* (input) {
    var o = [],
      cr,
      c,
      s = 0,
      i = 0;

    while (i < input.length) {
      if ((i && 511) === 0) yield;
      c = input.charCodeAt(i) - 32;

      switch (s++) {
        case 0:
          cr = c << 1;
          break;
        case 1:
          o.push(fcc(cr | (c >> 14)));
          cr = (c & 16383) << 2;
          break;
        case 2:
          o.push(fcc(cr | (c >> 13)));
          cr = (c & 8191) << 3;
          break;
        case 3:
          o.push(fcc(cr | (c >> 12)));
          cr = (c & 4095) << 4;
          break;
        case 4:
          o.push(fcc(cr | (c >> 11)));
          cr = (c & 2047) << 5;
          break;
        case 5:
          o.push(fcc(cr | (c >> 10)));
          cr = (c & 1023) << 6;
          break;
        case 6:
          o.push(fcc(cr | (c >> 9)));
          cr = (c & 511) << 7;
          break;
        case 7:
          o.push(fcc(cr | (c >> 8)));
          cr = (c & 255) << 8;
          break;
        case 8:
          o.push(fcc(cr | (c >> 7)));
          cr = (c & 127) << 9;
          break;
        case 9:
          o.push(fcc(cr | (c >> 6)));
          cr = (c & 63) << 10;
          break;
        case 10:
          o.push(fcc(cr | (c >> 5)));
          cr = (c & 31) << 11;
          break;
        case 11:
          o.push(fcc(cr | (c >> 4)));
          cr = (c & 15) << 12;
          break;
        case 12:
          o.push(fcc(cr | (c >> 3)));
          cr = (c & 7) << 13;
          break;
        case 13:
          o.push(fcc(cr | (c >> 2)));
          cr = (c & 3) << 14;
          break;
        case 14:
          o.push(fcc(cr | (c >> 1)));
          cr = (c & 1) << 15;
          break;
        case 15:
          o.push(fcc(cr | c));
          s = 0;
          break;
        default:
          break;
      }

      i++;
    }

    return yield* this.decompress(o.join(""));
    //return o;
  },

  // private property
  
  decompress: function* (input) {
    var o = [];
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 1;
    var odd = input.charCodeAt(0) >> 8;
    var ii = 0;
    while (i < input.length * 2 && (i < input.length * 2 - 1 || odd === 0)) {
      if ((ii++ & 511) === 0) yield;
      if (i % 2 === 0) {
        chr1 = input.charCodeAt(i / 2) >> 8;
        chr2 = input.charCodeAt(i / 2) & 255;
        if (i / 2 + 1 < input.length) chr3 = input.charCodeAt(i / 2 + 1) >> 8;
        else chr3 = NaN;
      } else {
        chr1 = input.charCodeAt((i - 1) / 2) & 255;
        if ((i + 1) / 2 < input.length) {
          chr2 = input.charCodeAt((i + 1) / 2) >> 8;
          chr3 = input.charCodeAt((i + 1) / 2) & 255;
        } else chr2 = chr3 = NaN;
      }
      i += 3;

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2) || (i === input.length * 2 + 1 && odd)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3) || (i === input.length * 2 && odd)) {
        enc4 = 64;
      }

      o.push(_k.charAt(enc1));
      o.push(_k.charAt(enc2));
      o.push(_k.charAt(enc3));
      o.push(_k.charAt(enc4));
    }

    return o.join("");
  },

  compress: function* (input) {
    var o = [],
      ol = 1,
      output_,
      chr1,
      chr2,
      chr3,
      enc1,
      enc2,
      enc3,
      enc4,
      i = 0,
      flush = false;

    input = input.replace(/[^A-Za-z0-9+/=]/g, "");

    while (i < input.length) {
      if ((i && 1023) === 0) yield;
      enc1 = _k.indexOf(input.charAt(i++));
      enc2 = _k.indexOf(input.charAt(i++));
      enc3 = _k.indexOf(input.charAt(i++));
      enc4 = _k.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      if (ol % 2 === 0) {
        output_ = chr1 << 8;
        flush = true;

        if (enc3 !== 64) {
          o.push(fcc(output_ | chr2));
          flush = false;
        }
        if (enc4 !== 64) {
          output_ = chr3 << 8;
          flush = true;
        }
      } else {
        o.push(fcc(output_ | chr1));
        flush = false;

        if (enc3 !== 64) {
          output_ = chr2 << 8;
          flush = true;
        }
        if (enc4 !== 64) {
          o.push(fcc(output_ | chr3));
          flush = false;
        }
      }
      ol += 3;
    }
    yield;
    if (flush) {
      o.push(fcc(output_));
      o = o.join("");
      o =
        fcc(o.charCodeAt(0) | 256) + o.substring(1);
    } else {
      o = o.join("");
    }

    return o;
  },
};
