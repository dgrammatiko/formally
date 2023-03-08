/**
 * The Class defaults, can be overriden through data-*
 *
 * @example
 * <form
 *  data-valid-class="is-valid"              Any string that qualifies for a class (no spaces)
 *  data-invalid-class="is-invalid"          Any string that qualifies for a class (no spaces)
 *  data-invalid-indicator="true"            true or false
 *
 */
export const defaultSettings = {
  validClass: 'is-valid',
  invalidClass: 'is-invalid',
  liveCheck: false,
};

export const defaultStates = [
  'badInput',
  // 'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valid',
  'valueMissing'
];
