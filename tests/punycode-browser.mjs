/**
 * Minimal ESM wrapper for punycode for browser tests.
 * Provides toASCII as a pass-through for ASCII input (sufficient for test email validation).
 */
export default {
  toASCII: (domain) => domain,
  toUnicode: (domain) => domain,
  encode: (input) => input,
  decode: (input) => input,
  ucs2: {
    decode: (s) => [...s],
    encode: (cps) => String.fromCodePoint(...cps),
  },
  version: '2.3.1',
};
