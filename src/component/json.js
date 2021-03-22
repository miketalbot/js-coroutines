//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  https://github.com/douglascrockford/JSON-js

//eslint-disable-next-line no-control-regex
var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
//eslint-disable-next-line no-control-regex
var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

var gap;
var indent;
var meta;

var yieldCount = 0;
function yielder() {
  yieldCount++;
  if (yieldCount > 256) {
    yieldCount = 0;
    return true;
  }
  return false;
}

function* quote(string) {
  let result = ['"'];
  for (let i = 0, l = string.length; i < l; i++) {
    if ((i & 7) === 0 && yielder()) yield;
    let c = string[i];
    if (c === '"' || rx_escapable.test(c)) {
      const r = meta[c];
      if (typeof r === "string") {
        result.push(r)
      } else {
        result.push( "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4));
      }
    } else if (!rx_dangerous.test(c)) {
      result.push(c);
    }
  }
  result.push('"')
  return result.join('')
}

function* str(key, holder, ctrl) {
  // Produce a string from holder[key].
  const { rep } = ctrl;
  if (yielder()) yield;

  var i; // The loop counter.
  var k; // The member key.
  var v; // The member value.
  var length;
  var mind = gap;
  var partial;
  var value = holder[key];

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

  if (
    value &&
    typeof value === "object" &&
    typeof value.toJSON === "function"
  ) {
    value = value.toJSON(key);
  }

  if (typeof rep === "function") {
    value = rep.call(holder, key, value);
  }

  // What happens next depends on the value's type.

  switch (typeof value) {
    case "string":
      return yield* quote(value);

    case "number":
      // JSON numbers must be finite. Encode non-finite numbers as null.

      return isFinite(value) ? String(value) : "null";

    case "boolean":
    case "null":
      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce "null". The case is included here in
      // the remote chance that this gets fixed someday.

      return String(value);

    // If the type is "object", we might be dealing with an object or an array or
    // null.

    default:
      // Due to a specification blunder in ECMAScript, typeof null is "object",
      // so watch out for that case.

      if (!value) {
        return "null";
      }

      // Make an array to hold the partial results of stringifying this object value.

      gap += indent;
      partial = [];

      // Is the value an array?

      if (Object.prototype.toString.apply(value) === "[object Array]") {
        // The value is an array. Stringify every element. Use null as a placeholder
        // for non-JSON values.

        length = value.length;
        v = "[";
        for (i = 0; i < length; i += 1) {
          v =
            v +
            (yield* str(i, value, ctrl) || "null") +
            (i !== length - 1 ? "," : "");
        }
        return v + "]";
      }

      // If the replacer is an array, use it to select the members to be stringified.

        // Otherwise, iterate through all of the keys in the object.
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = yield* str(k, value, ctrl);
            if (v) {
              partial.push((yield* quote(k)) + (gap ? ": " : ":") + v);
            }
          }
        }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.
      v =
        partial.length === 0
          ? "{}"
          : gap
          ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
          : "{" + partial.join(",") + "}";
      gap = mind;
      return v;
  }
}

// If the JSON object does not yet have a stringify method, give it one.

meta = {
  // table of character substitutions
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  '"': '\\"',
  "\\": "\\\\",
};
export function* stringify(value, replacer) {
  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

  gap = "";
  indent = "";

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

  if (
    replacer &&
    typeof replacer !== "function" &&
    (typeof replacer !== "object" || typeof replacer.length !== "number")
  ) {
    throw new Error("JSON.stringify");
  }

  // Make a fake root object containing our value under the key of "".
  // Return the result of stringifying the value.

  return yield* str("", { "": value }, { rep: replacer });
}
