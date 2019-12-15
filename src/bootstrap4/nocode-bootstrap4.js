/* eslint no-undef: 0 */
import { Formally } from './bootstrap4';

const formsWithoutNovalidateAttribute = Array.from(document.querySelectorAll('form:not([novalidate]'));

// Global scope
window.Formally = Formally;

const def = () => {
  formsWithoutNovalidateAttribute.forEach(form => {
    new Formally(form);
  });
};

def();

export { Formally };
