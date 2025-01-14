/* eslint-disable */
const cache = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];

export function leftPad(str, len, ch) {
  // convert `str` to `string`
  str = `${str}`;
  // `len` is the `pad`'s length now
  //
  let reverse = 0;
  if (len < 0) {
    len *= -1;
    reverse = 1;
  }
  len -= str.length;
  // doesn't need to pad
  if (len <= 0) return str;
  // `ch` defaults to `' '`
  if (!ch && ch !== 0) ch = ' ';
  // convert `ch` to `string`
  ch = `${ch}`;
  // cache common use cases
  if (ch === ' ' && len < 10) return reverse ? str + cache[len] : cache[len] + str;
  // `pad` starts with an empty string
  let pad = '';
  // loop
  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch;
    // divide `len` by 2, ditch the remainder
    len >>= 1;
    // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))
    if (len) ch += ch;
    // `len` is 0, exit the loop
    else break;
  }
  // pad `str`!

  return reverse ? str + pad : pad + str;
}

export default leftPad