/* eslint no-undef: 0 */
import { FormallyBs4 } from './bootstrap4';

const forms = [...document.querySelectorAll('form:not([novalidate]')];

forms.forEach(form => {
  new FormallyBs4(form);
});

export { FormallyBs4 };
