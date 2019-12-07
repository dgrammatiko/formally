import { Formally } from './bootstrap4';

const formsWithValidateClass = Array.from(document.querySelectorAll('form:not([novalidate]'));

// Global scope
window.Formally = Formally;

const def = () => {
  formsWithValidateClass.forEach(form => {
    new Formally(form);
  });
};

def();

export { Formally }
