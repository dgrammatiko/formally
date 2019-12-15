/**
 * The Class defaults, can be overriden through data-*
 *
 * @example
 * <form
 *  data-valid-class="is-valid"              Any string that qualifies for a class (no spaces)
 *  data-invalid-class="is-invalid"          Any string that qualifies for a class (no spaces)
 *  data-invalid-indicator="true"            true or false
 *  data-invalid-indicator-element="span"    Any Element, suggested span or div
 *  data-invalid-indicator-position="after"  after or before
 *  data-invalid-indicator-class="after"     Any string that qualifies for a class (no spaces)
 *  data-invalid-form="text"                 Any string
 *  data-invalid-form-alert="true"           true or false
 *
 */
export const defaults = {
  validClass: 'is-valid',
  invalidClass: 'is-invalid',
  indicator: true,
  indicatorElement: 'span',
  indicatorPosition: 'after',
  indicatorClass: 'invalid-feedback',
  invalidForm: 'Form is not valid!',
  invalidFormAlert: false
};
