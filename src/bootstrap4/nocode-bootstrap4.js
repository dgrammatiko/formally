/* eslint no-undef: 0 */
import { Formally } from './bootstrap4';

const forms = [...document.querySelectorAll('form:not([novalidate]')];
const submitters = [...document.querySelectorAll('[type="submit"]')];

forms.forEach(form => {
  new Formally(form);
});

submitters.forEach(submit => {
  submit.addEventListener('click', (e) => {
    if (!submit.form.Formally || !submit.form.Formally.isValid()) {
      e.preventDefault();
      e.preventPropagation();
    }
  });
});

export { Formally };
