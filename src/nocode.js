import Formally from './index';

const formsWithValidateClass = Array.from(document.querySelectorAll('form:not([novalidate]'));

export const def = () => {
  formsWithValidateClass.forEach(form => {
    new Formally(form);
  });
};

def();

// That's all
