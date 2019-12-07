import { uaSupportsPassive } from './utils'
import { defaults } from './defaults'

class FormValidatorBase {
  constructor(form) {
    this.form = form;
    if (!form || form.constructor.name !== 'HTMLFormElement') {
      throw new Error('Validator needs a form element');
    }

    if (this.form.hasAttribute('novalidate')) {
      return;
    }

    // Options through data-*
    // Eg: for validClass the attribute will be data-valid-class
    this.options = defaults;

    if (this.form.dataset) {
      for (const data in this.form.dataset) {
        if (this.options.hasOwnProperty(data)) {
          if (data === 'indicator' || data === 'attachChange' || data === 'attachInput') {
            this.options[data] = (this.form.dataset[data] === 'true');
          } else {
            this.options[data] = this.form.dataset[data];
          }
        }
      }
    }

    this.passiveSupported = uaSupportsPassive();
    this.elementsForValidation = [];
    this.formElementValidate = this.formElementValidate.bind(this);
    this.reAttachElement = this.reAttachElement.bind(this);

    this.init();

    // The class instance is accesible at: form.Formally
    this.form.Formally = this;
  }

  formElementValidate(event) {
    // Custom validators are set through formElement.FormallyCustomValidator
    const formElement = event.target;
    if (formElement.FormallyCustomValidator && typeof formElement.FormallyCustomValidator === 'function') {
      formElement.customValidator()
    } else {
      formElement.checkValidity();
    }
    this.notify(formElement);
  }

  getCustomMessage(input, type, validity) {
    var data = input.dataset;
    if (typeof data === 'object') {
      if (validity.typeMismatch && data[type + 'Mismatch']) {
        return data[type + 'Mismatch'];
      } else {
        for (var invalidKey in data) {
          if (data.hasOwnProperty(invalidKey) && validity[invalidKey]) {
            return data[invalidKey];
          }
        }
      }
    }
    return undefined;
  }

  switchClasses(formElement, isValid) {
    if (isValid) {
      formElement.classList.remove(this.options.invalidClass);
      formElement.classList.add(this.options.validClass);
    } else {
      formElement.classList.remove(this.options.validClass);
      formElement.classList.add(this.options.invalidClass);
    }
  }

  notify(formElement) {
    return;
  }

  elementInit(formElement) {
    return;
  }

  isValid() {
    this.elementsForValidation.forEach((formElement) => {
      if (!formElement.validity.valid) {
        formElement.classList.add(this.options.validClass);
        formElement.classList.remove(this.options.validClass);
      } else {
        formElement.classList.remove(this.options.validClass);
        formElement.classList.add(this.options.validClass);
      }
      this.notify(formElement)
    });

    if (this.form.checkValidity()) {
      return true;
    } else {
      return false;
    }
  }

  init() {
    [].slice.call(this.form.elements).forEach((formElement) => {
      const type = formElement.tagName;
      if (type && (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA')) {
        this.elementsForValidation.push(formElement)
        formElement.addEventListener('blur', this.formElementValidate), this.passiveSupported ? { passive: true } : false;

        if (this.options.attachChange || this.form.dataset.attachChange) {
          formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
        }

        if (this.options.attachInput || this.form.dataset.attachInput) {
          formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
        }

        if (this.options.indicator && (this.form.dataset && Object.keys(this.form.dataset).length !== 0)) {
          this.elementInit(formElement);
        }
      }
    });
  }

  reAttachElement(formElement) {
    const type = formElement.tagName;
    formElement.removeEventListener('blur', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
    formElement.removeEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
    formElement.removeEventListener('input', this.formElementValidate, this.passiveSupported ? { passive: true } : false);

    if (type && (type === 'INPUT' || type === 'SELECT' || type === 'TEXTAREA')) {
      formElement.addEventListener('blur', this.formElementValidate, this.passiveSupported ? { passive: true } : false);

      if (this.options.attachChange || this.form.dataset.attachChange) {
        formElement.addEventListener('change', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
      }

      if (this.options.attachInput || this.form.dataset.attachInput) {
        formElement.addEventListener('input', this.formElementValidate, this.passiveSupported ? { passive: true } : false);
      }

      if (this.options.indicator && (this.form.dataset && Object.keys(this.form.dataset).length !== 0)) {
        this.elementInit(formElement);
      }
    }
  }
}

export { FormValidatorBase };
