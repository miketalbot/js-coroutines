import { yielder } from "./yielder";

export function* unescapeJsonString(text) {
  // NOTE: We don't use JSON.parse('"' + text + '"") or similar
  //       because we want to support input that may not be valid JSON.

  // Holds the unescaped string as we build it.
  let plain = "";

  // Use a string iterator over code points for proper unicode support.
  const iter = text[Symbol.iterator]();

  let cur;
  while (!(cur = iter.next()).done) {
    if (yielder()) yield;
    if (cur.value === "\\") {
      cur = iter.next();
      if (cur.done) {
        plain += "\\";
        break;
      } else if (cur.value === '"') {
        plain += '"';
      } else if (cur.value === "\\") {
        plain += "\\";
      } else if (cur.value === "/") {
        plain += "/";
      } else if (cur.value === "b") {
        plain += "\b";
      } else if (cur.value === "f") {
        plain += "\f";
      } else if (cur.value === "n") {
        plain += "\n";
      } else if (cur.value === "r") {
        plain += "\r";
      } else if (cur.value === "t") {
        plain += "\t";
      } else if (cur.value === "u") {
        const one = iter.next();
        if (one.done) {
          plain += "\\u";
        } else if (!this.isHexDigit(one.value)) {
          plain += "\\u" + one.value;
        } else {
          const two = iter.next();
          if (two.done) {
            plain += "\\u" + one.value;
          } else if (!this.isHexDigit(two.value)) {
            plain += "\\u" + one.value + two.value;
          } else {
            const three = iter.next();
            if (three.done) {
              plain += "\\u" + one.value + two.value;
            } else if (!this.isHexDigit(three.value)) {
              plain += "\\u" + one.value + two.value + three.value;
            } else {
              const four = iter.next();
              if (four.done) {
                plain += "\\u" + one.value + two.value + three.value;
              } else if (!this.isHexDigit(four.value)) {
                plain +=
                  "\\u" + one.value + two.value + three.value + four.value;
              } else {
                try {
                  plain += JSON.parse(
                    '"\\u' +
                      one.value +
                      two.value +
                      three.value +
                      four.value +
                      '"'
                  );
                } catch {
                  // Something went wrong even though it looked like a valid hex value.
                  plain +=
                    "\\u" + one.value + two.value + three.value + four.value;
                }
              }
            }
          }
        }
      } else {
        plain += cur.value;
      }
    } else {
      plain += cur.value;
    }
  }

  return plain;
}

export function isHexDigit(char) {
  return (
    char === "0" ||
    char === "1" ||
    char === "2" ||
    char === "3" ||
    char === "4" ||
    char === "5" ||
    char === "6" ||
    char === "7" ||
    char === "8" ||
    char === "9" ||
    char === "A" ||
    char === "B" ||
    char === "C" ||
    char === "D" ||
    char === "E" ||
    char === "F" ||
    char === "a" ||
    char === "b" ||
    char === "c" ||
    char === "d" ||
    char === "e" ||
    char === "f"
  );
}
