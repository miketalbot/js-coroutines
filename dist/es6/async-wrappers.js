import { wrapAsPromise, yielding } from "./wrappers";
import { stringify } from "./json";
import { parse } from "./yastjson/lib/parse";
import { sort } from "./timsort";
import {
  concat,
  filter,
  find,
  findIndex,
  map,
  reduce,
  append,
  forEach,
  some,
  every,
} from "./array-utilities";
import { LZStringGenerator } from "./lz-string/lz-string";
import { Base64StringGenerator } from "./lz-string/base64-string";

function wrapAsPromiseAndYieldFn(fn) {
  let yielder = wrapAsPromise(fn);
  return function (array, fn) {
    return yielder(array, yielding(fn));
  };
}

export const stringifyAsync = wrapAsPromise(stringify);
export const parseAsync = wrapAsPromise(parse);
export const sortAsync = wrapAsPromise(sort);
export const findAsync = wrapAsPromiseAndYieldFn(find);
export const findIndexAsync = wrapAsPromiseAndYieldFn(findIndex);
export const mapAsync = wrapAsPromiseAndYieldFn(map);
export const filterAsync = wrapAsPromiseAndYieldFn(filter);
export const reduceAsync = wrapAsPromiseAndYieldFn(reduce);
export const appendAsync = wrapAsPromise(append);
export const concatAsync = wrapAsPromise(concat);
export const forEachAsync = wrapAsPromiseAndYieldFn(forEach);
export const someAsync = wrapAsPromiseAndYieldFn(some);
export const everyAsync = wrapAsPromiseAndYieldFn(every);
// Compression
export const compressToBase64Async = wrapAsPromise(
  LZStringGenerator.compressToBase64
);
export const compressToUTF16 = wrapAsPromise(LZStringGenerator.compressToUTF16);
export const compressToUint8Array = wrapAsPromise(
  LZStringGenerator.compressToUint8Array
);
export const compressToEncodeURIComponent = wrapAsPromise(
  LZStringGenerator.compressToEncodeURIComponent
);
export const compressAsync = wrapAsPromise(LZStringGenerator.compress);
export const base64CompressToUTF16Async = wrapAsPromise(
  Base64StringGenerator.compressToUTF16
);
export const base64Compress = wrapAsPromise(Base64StringGenerator.compress);
// Decompression
export const decompressFromBase64Async = wrapAsPromise(
  LZStringGenerator.decompressFromBase64
);
export const decompressFromUTF16 = wrapAsPromise(
  LZStringGenerator.decompressFromUTF16
);
export const decompressFromUint8Array = wrapAsPromise(
  LZStringGenerator.decompressFromUint8Array
);
export const decompressFromEncodeURIComponent = wrapAsPromise(
  LZStringGenerator.decompressFromEncodeURIComponent
);
export const decompressAsync = wrapAsPromise(LZStringGenerator.decompress);
export const base64decompressFromUTF16Async = wrapAsPromise(
  Base64StringGenerator.decompressFromUTF16
);
export const base64Decompress = wrapAsPromise(Base64StringGenerator.decompress);
