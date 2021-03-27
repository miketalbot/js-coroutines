// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
//           (c) 2020 Mike Talbot (generator modifications)
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4

const YIELD_MASK = 15

var LZStringGenerator = (function () {
    // private property
    var f = String.fromCharCode
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var safe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$'
    var rev = {}

    function getBaseValue(alphabet, character) {
        if (!rev[alphabet]) {
            rev[alphabet] = {}
            for (var i = 0; i < alphabet.length; i++) {
                rev[alphabet][alphabet.charAt(i)] = i
            }
        }
        return rev[alphabet][character]
    }

    var LZString = {
        compressToBase64: function* (input) {
            if (input === null) return ''
            var res = yield* LZString._compress(input, 6, function (a) {
                return b64.charAt(a)
            })
            switch (
                res.length % 4 // To produce valid Base64
            ) {
                default: // When could this happen ?
                case 0:
                    return res
                case 1:
                    return res + '==='
                case 2:
                    return res + '=='
                case 3:
                    return res + '='
            }
        },

        decompressFromBase64: function* (input) {
            if (input === null) return ''
            if (input === '') return null
            return yield* LZString._decompress(input.length, 32, function (index) {
                return getBaseValue(b64, input.charAt(index))
            })
        },

        compressToUTF16: function* (input) {
            if (input === null) return ''
            return (yield* LZString._compress(input, 15, function (a) {
                return f(a + 32)
            })) + ' '
        },

        decompressFromUTF16: function* (compressed) {
            if (compressed === null) return ''
            if (compressed === '') return null
            return yield* LZString._decompress(compressed.length, 16384, function (index) {
                return compressed.charCodeAt(index) - 32
            })
        },

        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function* (uncompressed) {
            var compressed = yield* LZString.compress(uncompressed)
            var buf = new Uint8Array(compressed.length * 2) // 2 bytes per character
            yield
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                if ((i & YIELD_MASK) === 0) yield
                var current_value = compressed.charCodeAt(i)
                buf[i * 2] = current_value >>> 8
                buf[i * 2 + 1] = current_value % 256
            }
            return buf
        },

        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function* (compressed) {
            if (compressed === null || compressed === undefined) {
                return yield* LZString.decompress(compressed)
            } else {
                var buf = new Array(compressed.length / 2) // 2 bytes per character
                for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                    if ((i & YIELD_MASK) === 0) yield
                    buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1]
                }
                yield
                return yield* LZString.decompress(buf.join(''))
            }
        },

        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function* (input) {
            if (input === null) return ''
            return yield* LZString._compress(input, 6, function (a) {
                return safe.charAt(a)
            })
        },

        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function* (input) {
            if (input === null) return ''
            if (input === '') return null
            input = input.replace(/ /g, '+')
            return yield* LZString._decompress(input.length, 32, function (index) {
                return getBaseValue(safe, input.charAt(index))
            })
        },

        compress: function* (uncompressed) {
            return yield* LZString._compress(uncompressed, 16, function (a) {
                return f(a)
            })
        },
        _compress: function* (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed === null) return ''
            var i,
                value,
                context_dictionary = {},
                context_dictionaryToCreate = {},
                context_c = '',
                context_wc = '',
                context_w = '',
                context_enlargeIn = 2, // Compensate for the first entry which should not count
                context_dictSize = 3,
                context_numBits = 2,
                context_data = [],
                context_data_val = 0,
                context_data_position = 0,
                ii

            for (ii = 0; ii < uncompressed.length; ii += 1) {
                if ((ii & YIELD_MASK) === 0) yield
                context_c = uncompressed.charAt(ii)
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++
                    context_dictionaryToCreate[context_c] = true
                }

                context_wc = context_w + context_c
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc
                } else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = context_data_val << 1
                                if (context_data_position === bitsPerChar - 1) {
                                    context_data_position = 0
                                    context_data.push(getCharFromInt(context_data_val))
                                    context_data_val = 0
                                } else {
                                    context_data_position++
                                }
                            }
                            value = context_w.charCodeAt(0)
                            yield
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1)
                                if (context_data_position === bitsPerChar - 1) {
                                    context_data_position = 0
                                    context_data.push(getCharFromInt(context_data_val))
                                    context_data_val = 0
                                } else {
                                    context_data_position++
                                }
                                value = value >> 1
                            }
                        } else {
                            value = 1
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value
                                if (context_data_position === bitsPerChar - 1) {
                                    context_data_position = 0
                                    context_data.push(getCharFromInt(context_data_val))
                                    context_data_val = 0
                                } else {
                                    context_data_position++
                                }
                                value = 0
                            }
                            value = context_w.charCodeAt(0)
                            yield
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1)
                                if (context_data_position === bitsPerChar - 1) {
                                    context_data_position = 0
                                    context_data.push(getCharFromInt(context_data_val))
                                    context_data_val = 0
                                } else {
                                    context_data_position++
                                }
                                value = value >> 1
                            }
                        }
                        context_enlargeIn--
                        if (context_enlargeIn === 0) {
                            context_enlargeIn = Math.pow(2, context_numBits)
                            context_numBits++
                        }
                        delete context_dictionaryToCreate[context_w]
                    } else {
                        value = context_dictionary[context_w]
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1)
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0
                                context_data.push(getCharFromInt(context_data_val))
                                context_data_val = 0
                            } else {
                                context_data_position++
                            }
                            value = value >> 1
                        }
                    }
                    context_enlargeIn--
                    if (context_enlargeIn === 0) {
                        context_enlargeIn = Math.pow(2, context_numBits)
                        context_numBits++
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++
                    context_w = String(context_c)
                }
            }

            // Output the code for w.
            if (context_w !== '') {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0
                                context_data.push(getCharFromInt(context_data_val))
                                context_data_val = 0
                            } else {
                                context_data_position++
                            }
                        }
                        value = context_w.charCodeAt(0)
                        yield
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1)
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0
                                context_data.push(getCharFromInt(context_data_val))
                                context_data_val = 0
                            } else {
                                context_data_position++
                            }
                            value = value >> 1
                        }
                    } else {
                        value = 1
                        yield
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0
                                context_data.push(getCharFromInt(context_data_val))
                                context_data_val = 0
                            } else {
                                context_data_position++
                            }
                            value = 0
                        }
                        value = context_w.charCodeAt(0)
                        yield
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1)
                            if (context_data_position === bitsPerChar - 1) {
                                context_data_position = 0
                                context_data.push(getCharFromInt(context_data_val))
                                context_data_val = 0
                            } else {
                                context_data_position++
                            }
                            value = value >> 1
                        }
                    }
                    context_enlargeIn--
                    if (context_enlargeIn === 0) {
                        context_enlargeIn = Math.pow(2, context_numBits)
                        context_numBits++
                    }
                    delete context_dictionaryToCreate[context_w]
                } else {
                    value = context_dictionary[context_w]
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1)
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0
                            context_data.push(getCharFromInt(context_data_val))
                            context_data_val = 0
                        } else {
                            context_data_position++
                        }
                        value = value >> 1
                    }
                }
                context_enlargeIn--
                if (context_enlargeIn === 0) {
                    context_enlargeIn = Math.pow(2, context_numBits)
                    context_numBits++
                }
            }

            // Mark the end of the stream
            value = 2
            yield
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1)
                if (context_data_position === bitsPerChar - 1) {
                    context_data_position = 0
                    context_data.push(getCharFromInt(context_data_val))
                    context_data_val = 0
                } else {
                    context_data_position++
                }
                value = value >> 1
            }
            yield
            // Flush the last char
            while (true) {
                context_data_val = context_data_val << 1
                if (context_data_position === bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val))
                    break
                } else context_data_position++
            }
            yield true
            return context_data.join('')
        },

        decompress: function* (compressed) {
            if (compressed === null) return ''
            if (compressed === '') return null
            return yield* LZString._decompress(compressed.length, 32768, function (index) {
                return compressed.charCodeAt(index)
            })
        },

        _decompress: function* (length, resetValue, getNextValue) {
            var d = [],
                enlargeIn = 4,
                dictSize = 4,
                numBits = 3,
                entry = '',
                result = [],
                i,
                w,
                bits,
                resb,
                maxpower,
                power,
                c,
                data = { val: getNextValue(0), position: resetValue, index: 1 }

            for (i = 0; i < 3; i += 1) {
                d[i] = i
            }

            bits = 0
            maxpower = Math.pow(2, 2)
            power = 1
            while (power !== maxpower) {
                resb = data.val & data.position
                data.position >>= 1
                if (data.position === 0) {
                    data.position = resetValue
                    data.val = getNextValue(data.index++)
                }
                bits |= (resb > 0 ? 1 : 0) * power
                power <<= 1
            }

            switch (bits) {
                case 0:
                    bits = 0
                    maxpower = Math.pow(2, 8)
                    power = 1
                    while (power !== maxpower) {
                        resb = data.val & data.position
                        data.position >>= 1
                        if (data.position === 0) {
                            data.position = resetValue
                            data.val = getNextValue(data.index++)
                        }
                        bits |= (resb > 0 ? 1 : 0) * power
                        power <<= 1
                    }
                    c = f(bits)
                    break
                case 1:
                    bits = 0
                    maxpower = Math.pow(2, 16)
                    power = 1
                    while (power !== maxpower) {
                        resb = data.val & data.position
                        data.position >>= 1
                        if (data.position === 0) {
                            data.position = resetValue
                            data.val = getNextValue(data.index++)
                        }
                        bits |= (resb > 0 ? 1 : 0) * power
                        power <<= 1
                    }
                    c = f(bits)
                    break
                case 2:
                    return ''
                default:
                    break
            }
            d[3] = c
            w = c
            result.push(c)
            let ic = 0
            while (true) {
                if ((ic++ & YIELD_MASK) === 0) yield
                if (data.index > length) {
                    return ''
                }

                bits = 0
                maxpower = Math.pow(2, numBits)
                power = 1
                while (power !== maxpower) {
                    if ((ic++ & YIELD_MASK) === 0) yield
                    resb = data.val & data.position
                    data.position >>= 1
                    if (data.position === 0) {
                        data.position = resetValue
                        data.val = getNextValue(data.index++)
                    }
                    bits |= (resb > 0 ? 1 : 0) * power
                    power <<= 1
                }

                switch ((c = bits)) {
                    case 0:
                        bits = 0
                        maxpower = Math.pow(2, 8)
                        power = 1
                        while (power !== maxpower) {
                            if ((ic++ & YIELD_MASK) === 0) yield
                            resb = data.val & data.position
                            data.position >>= 1
                            if (data.position === 0) {
                                data.position = resetValue
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power
                            power <<= 1
                        }

                        d[dictSize++] = f(bits)
                        c = dictSize - 1
                        enlargeIn--
                        break
                    case 1:
                        bits = 0
                        maxpower = Math.pow(2, 16)
                        power = 1
                        while (power !== maxpower) {
                            if ((ic++ & YIELD_MASK) === 0) yield
                            resb = data.val & data.position
                            data.position >>= 1
                            if (data.position === 0) {
                                data.position = resetValue
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power
                            power <<= 1
                        }
                        d[dictSize++] = f(bits)
                        c = dictSize - 1
                        enlargeIn--
                        break
                    case 2:
                        return result.join('')
                    default:
                        break
                }

                if (enlargeIn === 0) {
                    enlargeIn = Math.pow(2, numBits)
                    numBits++
                }

                if (d[c]) {
                    entry = d[c]
                } else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0)
                    } else {
                        return null
                    }
                }
                result.push(entry)

                // Add w+entry[0] to the d.
                d[dictSize++] = w + entry.charAt(0)
                enlargeIn--

                w = entry

                if (enlargeIn === 0) {
                    enlargeIn = Math.pow(2, numBits)
                    numBits++
                }
            }
        },
    }
    return LZString
})()

export { LZStringGenerator }
